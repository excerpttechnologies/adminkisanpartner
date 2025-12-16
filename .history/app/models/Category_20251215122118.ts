import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
      index: true, // 🔍 search fast
    },

    categoryId: {
      type: String,
      required: true,
      unique: true, // CAT001, CAT002
      index: true,
    }
  },
  {
    collection: "categories",
    timestamps: false,
  }
);

export default models.categories || model("categories", CategorySchema);
