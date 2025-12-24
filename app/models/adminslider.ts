import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminSlider extends Document {
  menuName: string;
  menuIcon: string;
  sliderImage: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const AdminSliderSchema: Schema<IAdminSlider> = new Schema(
  {
    menuName: {
      type: String,
      required: [true, 'Menu name is required'],
      trim: true,
      maxlength: [100, 'Menu name cannot exceed 100 characters']
    },
    menuIcon: {
      type: String,
      required: [true, 'Menu icon is required']
    },
    sliderImage: {
      type: String,
      required: [true, 'Slider image is required']
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for better query performance
AdminSliderSchema.index({ status: 1, createdAt: -1 });

const AdminSlider: Model<IAdminSlider> = 
  mongoose.models.AdminSlider || mongoose.model<IAdminSlider>('AdminSlider', AdminSliderSchema);

export default AdminSlider;