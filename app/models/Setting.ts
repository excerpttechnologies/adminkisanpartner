import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  // General Settings
  logo: { type: String },
  favicon: { type: String },
  paymentQrCode: { type: String },
  termsAudio: { type: String },
  
  // SEO Settings
  seoTitle: { type: String },
  seoDescription: { type: String },
  seoKeywords: { type: String },
  
  // Social Media
  facebook: { type: String },
  twitter: { type: String },
  youtube: { type: String },
  linkedin: { type: String },
  instagram: { type: String },
  
  // Contact Info
  footerDescription: { type: String },
  address: { type: String },
  contactPhone: { type: String },
  contactEmail: { type: String },
  copyrightText: { type: String },
  
  // Email Settings
  labourEmail: { type: String },
  adminPaymentEmail: { type: String },
  adminOrderEmail: { type: String },
  adminSalesEmail: { type: String },
  adminPostingEmail: { type: String },
  
  // Bank Details
  bankName: { type: String },
  bankAccountNumber: { type: String },
  bankIfsc: { type: String }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);