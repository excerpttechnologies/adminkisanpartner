import { subcategoryID,categoryID } from "@/app/_utils/generateNextId";
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

/////post subcategory///

export async function POST(req:NextRequest){
    try{
        const body=await req.json()
        body.subCategoryId=await 
        const subCat=await Subcategory.create(body)
        return NextResponse.json({
            success:true,
            message:"success",
            subCat
        })
    }catch(error){
        console.log(error)
     return NextResponse.json({
        success:false,
        message:"Server error"
     })
    }
}