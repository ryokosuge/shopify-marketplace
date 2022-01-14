import Shopify from "@shopify/shopify-api";

export const getProductListingsCount = async (shop, token) => {
  const client = new Shopify.Clients.Rest(shop, token);
  const resp = await client.get({
    path: "product_listings/count",
  })
  return resp.body.count;
}
