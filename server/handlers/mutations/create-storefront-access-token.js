import "isomorphic-fetch";
import { gql } from "apollo-boost";
import { createClient } from "../client";

const STOREFRONT_ACCESS_TOKENS_CREATE = gql`
  mutation storefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
    storefrontAccessTokenCreate(input: $input) {
      storefrontAccessToken {
        accessToken
      }
    }
  }
`;

export const createStorefrontAccessToken = async (shop, token) => {
  const client = createClient(shop, token);
  const input = {
    title: "fluct marketplace access token",
  };

  const resp = await client.mutate({
    mutation: STOREFRONT_ACCESS_TOKENS_CREATE,
    variables: {
      input
    }
  });

  return resp.data.storefrontAccessTokenCreate.storefrontAccessToken.accessToken;
}
