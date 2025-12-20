import express from "express";
import {
  handleCreateCategory,
  handleCreateProduct,
  handleDeleteProduct,
  handleEditProduct,
  handleGetCategories,
  handleGetProductById,
  handleGetProducts,
} from "../controllers/categoryProductController.js";
import {
  handleCreateBrands,
  handleGetBanners,
  handleGetBrands,
} from "../controllers/brandsBannersController.js";
import authRouter from "./authRoutes.js";
import {
  deleteCartContent,
  getCart,
  handleChangePassword,
  handleGetUserData,
  handleUserUpdate,
  updateCartContent,
} from "../controllers/userController.js";
import { checkAuth } from "../middlewares/middlewares.js";

const userRouter = express.Router();

userRouter.use("/auth", authRouter);

// Primary User data handlers
userRouter.get("/user", checkAuth, handleGetUserData);

userRouter.put("/user", checkAuth, handleUserUpdate);

userRouter.put("/user-password", checkAuth, handleChangePassword);

// Categories
userRouter.post("/category", handleCreateCategory);

userRouter.get("/categories", handleGetCategories);

// Products
userRouter.get("/products", handleGetProducts);

// userRouter.get("/products-ids", handleGetProducts);

userRouter.post("/product", handleCreateProduct);

userRouter.delete("/product", handleDeleteProduct);

userRouter.put("/product/:id", handleEditProduct);

userRouter.get("/product", handleGetProductById);

// Offer banners
userRouter.get("/offer-list", handleGetBanners);

// Brands
userRouter.get("/brands", handleGetBrands);

userRouter.post("/brands", handleCreateBrands);

// Cart
userRouter.get("/cart", checkAuth, getCart);

userRouter.delete("/cart", checkAuth, deleteCartContent);

userRouter.put("/cart/set/:productId", checkAuth, updateCartContent);

// userRouter.put("/cart/add/:productId", checkAuth, addToCart);

// userRouter.put("/cart/remove/:productId", checkAuth, removeFromCart);

export default userRouter;
