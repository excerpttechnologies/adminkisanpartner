import mongoose, { Schema, Document } from "mongoose";



const FarmerSchema = new Schema(
  {
  
  },
  { timestamps: true,collection:"farmers" }
);

export default mongoose.models.Farmer ||
  mongoose.model("Farmer", FarmerSchema);
