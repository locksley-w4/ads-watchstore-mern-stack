import session from "express-session";
import dotenv from "dotenv";
import connectMongoDB from "connect-mongodb-session";

dotenv.config();

const MongoDBStore = connectMongoDB(session);

const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) throw new Error("Session secret must be set in env vars.");

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "userSessions",
  expires: 1000 * 3600 * 24 * 7,
});

store.on("error", (err) => {
  console.error(err);
});

export const sessionConfig = session({
  secret: SESSION_SECRET,
  store,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 3600 * 24 * 7, // 7 days,
    secure: false,
  },
  resave: false,
  saveUninitialized: false,
});
