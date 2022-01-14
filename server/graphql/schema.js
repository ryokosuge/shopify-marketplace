import { gql } from "apollo-server-koa"

export const schemaString = `
type Shop {
  id: ID!
  domain: String!
  storefrontAccessToken: String!
}
type AdminShop {
  id: ID!
  domain: String!
  publicationId: String!
  availableProductCount: Int!
  appHandle: String!
}
type Query {
  shops(nameIsLike: String): [Shop]
  adminShop: AdminShop
}
`;

export const schema = gql(schemaString);
