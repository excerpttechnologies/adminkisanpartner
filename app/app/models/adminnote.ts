import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminNote extends Document {
  name: string;
  file?: string;
  status: 'active' | 'draft' | 'inactive';
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminNoteSchema: Schema<IAdminNote> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Note name is required'],
      trim: true,
      maxlength: [200, 'Note name cannot exceed 200 characters']
    },
    file: {
      type: String,
      default: null,
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'inactive'],
      default: 'draft'
    },
    content: {
      type: String,
      default: '',
      maxlength: [50000, 'Content cannot exceed 50000 characters']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for search optimization
AdminNoteSchema.index({ name: 'text', content: 'text' });
AdminNoteSchema.index({ status: 1 });
AdminNoteSchema.index({ createdAt: -1 });

// Check if model already exists to prevent recompilation errors
const AdminNote: Model<IAdminNote> = 
  mongoose.models.AdminNote || mongoose.model<IAdminNote>('AdminNote', AdminNoteSchema);

export default AdminNote;