import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICrop extends Document {
  farmingType: "organic" | "natural" | "hydroponic" | "inorganic";
  seedType: "gmo" | "hybrid" | "heirloom" | "local";
  acres: number;
  sowingDate: Date;
  farmerId: string;
  trackingId: string;
  createdAt: Date;
  updatedAt: Date;
}

const CropSchema: Schema<ICrop> = new Schema(
  {
    farmingType: {
      type: String,
      enum: ["organic", "natural", "hydroponic", "inorganic"],
      required: true,
    },

    seedType: {
      type: String,
      enum: ["gmo", "hybrid", "heirloom", "local"],
      required: true,
    },

    acres: {
      type: Number,
      required: true,
    },

    sowingDate: {
      type: Date,
      required: true,
    },

    farmerId: {
      type: String,
      required: true,
      index: true,
    },

    trackingId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "crops", // ✅ USE EXISTING COLLECTION
  }
);

const Posting: Model<ICrop> =
  mongoose.models.Crop || mongoose.model<ICrop>("Crop", CropSchema);

export default Posting;
