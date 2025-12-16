import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILabour extends Document {
  farmer: {
    name: string;
    mobile: string;
    address: string;
    state: string;
  };
  requiredDate: Date;
  maleRequired: number;
  femaleRequired: number;
  crop: string;
  work: string;
  createdAt: Date;
  updatedAt: Date;
}

const LabourSchema: Schema<ILabour> = new Schema(
  {
    farmer: {
      name: { type: String, },
      mobile: { type: String, required: true },
      address: { type: String, required: true },
      state: { type: String, required: true },
    },
    requiredDate: { type: Date, required: true },
    maleRequired: { type: Number, default: 0 },
    femaleRequired: { type: Number, default: 0 },
    crop: { type: String, required: true },
    work: { type: String, required: true },
  },
  { timestamps: true }
);

const Labour: Model<ILabour> =
  mongoose.models.Labour || mongoose.model<ILabour>("Labour", LabourSchema);

export default Labour;
