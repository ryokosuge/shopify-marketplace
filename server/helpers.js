import { createStorefrontAccessToken, getStorefrontAccessToken } from "./handlers";

export async function getCreateStorefrontAccessToken(shop, accessToken) {
  const storefrontAccessToken = await getStorefrontAccessToken(
    shop,
    accessToken
  );

  return (
    storefrontAccessToken || (await createStorefrontAccessToken(shop, accessToken))
  );
}
