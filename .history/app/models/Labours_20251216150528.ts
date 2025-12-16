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
    farmer: { name: 'jay', mobile: '2389474' },
    requiredDate: '2025-12-16',
    male: 22,
    female: 22,
    crop: 'sdddd',
    work: '1222',
    status: 'Pending',
    notes: 'djjjss'
  },
  { timestamps: true }
);

const Labour: Model<ILabour> =
  mongoose.models.Labour || mongoose.model<ILabour>("Labour", LabourSchema);

export default Labour;
