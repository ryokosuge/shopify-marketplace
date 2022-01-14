import "isomorphic-fetch";
import { gql } from "apollo-boost";
import { createClient } from "../client";

const SHOP_NAME = gql`
  query {
    shop {
      name
    }
  }
`;

export const getShopDetails = async (shop, token) => {
  const client = createClient(shop, token);
  const resp = await client.query({
    query: SHOP_NAME,
  })
  return resp.data.shop;
}
