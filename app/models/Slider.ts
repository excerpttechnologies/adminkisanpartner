// import mongoose, { Schema, models, model } from "mongoose";

// const SliderSchema = new Schema(
//   {
//     name: { type: String, required: true },
//     image: { type: String, required: true },
//     imagePublicId: { type: String },
//   },
//   { timestamps: true }
// );

// const Slider = models.Slider || model("Slider", SliderSchema);
// export default Slider;






import mongoose, { Schema, models, model } from "mongoose";

const SliderSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    role: { type: String, required: true, default: "General" }, // Add this line with default value
    imagePublicId: { type: String },
  },
  { timestamps: true }
);

const Slider = models.Slider || model("Slider", SliderSchema);
export default Slider;