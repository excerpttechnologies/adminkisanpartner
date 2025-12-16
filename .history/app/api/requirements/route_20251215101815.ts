import connectDB from "@/app/lib/Db";
import Requirement from "@/app/models/Requirement";
import User from "@/app/models/User";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
       await connectDB()
      const require=await R.find({})
       return NextResponse.json({
         require
       })
}