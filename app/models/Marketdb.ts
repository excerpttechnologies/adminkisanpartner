


// app/models/Market.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMarket extends Document {
  marketId: string;
  marketName: string;
  pincode: string;
  postOffice: string;
  district: string;
  state: string;
  exactAddress: string;
  landmark: string;
  createdAt: Date;
  updatedAt: Date;
}

const MarketSchema: Schema = new Schema(
  {
    marketId: {
      type: String,
      required: true,
      unique: true,
    },
    marketName: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    postOffice: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    exactAddress: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
    },
  },
  { timestamps: true }
);

// Check if model already exists, if not create it
const Market = mongoose.models.Market || mongoose.model<IMarket>('Market', MarketSchema);

export default Market;