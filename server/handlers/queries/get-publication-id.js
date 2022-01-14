import "isomorphic-fetch";
import { gql } from "apollo-boost";
import { createClient } from "../client";
import { parseGid } from "@shopify/admin-graphql-api-utilities";

const PUBLICATION_ID = gql`
  query {
    currentAppInstallation {
      publication {
        id
      }
    }
  }
`;

export const getPublicationId = async (shop, token) => {
  const client = createClient(shop, token);
  const resp = await client.query({
    query: PUBLICATION_ID,
  });
  return parseGid(resp.data.currentAppInstallation.publication.id);
}
