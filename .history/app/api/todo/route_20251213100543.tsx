import { NextApiRequest } from "next";


function GET(req:NextApiRequest,res:Nextapi){
   res.json({
    success:false,
    message:"success"
   })
}