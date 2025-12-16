import mongoose, { Schema, models, model } from "mongoose";

const todoSchema = new Schema(
  {
    todo: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Todo = models.Todo || model("Todo", todoSchema);

export default Todo;
