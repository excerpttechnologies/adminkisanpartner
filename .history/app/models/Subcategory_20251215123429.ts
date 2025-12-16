import { Schema, model, models } from "mongoose";

const SCategorySchema = new Schema(
  {
  },
  {
    collection: "subcategories",
    timestamps: false,
    strict:false
  }
);

export default models.subcategories || model("subcategories", CategorySchema);
