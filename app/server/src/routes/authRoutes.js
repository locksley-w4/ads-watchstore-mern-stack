import express from "express";
import {
  handleLogin,
  handleLogout,
  handleRefresh,
  handleRegister,
} from "../controllers/authController.js";
import { checkAuth } from "../middlewares/middlewares.js";
import { authLimiter } from "../middlewares/rateLimiters/rateLimiters.js";
const authRouter = express.Router();

export default authRouter;

authRouter.post("/login", authLimiter, handleLogin);

authRouter.post("/logout", checkAuth, handleLogout);

authRouter.post("/register", authLimiter, handleRegister);

authRouter.post("/refresh", handleRefresh);
