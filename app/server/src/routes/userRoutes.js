import express from "express";
import {
  handleCreateCategory,
  handleCreateProduct,
  handleEditProduct,
  handleGetCategories,
  handleGetProducts,
} from "../controllers/categoryProductController.js";
import { getOfferBannerList } from "../utils/utils.js";
import { handleCreateBrands, handleGetBanners, handleGetBrands } from "../controllers/brandsBannersController.js";

const userRouter = express.Router();

userRouter.post("/category", handleCreateCategory);

userRouter.get("/categories", handleGetCategories);

userRouter.get("/products", handleGetProducts);

userRouter.post("/product", handleCreateProduct);

userRouter.put("/product/:id", handleEditProduct);

userRouter.get("/offer-list", handleGetBanners);

userRouter.get("/brands", handleGetBrands);

userRouter.post("/brands", handleCreateBrands);

export default userRouter;
