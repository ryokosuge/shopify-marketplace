import { createClient } from "./client";

import { getOneTimeUrl } from "./mutations/get-one-time-url";
import { getSubscriptionUrl } from "./mutations/get-subscription-url";
import { createStorefrontAccessToken } from "./mutations/create-storefront-access-token";

import { getStorefrontAccessToken } from "./queries/get-storefront-access-token";
import { getPublicationId } from "./queries/get-publication-id";
import { getAppHandle } from "./queries/get-app-handle";
import { getShopDetails } from "./queries/get-shop-details";

import { getProductListingsCount } from "./rest/get-product-listings-count";

import { setupWebhooks } from "./webhooks/setup";

export {
  createClient,
  getOneTimeUrl,
  getSubscriptionUrl,
  getStorefrontAccessToken,
  getPublicationId,
  getAppHandle,
  createStorefrontAccessToken,
  getProductListingsCount,
  getShopDetails,
  setupWebhooks,
};
