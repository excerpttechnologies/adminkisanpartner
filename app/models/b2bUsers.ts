// models/b2bUser.model.js
import mongoose from 'mongoose';

// Security sub-schema
const SecuritySchema = new mongoose.Schema({
  password: {
    type: String,
    required: true
  },
  mpin: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    default: ''
  },
  otpExpiry: {
    type: Date,
    default: null
  }
});

// Main B2B User Schema
const b2bUserSchema = new mongoose.Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    businessName: {
      type: String,
      required: true,
      trim: true
    },
    businessType: {
      type: String,
      required: true,
      enum: ['restaurant', 'cafe', 'hotel', 'other'],
      default: 'restaurant'
    },
    gstNumber: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      default: '',
      lowercase: true,
      trim: true
    },
    address: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    district: {
      type: String,
      default: ''
    },
    taluk: {
      type: String,
      default: ''
    },
    village: {
      type: String,
      default: ''
    },
    security: {
      type: SecuritySchema,
      required: true
    },
    role: {
      type: String,
      enum: ['b2b_buyer', 'b2b_seller', 'admin'],
      default: 'b2b_buyer'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    verifiedBy: {
      type: String,
      default: ''
    },
    verifiedDate: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Create indexes for better query performance
b2bUserSchema.index({ mobileNumber: 1 });
b2bUserSchema.index({ email: 1 });
b2bUserSchema.index({ verificationStatus: 1 });
b2bUserSchema.index({ businessType: 1 });

// Create or retrieve the model
const B2BUser = mongoose.models.b2busers || mongoose.model('b2busers', b2bUserSchema);

export default B2BUser;