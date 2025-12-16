import { categoryID } from "@/app/_utils/generateNextId"
import connectDB from "@/app/lib/Db"
import Category from "@/app/models/Category"
import { NextRequest, NextResponse } from "next/server"


export async function GET(req:NextRequest){
    try {
       await connectDB()
       const cat=await Category.find({})
       return NextResponse.json({
        success:true,
        message:"success",
        cat
       })
    } catch (err) {
        console.log(err)
        return NextResponse.json({
        success:false,
        message:"error in server"
       })
    }
}

/////post category///

export async function POST(req:NextRequest){
    try{
        const body=await req.json()
        body.categoryId=await categoryID
        const subCat=await Category.create(body)
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