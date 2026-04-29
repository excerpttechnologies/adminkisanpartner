// models/B2BProduct.model.ts
import mongoose, { Schema } from "mongoose";

export interface IB2BProduct {
  _id: string;
  productName: string;
  description: string;
  categoryId: string;
  categoryName: string;
  subCategoryId: string;
  subCategoryName: string;
  images: string[];
  price: number;
  quantity: number;
  unit: string;
  taluk: string;
  postedBy: string;
  postedByName: string;
  status: 'active' | 'inactive' | 'sold';
  viewCount: number;
  isActive: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const B2BProductSchema = new Schema<IB2BProduct>(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    categoryId: {
      type: String,
      required: [true, "Category ID is required"],
    },
    categoryName: {
      type: String,
      required: [true, "Category name is required"],
    },
    subCategoryId: {
      type: String,
      required: [true, "SubCategory ID is required"],
    },
    subCategoryName: {
      type: String,
      required: [true, "SubCategory name is required"],
    },
    images: [{
      type: String,
      required: true,
    }],
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: 0,
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      enum: ['kg', 'g', 'ton', 'piece', 'dozen', 'bunch', 'packet', 'quintal'],
      default: 'kg',
    },
    taluk: {
      type: String,
      required: [true, "Taluk is required"],
    },
    postedBy: {
      type: String,
      required: [true, "Posted by user ID is required"],
      ref: 'B2BUser',
    },
    postedByName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'sold'],
      default: 'active',
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    collection: "b2bproducts",
  }
);

// Create indexes
B2BProductSchema.index({ productName: "text", description: "text" });
B2BProductSchema.index({ categoryId: 1 });
B2BProductSchema.index({ subCategoryId: 1 });
B2BProductSchema.index({ taluk: 1 });
B2BProductSchema.index({ postedBy: 1 });
B2BProductSchema.index({ verificationStatus: 1 });

// Drop the old model if it exists to force schema update
if (mongoose.models.B2BProduct) {
  delete mongoose.models.B2BProduct;
}

const B2BProduct = mongoose.models.B2BProduct || mongoose.model<IB2BProduct>("B2BProduct", B2BProductSchema);

export default B2BProduct;