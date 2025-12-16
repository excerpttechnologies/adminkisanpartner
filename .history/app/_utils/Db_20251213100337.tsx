import mongoose from "mongoose";

const connectDb=async()=>{
   awa mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => console.log('Connected!'));
}