






// import mongoose, { Schema, model, models } from "mongoose";

// const CropSchema = new Schema(
//   {
//     farmingType: {
//       type: String,
//       enum: ["organic", "regular", "natural", "hydroponic"],
//       index: true
//     },
//     seedType: {
//       type: String,
//       enum: ["hybrid", "naati", "heirloom", "gmo"],
//       index: true
//     },
//     acres: {
//       type: Number,
//       min: 0
//     },
//     sowingDate: {
//       type: Date
//     },
//     farmerId: {
//       type: Schema.Types.Mixed, // Change to Mixed to handle both string and ObjectId
//       index: true
//     },
//     trackingId: {
//       type: Schema.Types.ObjectId,
//       ref: "Tracking",
//       index: true
//     }
//   },
//   {
//     timestamps: true,
//     collection: "crops",
//   }
// );

// // Compound unique index
// CropSchema.index(
//   { farmerId: 1, seedType: 1, farmingType: 1 },
//   { 
//     unique: true,
//     name: 'unique_crop_per_farmer',
//     partialFilterExpression: {
//       seedType: { $exists: true },
//       farmingType: { $exists: true },
//       farmerId: { $exists: true }
//     }
//   }
// );

// // Other indexes
// CropSchema.index({ farmerId: 1, sowingDate: -1 });
// CropSchema.index({ seedType: 1, farmingType: 1 });
// CropSchema.index({ sowingDate: 1 });

// // Virtual for tracking data
// CropSchema.virtual('tracking', {
//   ref: 'Tracking',
//   localField: 'trackingId',
//   foreignField: '_id',
//   justOne: true
// });

// // Virtual for farmer data - FIXED VERSION
// CropSchema.virtual('farmer', {
//   ref: 'Farmer',
//   localField: 'farmerId',
//   foreignField: function() {
//     // Check if farmerId is an ObjectId
//     if (mongoose.Types.ObjectId.isValid(this.farmerId)) {
//       return '_id';
//     }
//     // Check common field names in Farmer collection
//     return 'farmerId'; // or 'id' depending on your Farmer schema
//   },
//   justOne: true
// });

// // Alternative: Use multiple potential fields
// CropSchema.virtual('farmerInfo', {
//   ref: 'Farmer',
//   localField: 'farmerId',
//   foreignField: function() {
//     // Try to match based on the farmerId type
//     if (mongoose.Types.ObjectId.isValid(this.farmerId)) {
//       return '_id';
//     } else if (this.farmerId && this.farmerId.startsWith('far-')) {
//       return 'farmerId';
//     } else if (this.farmerId && this.farmerId.startsWith('trd-')) {
//       return 'traderId';
//     }
//     // Default fallback
//     return 'farmerId';
//   },
//   justOne: true
// });

// // Ensure virtuals are included in JSON output
// CropSchema.set('toObject', { virtuals: true });
// CropSchema.set('toJSON', { virtuals: true });

// // Add a pre-find middleware to handle the virtual population automatically
// CropSchema.pre('find', function() {
//   this.populate('tracking farmerInfo');
// });

// CropSchema.pre('findOne', function() {
//   this.populate('tracking farmerInfo');
// });

// const Posting = models.Crop || model("Crop", CropSchema);

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