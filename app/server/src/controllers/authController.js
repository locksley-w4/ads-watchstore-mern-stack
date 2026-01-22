// import dotenv from "dotenv";
// dotenv.config();
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export async function handleLogin(req, res) {
  try {
    if (!req.body) {
      return res.status(401).json({ message: "No userdata was provided." });
    }
    const { login, password } = req.body;
    const user = await User.findOne({
      //   $or: [{ username: login }, { email: login }],
      email: login,
    });

    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }

    const { email, _id: id } = user;
    const success = await user.comparePasswords(password);
    if (!success) {
      return res.status(401).json({ message: "Incorrect password or login." });
    }
    const payload = { id, email };

    const accessToken = jwt.sign(payload, ACCESS_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: "3d",
    });

    req.session.userId = id;
    req.session.email = email;
    req.session.refreshToken = refreshToken;

    req.session.save((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error saving session. Try again later" });
      }
      res.status(200).json({ accessToken, user });
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(error.status || 500);
  }
}

export async function handleLogout(req, res) {
  try {
    const { id } = req.user;
    if (!id) {
      return res.status(201).json({ message: "Already logged out" });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }
      res.clearCookie("connect.sid", { path: "/" });
      res.status(200).json({ message: "Successfully logged out" });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function handleRegister(req, res) {
  try {
    const { email, password, phoneNumber, fullName } = req.body;
    const existingUser = await User.findOne({
      //   $or: [{ username: login }, { email: login }],
      email,
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email is already taken, please sign in" });
    }

    const newUser = await User.create({
      email,
      password,
      phoneNumber,
      fullName,
    });

    const payload = { id: newUser._id, email };

    const accessToken = jwt.sign(payload, ACCESS_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: "3d",
    });
    req.session.userId = newUser._id;
    req.session.email = email;
    req.session.refreshToken = refreshToken;

    req.session.save((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error saving session. Try again later" });
      }
      res.status(201).json({ accessToken, newUser });
    });
  } catch (error) {
    console.error(error.message);
    res.sendStatus(error.status ?? 500);
  }
}

export async function handleRefresh(req, res) {
  try {
    const refreshToken = req.session.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Please sign in" });
    }

    console.log("refresh worked");

    const { id, email } = jwt.verify(refreshToken, REFRESH_SECRET);
    const accessToken = jwt.sign({ id, email }, ACCESS_SECRET, {
      expiresIn: "15m",
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Please sign in" });
  }
}
