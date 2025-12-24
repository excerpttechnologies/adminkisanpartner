import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminMenuIcon extends Document {
  menuName: string;
  menuIcon: string; // Base64 encoded image
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdminMenuIconSchema: Schema<IAdminMenuIcon> = new Schema(
  {
    menuName: {
      type: String,
      required: [true, 'Menu name is required'],
      trim: true,
      maxlength: [100, 'Menu name cannot exceed 100 characters']
    },
    menuIcon: {
      type: String,
      required: [true, 'Menu icon is required'],
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
AdminMenuIconSchema.index({ menuName: 1 });
AdminMenuIconSchema.index({ isActive: 1 });
AdminMenuIconSchema.index({ createdAt: -1 });

// Check if model already exists
const AdminMenuIcon: Model<IAdminMenuIcon> = 
  mongoose.models.AdminMenuIcon || mongoose.model<IAdminMenuIcon>('AdminMenuIcon', AdminMenuIconSchema);

export default AdminMenuIcon;