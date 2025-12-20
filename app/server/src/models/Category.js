import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  // children_catalogs: {
  //   type: Array,
  // },
  // parent_catalogs: {
  //   type: Array,
  // },
});

export default mongoose.model("Category", categorySchema);
