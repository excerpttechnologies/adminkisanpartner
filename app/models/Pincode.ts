import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPincode extends Document {
  officename: string;
  pincode: number;
  officeType: string;
  Deliverystatus: string;
  divisionname: string;
  regionname: string;
  circlename: string;
  Taluk: string;
  Districtname: string;
  statename: string;
  Telephone: string;
  relatedSuboffice: string;
  relatedHeadoffice: string;
  createdAt: Date;
  updatedAt: Date;
}

const PincodeSchema: Schema<IPincode> = new Schema(
  {
    officename: { type: String,},
    pincode: { type: Number,  index: true },
    officeType: { type: String },
    Deliverystatus: { type: String },
    divisionname: { type: String },
    regionname: { type: String },
    circlename: { type: String },
    Taluk: { type: String, index: true },
    Districtname: { type: String, index: true },
    statename: { type: String, index: true },
    Telephone: { type: String },
    relatedSuboffice: { type: String },
    relatedHeadoffice: { type: String },
  },
  { timestamps: true }
);

const Pincode: Model<IPincode> =
  mongoose.models.Pincode ||
  mongoose.model<IPincode>("Pincode", PincodeSchema);

export default Pincode;
