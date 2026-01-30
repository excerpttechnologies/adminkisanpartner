import mongoose, { Schema, Document } from 'mongoose';

export interface ISeed extends Document {
  name: string;
  description?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SeedSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Seed name is required'],
      trim: true,
      unique: true,
      maxlength: [100, 'Seed name cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    category: {
      type: String,
      enum: ['vegetable', 'fruit', 'grain', 'herb', 'flower', 'other'],
      default: 'other'
    }
  },
  {
    timestamps: true
  }
);

// Create text index for search
SeedSchema.index({ name: 'text', description: 'text' });

export default mongoose.models.Seed || mongoose.model<ISeed>('Seed', SeedSchema);