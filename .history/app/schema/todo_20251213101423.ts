import mongoose from "mongoose";

const todoSchema=new mongoose.Schema({
    todo:String
},{
    timestamps:true
})

exp