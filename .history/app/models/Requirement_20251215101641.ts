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

    
  },
  {
    collection: "requirements",
    timestamps: false,
  }
);

export default models.Requirement ||
  model("Requirement", RequirementSchema);
