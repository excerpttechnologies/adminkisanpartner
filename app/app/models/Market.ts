import mongoose, { Schema } from "mongoose";

const MarketSchema = new Schema(
  {},
  { timestamps: true, collection: "markets", strict: false }
);

// Use the same model name that you're importing in your API
export default mongoose.models.Market || mongoose.model("Market", MarketSchema);