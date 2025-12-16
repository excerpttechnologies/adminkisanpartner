import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:NextRequest,{params}){
    try {
        
    } catch (error) {
         console.log(error)
         return NextResponse.json({
            success:false,
            message:"server error"
         })
    }
}