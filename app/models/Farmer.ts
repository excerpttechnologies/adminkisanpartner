import mongoose, { Schema, Document } from "mongoose";



const FarmerSchema = new Schema(
  {
  
  },
  { timestamps: true,collection:"farmers",strict:false }
);

export default mongoose.models.Farmer ||
  mongoose.model("Farmer", FarmerSchema);
