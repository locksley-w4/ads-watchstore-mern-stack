import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    index: true,
    required: true,
    maxLength: 70,
  },
  fullName: {
    type: String,
    //   required: true,
    maxLength: 40,
  },
  cart: {
    type: Object,
    default: {},
  },
  role: {
    type: String,
    default: "user",
  },
  orders: {
    type: Array,
    default: [],
  },
  cards: {
    type: Array,
    default: [],
  },
  password: {
    type: String,
    required: true,
    maxLength: 200,
  },
  phoneNumber: {
    type: String,
    required: true,
    maxLength: 30,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(this.password, salt);
    this.password = hashedPwd;
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.toJSON = function () {
  const data = this.toObject();
  delete data.password;
  return data;
};

userSchema.methods.comparePasswords = async function (providedPassword) {
  const success = await bcrypt.compare(providedPassword, this.password);
  return success;
};

export default mongoose.model("Users", userSchema);
