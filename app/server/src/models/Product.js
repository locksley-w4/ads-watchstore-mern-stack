import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  nameFull: { type: String, required: true },
  nameShort: { type: String },
  brand: { type: String, index: true },
  price: { type: Number, required: true },
  quantity: { type: Number , index: true, default: 0},
  categories: { type: Array, index: true },
  description: { type: String, maxlength: 500 },
  caseInfo: { type: String, maxlength: 50 },
  waterResistanceInfo: { type: String, maxlength: 50 },
  strapColor: { type: String, maxlength: 50 },
  strapMaterial: { type: String, maxlength: 50 },
});

export default new mongoose.model("Product", productSchema);
