// import mongoose, { Schema, models, model } from 'mongoose';

// export interface IProductItem {
//   _id?: string;
//   name: string;
//   price: number;
//   category: string;
//   stock: number;
//   description: string;
//   imageUrl: string;
//   minOrderQty: number;
//   unit: string;
//   status: 'active' | 'inactive';
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// const ProductItemSchema = new Schema<IProductItem>(
//   {
//     name: {
//       type: String,
//       required: [true, 'Product name is required'],
//       trim: true,
//     },
//     price: {
//       type: Number,
//       required: [true, 'Price is required'],
//       min: 0,
//     },
//     category: {
//       type: String,
//       required: [true, 'Category is required'],
//       enum: ['Seeds', 'Fertilizers', 'Tools', 'Chemicals', 'Irrigation', 'Other'],
//     },
//     stock: {
//       type: Number,
//       required: [true, 'Stock is required'],
//       min: 0,
//       default: 0,
//     },
//     description: {
//       type: String,
//       required: [true, 'Description is required'],
//     },
//     imageUrl: {
//       type: String,
//       required: [true, 'Image URL is required'],
//     },
//     minOrderQty: {
//       type: Number,
//       default: 1,
//       min: 1,
//     },
//     unit: {
//       type: String,
//       enum: ['kg', 'bag', 'piece', 'set', 'liter', 'bottle'],
//       default: 'kg',
//     },
//     status: {
//       type: String,
//       enum: ['active', 'inactive'],
//       default: 'active',
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default models.ProductItem || model<IProductItem>('ProductItem', ProductItemSchema);









// import mongoose, { Schema, models, model } from 'mongoose';

// export interface IProductItem {
//   _id?: string;
//   name: string;
//   price: number;
//   category: string;
//   stock: number;
//   description: string;
//   images: string[];
//   minOrderQty: number;
//   unit: string;
//   status: 'active' | 'inactive';
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// const ProductItemSchema = new Schema<IProductItem>(
//   {
//     name: {
//       type: String,
//       required: [true, 'Product name is required'],
//       trim: true,
//     },
//     price: {
//       type: Number,
//       required: [true, 'Price is required'],
//       min: 0,
//     },
//     category: {
//       type: String,
//       required: [true, 'Category is required'],
//       enum: ['Seeds', 'Fertilizers', 'Tools', 'Chemicals', 'Irrigation', 'Other'],
//     },
//     stock: {
//       type: Number,
//       required: [true, 'Stock is required'],
//       min: 0,
//       default: 0,
//     },
//     description: {
//       type: String,
//       required: [true, 'Description is required'],
//     },
//     images: {
//       type: [String],
//       required: [true, 'At least one image is required'],
//       validate: {
//         validator: (arr: string[]) => arr.length >= 1 && arr.length <= 3,
//         message: 'You must provide 1 to 3 images',
//       },
//     },
//     minOrderQty: {
//       type: Number,
//       default: 1,
//       min: 1,
//     },
//     unit: {
//       type: String,
//       enum: ['kg', 'bag', 'piece', 'set', 'liter', 'bottle'],
//       default: 'kg',
//     },
//     status: {
//       type: String,
//       enum: ['active', 'inactive'],
//       default: 'active',
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default models.ProductItem || model<IProductItem>('ProductItem', ProductItemSchema);















import mongoose, { Schema, Document } from 'mongoose';

export interface IProductItem extends Document {
  name: string;
  price: number;
  category: string;
  subCategory: string;
  stock: number;
  description: string;
  images: string[];
  minOrderQty: number;
  unit: string;
  status: 'active' | 'inactive';
}

const ProductItemSchema = new Schema<IProductItem>(
  {
    name:        { type: String, required: true, trim: true },
    price:       { type: Number, required: true, min: 0 },
    category:    { type: String, required: true, trim: true },
    subCategory: { type: String, default: '', trim: true },
    stock:       { type: Number, default: 0, min: 0 },
    description: { type: String, required: true, trim: true },
    images:      { type: [String], required: true },
    minOrderQty: { type: Number, default: 1, min: 1 },
    unit:        { type: String, default: 'kg' },
    status:      { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.models.ProductItem ||
  mongoose.model<IProductItem>('ProductItem', ProductItemSchema);