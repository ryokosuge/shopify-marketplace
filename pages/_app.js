import ApolloClient, { InMemoryCache } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import App from "next/app";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";

import { ExtendedAppProvider } from "@shopify/channels-ui";

import polarisTranslations from "@shopify/polaris/locales/en.json";
import translations from "@shopify/channels-ui/locales/en.json";

import { createTheme, ThemeProvider } from "@mui/material";
import "@shopify/polaris/dist/styles.css";
import "@shopify/channels-ui/dist/styles.css"

function MarketplaceProvider(props) {
  const client = new ApolloClient({
    uri: `http://localhost:8081/graphql`,
    cache: new InMemoryCache(),
  });

  const Component = props.Component;
  return (
    <ApolloProvider client={client}>
      <ThemeProvider
        theme={createTheme({
          typography: {
            fontFamily: "Source Sans Pro",
            htmlFontSize: 16,
            allVariants: {
              color: "#212326",
            },
            h1: {
              letterSpacing: "0.05em",
              fontWeight: "700",
              fontSize: "2.25rem",
              textTransform: "uppercase",
            },
            h2: {
              letterSpacing: "0.05em",
              fontWeight: "700",
              fontSize: "1.5rem",
              textTransform: "uppercase",
            },
            h3: {
              fontSize: "1.125rem",
              fontWeight: "600",
              letterSpacing: "0.02em",
            },
            body1: {
              fontSize: "1rem",
              letterSpacing: "0.02em",
            },
            body2: {
              fontSize: "1.5rem",
              fontWeight: "700",
              letterSpacing: "0.02em",
              color: "#006D51",
            },
            caption: {
              fontSize: "1rem",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            },
            button: {
              fontWeight: "700",
              letterSpacing: "0.05em",
            },
            subtitle1: {
              fontWeight: "700",
              fontSize: "2rem",
              letterSpacing: "0.02em",
              color: "#006D51",
            },
            subtitle2: {
              fontSize: "1.125rem",
              fontWeight: "700",
              letterSpacing: "0.02em",
            },
          },
          palette: {
            primary: {
              main: "#006D51",
            },
            secondary: {
              main: "#006D51",
            },
            text: {
              primary: "#212326",
            },
          },
        })}
      >
        <Component {...props} />
      </ThemeProvider>
    </ApolloProvider>
  );
}

function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}

function AdminProvider(props) {
  const app = useAppBridge();

  const client = new ApolloClient({
    fetch: userLoggedInFetch(app),
    fetchOptions: {
      credentials: "include",
    },
  });

  const Component = props.Component;

  return (
    <ApolloProvider client={client}>
      <Component {...props} />
    </ApolloProvider>
  );
}

class MyApp extends App {
  render() {
    const { Component, pageProps, host, isAdmin } = this.props;
    if (isAdmin) {
      return (
        <ExtendedAppProvider
          i18n={translations}
          polaris={{
            i18n: polarisTranslations,
          }}
          config={{
            apiKey: API_KEY,
            host: host,
            forceRedirect: true,
          }}
        >
          <AdminProvider Component={Component} {...pageProps} />
        </ExtendedAppProvider>
      );
    }
    // return  <Component {...pageProps} />;
    return <MarketplaceProvider Component={Component} {...pageProps} />;
  }
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    host: ctx.query.host,
    isAdmin: ctx.pathname.indexOf("/admin") > -1,
  };
};

export default MyApp;
