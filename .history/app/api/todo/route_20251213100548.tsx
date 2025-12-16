import { NextApiRequest, NextApiResponse } from "next";


function GET(req:NextApiRequest,res:NextApiResponse){
   res.json({
    success:false,
    message:"success"
   })
}