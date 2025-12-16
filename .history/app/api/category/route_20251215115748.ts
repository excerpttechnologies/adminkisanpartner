import connectDB from "@/app/lib/Db"
import Category from "@/app/models/Category"
import { NextRequest } from "next/server"


export async function GET(req:NextRequest){
    try {
        await connectDB()
       const cat= Category.find({})
       return Next
    } catch (err) {
        console.log(err)
    }
}