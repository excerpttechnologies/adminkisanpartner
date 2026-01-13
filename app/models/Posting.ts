// import mongoose, { Schema, Document, Model } from "mongoose";

// export interface ICrop extends Document {
//   farmingType: "organic" | "natural" | "hydroponic" | "inorganic";
//   seedType: "gmo" | "hybrid" | "heirloom" | "local";
//   acres: number;
//   sowingDate: Date;
//   farmerId: string;
//   trackingId: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const CropSchema: Schema<ICrop> = new Schema(
//   {
//     farmingType: {
//       type: String,
//       enum: ["organic", "natural", "hydroponic", "inorganic"],
//       required: true,
//     },

//     seedType: {
//       type: String,
//       enum: ["gmo", "hybrid", "heirloom", "local"],
//       required: true,
//     },

//     acres: {
//       type: Number,
//       required: true,
//     },

//     sowingDate: {
//       type: Date,
//       required: true,
//     },

//     farmerId: {
//       type: String,
//       required: true,
//       index: true,
//     },

//     trackingId: {
//       type: String,
//       required: true,
//       index: true,
//     },
//   },
//   {
//     timestamps: true,
//     collection: "crops", // ✅ USE EXISTING COLLECTION
//   }
// );

// const Posting: Model<ICrop> =
//   mongoose.models.Crop || mongoose.model<ICrop>("Crop", CropSchema);

// export default Posting;










// models/Crop.js
import mongoose, { Schema, model, models } from "mongoose";

const CropSchema = new Schema(
  {
    farmingType: {
      type: String,
      enum: ["organic", "regular", "natural", "hydroponic"],
      index: true
    },
    seedType: {
      type: String,
      enum: ["hybrid", "naati", "heirloom", "gmo"],
      index: true
    },
    acres: {
      type: Number,
      min: 0
    },
    sowingDate: {
      type: Date
    },
    farmerId: {
      type: String,
      index: true
    },
    trackingId: {
      type: String,
      index: true
    }
  },
  {
    timestamps: true,
    collection: "crops",
  }
);

// Add compound indexes for better query performance
// CropSchema.index({ farmerId: 1, sowingDate: -1 });
// CropSchema.index({ seedType: 1, farmingType: 1 });
// CropSchema.index({ sowingDate: 1 });
// CropSchema.index({ trackingId: 1 }, { sparse: true });

// // Virtual for tracking data
// CropSchema.virtual('tracking', {
//   ref: 'Tracking',
//   localField: 'trackingId',
//   foreignField: '_id',
//   justOne: true
// });

// // Ensure virtuals are included in JSON output
// CropSchema.set('toObject', { virtuals: true });
// CropSchema.set('toJSON', { virtuals: true });

// const Posting = models.Crop || model("Crop", CropSchema);

// export default Posting;

CropSchema.index(
  { farmerId: 1, seedType: 1, farmingType: 1 },
  { 
    unique: true,
    name: 'unique_crop_per_farmer',
    partialFilterExpression: {
      seedType: { $exists: true },
      farmingType: { $exists: true },
      farmerId: { $exists: true }
    }
  }
);

// Other indexes for better query performance
CropSchema.index({ farmerId: 1, sowingDate: -1 });
CropSchema.index({ seedType: 1, farmingType: 1 });
CropSchema.index({ sowingDate: 1 });
CropSchema.index({ trackingId: 1 }, { sparse: true });

// Virtual for tracking data
CropSchema.virtual('tracking', {
  ref: 'Tracking',
  localField: 'trackingId',
  foreignField: '_id',
  justOne: true
});

// Ensure virtuals are included in JSON output
CropSchema.set('toObject', { virtuals: true });
CropSchema.set('toJSON', { virtuals: true });

const Posting = models.Crop || model("Crop", CropSchema);

export default Posting;