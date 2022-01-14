import "isomorphic-fetch";
import { gql } from "apollo-boost";
import { createClient } from "../client";

const STOREFRONT_ACCESS_TOKENS = gql`
  query {
    shop {
      storefrontAccessTokens(first: 1) {
        edges {
          node {
            accessToken
          }
        }
      }
    }
  }
`;

export const getStorefrontAccessToken = async (shop, token) => {
  const client = createClient(shop, token);
  const resp = await client.query({
    query: STOREFRONT_ACCESS_TOKENS,
  });

  const storefrontAccessTokens = resp.data.shop.storefrontAccessTokens.edges;
  if (storefrontAccessTokens.length === 0) {
    return null;
  }

  return storefrontAccessTokens[0].node.accessToken;
}
