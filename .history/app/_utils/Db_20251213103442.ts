import mongoose from "mongoose";

let isConnected = false;

const connectDb = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/todo");
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDb;
