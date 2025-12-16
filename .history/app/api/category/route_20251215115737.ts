import connectDB from "@/app/lib/Db"
import Category from "@/app/models/Category"


export async function GET(req:Next){
    try {
        await connectDB()
       const cat= Category.find({})
    } catch (err) {
        console.log(err)
    }
}