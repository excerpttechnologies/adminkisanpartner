// // import mongoose, { Schema, models, model } from "mongoose";

// // const SliderSchema = new Schema(
// //   {
// //     name: { type: String, required: true },
// //     image: { type: String, required: true },
// //     imagePublicId: { type: String },
// //   },
// //   { timestamps: true }
// // );

// // const Slider = models.Slider || model("Slider", SliderSchema);
// // export default Slider;






// import mongoose, { Schema, models, model } from "mongoose";

// const SliderSchema = new Schema(
//   {
//     name: { type: String, required: true },
//     image: { type: String, required: true },
//     role: { type: String, required: true, default: "General" }, // Add this line with default value
//     imagePublicId: { type: String },
//   },
//   { timestamps: true }
// );

// const Slider = models.Slider || model("Slider", SliderSchema);
// export default Slider;


///////////////cloudinary//////////////////////

import mongoose, { Schema, models, model } from "mongoose";

const SliderSchema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, "Slider name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"]
    },
    image: { 
      type: String, 
      required: [true, "Image URL is required"] 
    },
    role: { 
      type: String, 
      required: [true, "Role is required"],
      default: "General",
      trim: true,
      enum: {
        values: ["General", "Farmer", "Trader", "Employee", "Partner", "Transport", "Other's"],
        message: '{VALUE} is not a valid role'
      }
    },
    cloudinaryId: { 
      type: String,
      required: false
    },
    imagePublicId: { 
      type: String,
      required: false
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create indexes for better performance
SliderSchema.index({ name: 1 });
SliderSchema.index({ role: 1 });
SliderSchema.index({ createdAt: -1 });

// Virtual for formatted date
SliderSchema.virtual('formattedDate').get(function() {
  return new Date(this.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

// Virtual for time ago
SliderSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
});

const Slider = models.Slider || model("Slider", SliderSchema);
export default Slider;