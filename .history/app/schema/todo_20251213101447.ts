import mongoose from "mongoose";

const todoSchema=new mongoose.Schema({
    todo:String
},{
    timestamps:true
})

export default mongoose.model("todos")