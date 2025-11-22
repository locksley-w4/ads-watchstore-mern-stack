import express from "express";
import {
  handleLogin,
  handleLogout,
  handleRefresh,
  handleRegister,
} from "../controllers/authController.js";
import { checkAuth } from "../middlewares/middlewares.js";
const authRouter = express.Router();

export default authRouter;

authRouter.post("/login", handleLogin);

authRouter.post("/logout", checkAuth, handleLogout);

authRouter.post("/register", handleRegister);

authRouter.post("/refresh", handleRefresh);
