import connectDB from "@/app/lib/Db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){
   try {
    await connectDB()
    const subCat=await 
   } catch (error) {
     console.log(error)
     return NextResponse.json({
        success:false,
        message:"Server error"
     })
   }
}