import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IProfile extends Document {
  fullName: string;
  email: string;
  password: string;
  updatedAt: Date;
}

const ProfileSchema: Schema = new Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// // Update the updatedAt timestamp before saving
// ProfileSchema.pre('save', function(next) {
//   this.updatedAt = new Date();
//   next();
// });

// Fixed export - prevents model recompilation on hot reload
export default models.Profile || model<IProfile>('Profile', ProfileSchema);