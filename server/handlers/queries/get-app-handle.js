import "isomorphic-fetch";
import { gql } from "apollo-boost";
import { createClient } from "../client";

const APP_HANDLE = gql`
  query {
    currentAppInstallation {
      app {
        handle
      }
    }
  }
`;

export const getAppHandle = async (shop, token) => {
  const client = createClient(shop, token);
  const resp = await client.query({
    query: APP_HANDLE,
  });
  return resp.data.currentAppInstallation.app.handle;
}
