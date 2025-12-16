import connectDB from "@/app/lib/Db"
import Category from "@/app/models/Category"
import { NextRequest, NextResponse } from "next/server"


export async function GET(req:NextRequest){
    try {
       await connectDB()
       const cat= Category.find({})
       return NextResponse.json({
        success:true,
        message:"success",
        cat
       })
    } catch (err) {
        console.log(err)
        return NextResponse.json({
        success:false,
        message:"",
        cat
       })
    }
}