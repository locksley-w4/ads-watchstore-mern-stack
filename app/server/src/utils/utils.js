import fs from "fs/promises";
import path from "path";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { S3FetchOffersCommand } from "../configs/aws-s3.js";

export async function getOfferBannerList() {
  // const offersDir = path.resolve("./uploads/offer-banners");
  // const offerList = await fs.readdir(offersDir);
  const response = await s3.send(S3FetchOffersCommand);
  const fileNames = response.Contents.map(obj => obj.Key);
  return fileNames.map((elem) => "/uploads/" + elem);

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

export async function backfillProperty() {
  const response = await Product.updateMany(
    {},
    // { createdAt: { $exists: false } },
    [{
      $set: {
        createdAt: {
          $toDate: "$_id",
        },
      },
    }]
  );
  console.log(response);
}
