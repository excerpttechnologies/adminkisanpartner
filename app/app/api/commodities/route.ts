import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Category from "@/app/models/Category";


export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "subcategories",      // ✔ confirmed collection name
          localField: "_id",           // Category ObjectId
          foreignField: "categoryId",  // Subcategory ObjectId
          as: "subCategories"
        }
      },
      {
        $project: {
          __v: 0,
          "subCategories.__v": 0
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Categories with subcategories fetched successfully",
        data: categories
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Category-Subcategory API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error"
      },
      { status: 500 }
    );
  }
}
