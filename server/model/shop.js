const shops = [];

export const getShops = () => shops;

export const getShop = (shop) => {
  console.log(shops);
  return shops.find((element) => element.domain === shop);
}

export const addShopData = (data) => {
  const id = shops.length + 1;
  shops.push({
    id,
    ...data
  });
}
