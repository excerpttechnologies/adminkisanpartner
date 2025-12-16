import mongoose, { Schema, model, models } from "mongoose";


const CategorySchema = new Schema(
  {
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    
  },
  {
    collection: "categories",
    timestamps: false,
    strict:false
  }
);

export default models.Requirement ||
  model("Categorie", CategorySchema);
