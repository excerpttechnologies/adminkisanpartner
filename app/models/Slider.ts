import mongoose, { Schema, models, model } from "mongoose";

const SliderSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String },
  },
  { timestamps: true }
);

const Slider = models.Slider || model("Slider", SliderSchema);
export default Slider;