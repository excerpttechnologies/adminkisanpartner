import mongoose, { Schema, Document } from 'mongoose';

export interface IPackaging extends Document {
  packageType: string;
  measurements: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PackagingSchema = new Schema({
  packageType: {
    type: String,
    required: true,
    trim: true,
  },
  measurements: {
    type: [String],
    required: true,
    default: []
  }
}, {
  timestamps: true
});

// Check if model exists
export default mongoose.models.Packaging || mongoose.model<IPackaging>('Packaging', PackagingSchema);