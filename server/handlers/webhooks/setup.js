import Shopify from "@shopify/shopify-api";
import { handleShopUpdate } from "./shop-update";

export const setupWebhooks = async (shop, accessToken) => {
  const appUnintallResponse = await Shopify.Webhooks.Registry.register({
    shop,
    accessToken,
    path: "/webhooks",
    topic: "APP_UNINSTALLED",
    webhookHandler: async (topic, shop, body) => await Shopify.Utils.deleteOfflineSession(shop),
  });

  if (!appUnintallResponse.success) {
    console.log(
      `Failed to register APP_UNINSTALLED webhook: ${appUnintallResponse.result}`
    );
  }

  const shopUpdateResponse = await Shopify.Webhooks.Registry.register({
    shop,
    accessToken,
    path: "/webhooks",
    topic: "SHOP_UPDATE",
    webhookHandler: async (topic, shop, body) => await handleShopUpdate(shop, body),
  });

  if (!shopUpdateResponse.success) {
    console.log(
      `Failed to register SHOP_UPDATE webhook: ${shopUpdateResponse.result}`
    );
  }
}
