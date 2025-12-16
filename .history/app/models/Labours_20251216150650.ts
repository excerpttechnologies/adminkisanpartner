import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILabour extends Document {
  farmer: {
    name: string;
    mobile: string;
    address: string;
    state: string;
  };
  requiredDate: Date;
  male: number;
  female: number;
  crop: string;
  work: string;
  createdAt: Date;
  updatedAt: Date;
}

const LabourSchema: Schema<ILabour> = new Schema(
  {
    farmer: {
      name: { type: String},
      mobile: { type: String},
      address: { type: String},
      state: { type: String},
    },
    requiredDate: { type: Date},
    male: { type: Number, default: 0 },
    female: { type: Number, default: 0 },
    crop: { type: String},
    work: { type: String},
  },
  { timestamps: true }
);

const Labour: Model<ILabour> =
  mongoose.models.Labour || mongoose.model<ILabour>("Labour", LabourSchema);

export default Labour;
