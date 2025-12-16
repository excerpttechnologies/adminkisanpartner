import mongoose from "mongoose";

let isConnected = false;

const connectDb = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect("mongodb+srv://root:1234@cluster0.ofeco44.mongodb.net/JobPortal_saas/todo");
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDb;
