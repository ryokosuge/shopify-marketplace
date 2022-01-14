import { getAppHandle, getProductListingsCount, getPublicationId } from "../handlers";
import { getShop, getShops } from "../model/shop"

export const resolvers = {
  Query: {
    shops: async (_, args) => {
      let shops = getShops();
      if (args.nameIsLike) {
        shops = shops.filter((shop) => shop.name.includes(args.nameIsLike));
      }
      return shops
    },
    adminShop: async (_, args, ctx) => {
      const { shop } = ctx;
      if (!shop) {
        return null;
      }

      const dbShop = getShop(shop.domain);
      return {
        ...shop,
        ...dbShop
      };
    },
  },
  AdminShop: {
    publicationId: async ({ domain, accessToken }) => await getPublicationId(domain, accessToken),
    availableProductCount: async ({ domain, accessToken }) => await getProductListingsCount(domain, accessToken),
    appHandle: async ({ domain, accessToken }) => await getAppHandle(domain, accessToken),
  },
};
