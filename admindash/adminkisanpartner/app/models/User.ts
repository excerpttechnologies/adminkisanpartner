import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {

  },
  {
    collection: "users", 
    timestamps: false,
  }
);

export default models.User || model("User", UserSchema);
