import mongoose, { Schema, model, models } from "mongoose";

// const QualitySchema = new Schema(
//   {
//     grade: { type: String, required: true },
//     pricePerPack: { type: Number, required: true },
//     quantity: { type: Number, required: true },
//   },
//   { _id: true }
// );

const RequirementSchema = new Schema(
  {
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // userType: {
    //   type: String,
    //   enum: ["Farmer", "Agent", "Trader"],
    //   required: true,
    // },

    // category: { type: String, required: true },
    // subCategory: { type: String, required: true },

    // farmingType: { type: String },
    // variety: { type: String },

    // packType: { type: String },
    // weightPerPack: { type: Number },

    // qualities: {
    //   type: [QualitySchema],
    //   required: true,
    // },

    // requirementDate: {
    //   type: Date,
    //   required: true,
    // },

    // location: {
    //   type: String,
    // },

    // status: {
    //   type: String,
    //   enum: ["Active", "Inactive", "Closed"],
    //   default: "Active",
    // },

    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    collection: "requirements",
    timestamps: false,
  }
);

export default models.Requirement ||
  model("Requirement", RequirementSchema);
