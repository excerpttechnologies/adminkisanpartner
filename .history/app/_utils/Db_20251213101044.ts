import mongoose from "mongoose";

const connectDb=async()=>{
    mongoose.connect('mongodb://127.0.0.1:27017/todo')
  .then(() => console.log('Connected!')).catch((err)=>console.log('error',err))
}

export default connectDb