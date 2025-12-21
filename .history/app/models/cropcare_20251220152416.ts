import mongoose, { Schema, Document } from 'mongoose';

// Remove any existing models to prevent conflicts
delete mongoose.connection.models['CropCareCategory'];
delete mongoose.connection.models['CropCareSubCategory'];
delete mongoose.connection.models['CropCareProduct'];

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

export interface IRecommendedSeed {
  name: string;
  image: string;
  price: number;
}

export interface ICropCareProduct extends Document {
  name: string;
  subCategoryId: mongoose.Types.ObjectId;
  targetPestsDiseases: ITargetPestDisease[];
  recommendedSeeds: IRecommendedSeed[];
  status: 'draft' | 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const CropCareProductSchema = new Schema<ICropCareProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
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
    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0
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

//Create and export models
export const CropCareCategory = mongoose.models.CropCareCategory || 
  mongoose.model<ICropCareCategory>('CropCareCategory', CropCareCategorySchema);

export const CropCareSubCategory = mongoose.models.CropCareSubCategory || 
  mongoose.model<ICropCareSubCategory>('CropCareSubCategory', CropCareSubCategorySchema);

export const CropCareProduct = mongoose.models.CropCareProduct || 
  mongoose.model<ICropCareProduct>('CropCareProduct', CropCareProductSchema);

export {
   Category: mongoose.models.CropCareCategory || mongoose.model<ICropCareCategory>('CropCareCategory', CropCareCategorySchema);
}