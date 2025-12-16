import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
  },
  {
    collection: "categories",
    timestamps: false,
  }
);

export default models.categories || model("subcategories", CategorySchema);
