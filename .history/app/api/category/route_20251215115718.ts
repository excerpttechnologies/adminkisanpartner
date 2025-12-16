import connectDB from "@/app/lib/Db"
import Category from "@/app/models/Category"


export async function GET(){
    try {
        await connectDB()
       const cat= Category
    } catch (err) {
        console.log(err)
    }
}