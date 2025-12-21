import mongoose, { Schema, Document } from "mongoose";

export interface IAgent extends Document {
  name: string;
  mobile: string;
  email?: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const AgentSchema = new Schema<IAgent>(
  {
    name: { type: String, required: true, trim: true },

    mobile: { type: String, required: true },

    email: { type: String, lowercase: true },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Agent ||
  mongoose.model<IAgent>("Agent", AgentSchema);
