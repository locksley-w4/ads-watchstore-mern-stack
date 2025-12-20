import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 1000 * 60 * 10,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 1000 * 60 * 10,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many auth attempts. Try again later"
});
