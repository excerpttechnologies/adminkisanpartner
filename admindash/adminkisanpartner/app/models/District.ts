import mongoose, { Schema, Document } from "mongoose";

export interface IDistrict extends Document {
  name: string;
  stateId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DistrictSchema = new Schema<IDistrict>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    stateId: {
      type: Schema.Types.ObjectId,
      ref: "State",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.District ||
  mongoose.model<IDistrict>("District", DistrictSchema);
