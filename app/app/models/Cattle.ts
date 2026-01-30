import mongoose, { Schema, Document } from 'mongoose';

export interface ICattle extends Document {
  name: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CattleSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Cattle name is required'],
      trim: true,
      unique: true,
      maxlength: [100, 'Cattle name cannot exceed 100 characters']
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: [0, 'Sort order must be at least 0']
    }
  },
  {
    timestamps: true
  }
);

// Create index for search
CattleSchema.index({ name: 'text' });

export default mongoose.models.Cattle || mongoose.model<ICattle>('Cattle', CattleSchema);