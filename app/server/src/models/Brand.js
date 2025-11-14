import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  imageURL: { type: String, trim: true },
});

export default mongoose.model("Brands", brandSchema);
