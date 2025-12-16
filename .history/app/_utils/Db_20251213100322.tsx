import mongoose from "mongoose";

const connectDb=()=>{
    mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => console.log('Connected!'));
}