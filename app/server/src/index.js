// console.log(process.env);
// import dotenv from "dotenv";
// dotenv.config();

import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes.js";
import cors from "cors";
import { logger } from "./middlewares/middlewares.js";
import { sessionConfig } from "./configs/sessionConfig.js";
import cookieParser from "cookie-parser";
import { backfillProperty } from "./utils/utils.js";
import { globalLimiter } from "./middlewares/rateLimiters/rateLimiters.js";

const app = express();
const PORT = process.env.PORT ?? 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Successfully connected to db"))
  // .then(() => {backfillProperty()})
  .catch((err) => console.error(err));

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(sessionConfig);

app.use("/uploads", express.static("uploads"));

app.use(globalLimiter)

app.use(logger); // logs request number

app.use("/v1", userRouter);
// app.use("/api/v1", userRouter);

app.listen(PORT, (err) => {
  if (err) return console.error(err);
  console.log("Server is listening on port: ", PORT);
});
