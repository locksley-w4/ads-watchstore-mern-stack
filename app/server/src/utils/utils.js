import fs from "fs/promises";
import path from "path";

export async function getOfferBannerList() {
  const offersDir = path.resolve("./uploads/offer-banners");
  const offerList = await fs.readdir(offersDir);
  return offerList.map((elem) => "/uploads/offer-banners/" + elem);
}
