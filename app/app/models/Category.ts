import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  categoryId: string;
  categoryName: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    categoryId: {
      type: String,
      required: [true, "Category ID is required"],
      unique: true,
      trim: true
    },
    categoryName: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [50, "Category name cannot exceed 50 characters"]
    },
    image: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    collection:"categories"
  }
 
);

CategorySchema.index({ categoryName: "text" });


const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;