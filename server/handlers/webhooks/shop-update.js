import { updateShopName } from "../../model/shop";

export const handleShopUpdate = async (shop, body) => {
  const name = JSON.parse(body).name;
  updateShopName(shop, name);
}
