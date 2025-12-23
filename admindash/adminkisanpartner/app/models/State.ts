import mongoose, { Schema, Document, Model } from "mongoose";

export interface IState extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const StateSchema: Schema<IState> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  { 
    timestamps: true }
);

const State: Model<IState> =
  mongoose.models.State || mongoose.model<IState>("State", StateSchema);

export default State;
