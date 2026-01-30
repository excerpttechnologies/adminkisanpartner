import mongoose, { Schema, Document } from "mongoose";



const ProductSchema = new Schema(
  {
  
  },
  { timestamps: true,collection:"products",strict:false }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
