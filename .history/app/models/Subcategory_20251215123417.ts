import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
  },
  {
    collection: "subcategories",
    timestamps: false,
    stric:false
  }
);

export default models.subcategories || model("subcategories", CategorySchema);
