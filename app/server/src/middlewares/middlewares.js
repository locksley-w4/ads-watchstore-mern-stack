import jwt from "jsonwebtoken";

let requests = 0;

export function logger(req, res, next) {
  console.log("Upcoming request #", requests++);
  next();
}

export function checkAuth(req, res, next) {
  try {
    const accessToken = req.headers?.authorization?.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({ message: "Please sign in" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    if (decoded) {
      req.user = decoded;
      return next();
    }
    res.status(401).json({ message: "Please sign in again" });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Please sign in" });
  }
}
