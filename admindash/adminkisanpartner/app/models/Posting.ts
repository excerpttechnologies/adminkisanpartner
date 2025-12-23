import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPosting extends Document {
  date: Date;
  title: string;
  category: string;
  item: string;
  seedType: "Seed" | "undefined";
  acres: string;
  postedBy: {
    name: string;
    mobile: string;
  };
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

const PostingSchema: Schema<IPosting> = new Schema(
  {
    date: { type: Date, required: true },

    title: { type: String, required: true },

    category: { type: String, required: true },

    item: { type: String, required: true },

    seedType: {
      type: String,
      enum: ["Seed", "undefined"],
      default: "undefined",
    },

    acres: { type: String, required: true },

    postedBy: {
      name: { type: String, required: true },
      mobile: { type: String, required: true },
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Posting: Model<IPosting> =
  mongoose.models.Posting ||
  mongoose.model<IPosting>("Posting", PostingSchema);

export default Posting;
