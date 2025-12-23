import mongoose, { Schema, Document } from "mongoose";

export interface ITaluka extends Document {
  name: string;
  districtId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TalukaSchema = new Schema<ITaluka>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ Reference to District (NOT State)
    districtId: {
      type: Schema.Types.ObjectId,
      ref: "District",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// ✅ Prevent duplicate taluka under same district
TalukaSchema.index(
  { name: 1, districtId: 1 },
  { unique: true }
);

export default mongoose.models.Taluka ||
  mongoose.model<ITaluka>("Taluka", TalukaSchema);
