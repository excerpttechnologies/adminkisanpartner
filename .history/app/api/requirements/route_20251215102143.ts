import connectDB from "@/app/lib/Db";
import Requirement from "@/app/models/Requirement";
import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
  let query;
  const {search}=await req.query;

      try{
        await connectDB()
      const require=await Requirement.find({})
       return NextResponse.json({
         require
       })
      }catch(err){
        console.log(err)
      }
}