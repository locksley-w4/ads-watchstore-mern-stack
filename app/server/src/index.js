import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes.js";
import cors from "cors";
import { logger } from "./middlewares/middlewares.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Successfully connected to db"))
  .catch((err) => console.error(err));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use(logger)

app.use("/uploads", express.static("uploads"));

// app.use("/uploads/offer-banners", express.static("uploads/offer-banners"));

app.use("/api/v1", userRouter);

app.listen(PORT, (err) => {
  if (err) return console.error(err);
  console.log("Server is listening on port: ", PORT);
});
