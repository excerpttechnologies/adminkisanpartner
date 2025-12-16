import connectDB from "@/app/lib/Db";
import Subcategory from "@/app/models/Subcategory";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){
   try {
    await connectDB()
    const subCat=await Subcategory.find({})
    return NextResponse.json({
        success:true,
        message:"success",
        subCat
    })
   } catch (error) {
     console.log(error)
     return NextResponse.json({
        success:false,
        message:"Server error"
     })
   }
}

/////post category