// import mongoose, { Schema, Document, Model } from 'mongoose';

// export interface IAdminSlider extends Document {
//   menuName: string;
//   menuIcon: string;
//   sliderImage: string;
//   status: 'active' | 'inactive';
//   createdAt: Date;
//   updatedAt: Date;
// }

// const AdminSliderSchema: Schema<IAdminSlider> = new Schema(
//   {
//     menuName: {
//       type: String,
//       required: [true, 'Menu name is required'],
//       trim: true,
//       maxlength: [100, 'Menu name cannot exceed 100 characters']
//     },
//     menuIcon: {
//       type: String,
//       required: [true, 'Menu icon is required']
//     },
//     sliderImage: {
//       type: String,
//       required: [true, 'Slider image is required']
//     },
//     status: {
//       type: String,
//       enum: ['active', 'inactive'],
//       default: 'active'
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// // Add indexes for better query performance
// AdminSliderSchema.index({ status: 1, createdAt: -1 });

// const AdminSlider: Model<IAdminSlider> = 
//   mongoose.models.AdminSlider || mongoose.model<IAdminSlider>('AdminSlider', AdminSliderSchema);

// export default AdminSlider;













import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminSlider extends Document {
  menuName: string;
  menuIcon: string;
  sliderImage: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

const AdminSliderSchema: Schema = new Schema({
  menuName: {
    type: String,
    required: [true, 'Menu name is required'],
    trim: true,
    maxlength: [100, 'Menu name cannot be more than 100 characters']
  },
  menuIcon: {
    type: String,
    required: [true, 'Menu icon is required']
  },
  sliderImage: {
    type: String,
    required: [true, 'Slider image is required']
  },
  role: {
    type: String,
    default: '',
    trim: true,
    maxlength: [50, 'Role cannot be more than 50 characters']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.models.AdminSlider || mongoose.model<IAdminSlider>('AdminSlider', AdminSliderSchema);