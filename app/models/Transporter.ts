import mongoose, { Schema, Document } from "mongoose";



const TransporterSchema = new Schema(
  {
  
  },
  { timestamps: true,collection:"transporters",strict:false }
);

export default mongoose.models.Transporters ||
  mongoose.model("Transporters", TransporterSchema);
