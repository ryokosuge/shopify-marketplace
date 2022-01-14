import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import { getCreateStorefrontAccessToken } from "./helpers";
import { addShopData } from "./model/shop";
import { ApolloServer } from "apollo-server-koa";
import { resolvers, schema } from "./graphql";
import { getShopDetails, setupWebhooks } from "./handlers";

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\/|\/$/g, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      accessMode: "offline",
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken } = ctx.state.shopify;
        const storefrontAccessToken = await getCreateStorefrontAccessToken(
          shop,
          accessToken
        );
        const { name } = await getShopDetails(shop, accessToken);
        const shopData = {
          domain: shop,
          storefrontAccessToken,
          name,
        };
        console.log(shopData);
        addShopData(shopData);

        await setupWebhooks(shop, accessToken);

        const host = ctx.query.host;
        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/admin?shop=${shop}&host=${host}`);
      },
    })
  );

  const graphQLServer = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers,
    playground: {
      endpoint: "/graphql",
    },
    bodyParser: true,
    context: async ({ ctx }) => {
      const authHeader = ctx.req.headers.authorization;
      const matches = authHeader?.match(/Bearer (.*)/);
      if (matches && matches.length > 0) {
        const payloade = Shopify.Utils.decodeSessionToken(matches[1]);
        const shop = payloade.dest.replace("https://", "");
        if (shop) {
          const session = await Shopify.Utils.loadOfflineSession(shop);
          if (session) {
            return {
              shop: {
                domain: shop,
                accessToken: session.accessToken
              }
            };
          }
        }
      }
      return {}
    },
  });
  await graphQLServer.start();

  graphQLServer.applyMiddleware({
    app: server,
  });

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  router.get("(/admin.*)", async (ctx) => {
    const shop = ctx.query.shop;
    if (!shop) {
      ctx.redirect("/");
    } else {
      const session = await Shopify.Utils.loadOfflineSession(shop);
      // This shop hasn't been seen yet, go through OAuth to create a session
      if (!session) {
        ctx.redirect(`/auth?shop=${shop}`);
      } else {
        await handleRequest(ctx);
      }
    }
  })

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", async (ctx) => {
    const { shop, host } = ctx.query;
    if (shop && host) {
      ctx.redirect(`/admin?shop=${shop}&host=${host}`);
    } else {
      await handleRequest(ctx);
    }
  });

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
