import { NextApiRequest } from "next";


function GET(req:NextApiRequest,res:NextapiR){
   res.json({
    success:false,
    message:"success"
   })
}