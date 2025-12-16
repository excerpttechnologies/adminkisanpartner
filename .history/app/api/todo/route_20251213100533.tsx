import { NextApiRequest } from "next";


function GET(req:NextApiRequest,res){
   res.json({
    success:false,
    message:"success"
   })
}