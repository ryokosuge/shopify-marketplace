const shops = [];

export const getShops = () => shops;

export const getShop = (shop) => {
  return shops.find((element) => element.domain === shop);
}

export const updateShopName = (shop, name) => {
  console.log(shops);
  const index = shops.findIndex((element) => element.domain === shop)
  if (index > 0) {
    shops[index]["name"] = name
  }
  console.log(shops);
}

export const addShopData = (data) => {
  const id = shops.length + 1;
  shops.push({
    id,
    ...data
  });
}
