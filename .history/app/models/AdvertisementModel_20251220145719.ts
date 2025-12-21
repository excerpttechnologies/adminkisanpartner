import mongoose, { Schema, Document } from 'mongoose';

// Product Subdocument Schema
interface IProduct {
  images: string[]; // URLs or file paths
  productName: string;
  description: string;
  mrpPrice: number;
  salesPrice: number;
}

// Call to Action Subdocument Schema
interface ICallToAction {
  buyNowLink: string;
  visitWebsiteLink: string;
  callNowNumber: string;
  whatsappNowNumber: string;
  price: number;
  selectedAction: 'buyNow' | 'visitWebsite' | 'callNow' | 'whatsappNow';
}

// Main Advertisement Interface
export interface IAdvertisement extends Document {
  stage: string;
  tab: string;
  heading: string;
  guide: string;
  companyLogo: string;
  companyName: string;
  description: string;
  advice: string;
  banner: string;
  callToAction: ICallToAction;
  products: IProduct[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  images: [{ type: String, required: true }],
  productName: { type: String, required: true },
  description: { type: String, required: true },
  mrpPrice: { type: Number, required: true, default: 0 },
  salesPrice: { type: Number, required: true, default: 0 },
});

const CallToActionSchema = new Schema<ICallToAction>({
  buyNowLink: { type: String, default: '' },
  visitWebsiteLink: { type: String, default: '' },
  callNowNumber: { type: String, default: '' },
  whatsappNowNumber: { type: String, default: '' },
  price: { type: Number, default: 0 },
  selectedAction: { 
    type: String, 
    enum: ['buyNow', 'visitWebsite', 'callNow', 'whatsappNow'],
    default: 'buyNow' 
  },
});

const AdvertisementSchema = new Schema<IAdvertisement>({
  stage: { 
    type: String, 
    required: true,
    enum: ['stage01', 'stage02', 'stage03', 'stage04', 'stage05', 'stage06', 'stage07', 'sale', 'crops_care', 'general']
  },
  tab: {
    type: String,
    required: true,
    enum: ['tab01', 'tab02', 'tab03']
  },
  heading: { type: String, required: true },
  guide: { type: String, default: '' },
  companyLogo: { type: String, default: '' },
  companyName: { type: String, default: '' },
  description: { type: String, default: '' },
  advice: { type: String, default: '' },
  banner: { type: String, default: '' },
  callToAction: { type: CallToActionSchema, default: () => ({}) },
  products: { type: [ProductSchema], default: [] },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

// Create indexes for better performance
AdvertisementSchema.index({ stage: 1, isActive: 1 });
AdvertisementSchema.index({ tab: 1, isActive: 1 });
AdvertisementSchema.index({ createdAt: -1 });

// Prevent model recompilation in development
const AdvertisementModel = mongoose.models.Advertisement || mongoose.model<IAdvertisement>('Advertisement', AdvertisementSchema);

export default AdvertisementModel;