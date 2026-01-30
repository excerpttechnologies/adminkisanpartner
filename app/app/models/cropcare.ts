

import mongoose, { Schema, Document } from 'mongoose';

// ============ CropCareCategory Schema ============
export interface ICropCareCategory extends Document {
  name: string;
  image: string;
  status: 'draft' | 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const CropCareCategorySchema = new Schema<ICropCareCategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// ============ CropCareSubCategory Schema ============
export interface ICropCareSubCategory extends Document {
  name: string;
  image: string;
  categoryId: mongoose.Types.ObjectId;
  status: 'draft' | 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const CropCareSubCategorySchema = new Schema<ICropCareSubCategory>({
  name: {
    type: String,
    required: [true, 'SubCategory name is required'],
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CropCareCategory',
    required: [true, 'Category ID is required'],
    index: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// ============ CropCareProduct Schema ============
export interface ITargetPestDisease {
  name: string;
  image: string;
}

// UPDATED: RecommendedSeed interface with new fields
export interface IRecommendedSeed {
  name: string;
  image: string;
  stock: number;
  unit: string;
  customUnit?: string;
  weight: number;
  weightUnit: string;
  listPrice: number;
  discount: number;
  profit: number;
  tax: number;
  customTax?: number;
  finalPrice: number;
}

export interface ICropCareProduct extends Document {
  name: string;
  description?: string;
   video?: string;
  subCategoryId: mongoose.Types.ObjectId;
  targetPestsDiseases: ITargetPestDisease[];
  recommendedSeeds: IRecommendedSeed[];
  status: 'draft' | 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// UPDATED: CropCareProductSchema with new fields
const CropCareProductSchema = new Schema<ICropCareProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
   video: {
    type: String,
    default: ''
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CropCareSubCategory',
    required: [true, 'SubCategory ID is required'],
    index: true
  },
  targetPestsDiseases: [{
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ''
    }
  }],
  recommendedSeeds: [{
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ''
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    unit: {
      type: String,
      default: 'kg'
    },
    customUnit: {
      type: String,
      default: ''
    },
    weight: {
      type: Number,
      default: 0,
      min: 0
    },
    weightUnit: {
      type: String,
      default: 'kg'
    },
    listPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    profit: {
      type: Number,
      default: 0,
      min: 0
    },
    tax: {
      type: Number,
      default: 18
    },
    customTax: {
      type: Number,
      default: 0
    },
    finalPrice: {
      type: Number,
      default: 0
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

export const Category =
  mongoose.models.CropCareCategory ||
  mongoose.model<ICropCareCategory>(
    "CropCareCategory",
    CropCareCategorySchema
  );

export const SubCategory =
  mongoose.models.CropCareSubCategory ||
  mongoose.model<ICropCareSubCategory>(
    "CropCareSubCategory",
    CropCareSubCategorySchema
  );

export const Product =
  mongoose.models.CropCareProduct ||
  mongoose.model<ICropCareProduct>(
    "CropCareProduct",
    CropCareProductSchema
  );