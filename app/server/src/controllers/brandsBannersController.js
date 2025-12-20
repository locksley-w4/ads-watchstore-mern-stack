import Brand from "../models/Brand.js";
import { getOfferBannerList } from "../utils/utils.js";

export const handleGetBanners = async (req, res) => {
  try {
    const bannerList = await getOfferBannerList();
    res.status(200).json(bannerList);
  } catch (error) {
    console.error(error);
  }
};

export const handleGetBrands = async (req, res) => {
  try {
    const brandList = await Brand.find();
    if (brandList.length) {
      return res.status(200).json(brandList);
    }
    return res.status(404).json({ message: "No brands found" });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export const handleCreateBrands = async (req, res) => {
  try {
    const newBrands = await Brand.insertMany(req.body);
    return res.status(201).json(newBrands);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};
