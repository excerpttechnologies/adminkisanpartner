import mongoose, { Schema, Document } from "mongoose";



const CropcareOrderSchema = new Schema(
  {
  
  },
  { timestamps: true,collection:"cropcareorders",strict:false }
);

export default mongoose.models.Cropcareorders ||
  mongoose.model("Cropcareorders", CropcareOrderSchema);