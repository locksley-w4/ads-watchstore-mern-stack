import fs from "fs/promises";
import path from "path";
import User from "../models/User.js";

export async function getOfferBannerList() {
  const offersDir = path.resolve("./uploads/offer-banners");
  const offerList = await fs.readdir(offersDir);
  return offerList.map((elem) => "/uploads/offer-banners/" + elem);
}

// (async function () {
//   const updated = await User.updateMany({}, { cart: {} });
//   console.log(updated);
// })();

export const filterCart = (cart) => {
  for (const key in cart) {
    if (!Object.hasOwn(cart, key)) continue;
    if (cart[key] <= 0) delete cart[key];
  }
  return cart;
};
