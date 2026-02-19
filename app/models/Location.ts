import mongoose, { Schema, Document } from "mongoose";

export interface ILocation extends Document {
  state: string;
  district: string;
  taluk: string;
}

const LocationSchema: Schema = new Schema(
  {
    state: { type: String, required: true },
    district: { type: String, required: true },
    taluk: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.Location ||
  mongoose.model<ILocation>("Location", LocationSchema);
