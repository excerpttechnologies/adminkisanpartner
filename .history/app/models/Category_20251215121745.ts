import mongoose, { Schema, model, models } from "mongoose";


const CategorySchema = new Schema(
  {
  },
  {
    collection: "categories",
    timestamps: false,
    strict:false
  }
);

export default models.Categorie ||
  model("categories", CategorySchema);
