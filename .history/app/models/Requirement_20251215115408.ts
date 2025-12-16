import mongoose, { Schema, model, models } from "mongoose";


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
    strict
  }
);

export default models.Requirement ||
  model("Requirement", RequirementSchema);
