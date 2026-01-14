
// import connectDB from "@/app/lib/Db";
// import Product from "@/app/models/Product";
// import { NextRequest, NextResponse } from "next/server";
// import { PipelineStage, Types } from "mongoose";

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);

//     // Query params
//     const page = parseInt(searchParams.get("page") ?? "1", 10);
//     const limit = parseInt(searchParams.get("limit") ?? "10", 10);
//     const search = searchParams.get("search") ?? "";
//     const sortBy = searchParams.get("sortBy") ?? "createdAt";
//     const order: 1 | -1 = searchParams.get("order") === "asc" ? 1 : -1;
//     const categoryId = searchParams.get("categoryId");
//     const subCategoryId = searchParams.get("subCategoryId");
//     const farmerId = searchParams.get("farmerId");
//     const grade = searchParams.get("grade");
//     const gradeStatus = searchParams.get("gradeStatus");

//     const skip = (page - 1) * limit;

//     // Build match conditions
//     const matchConditions: any = {};

//     if (categoryId) {
//       matchConditions.categoryId = new Types.ObjectId(categoryId);
//     }
    
//     if (subCategoryId) {
//       matchConditions.subCategoryId = new Types.ObjectId(subCategoryId);
//     }
    
//     if (farmerId) {
//       matchConditions.farmerId = farmerId;
//     }
    
//     if (grade) {
//       matchConditions["gradePrices.grade"] = { $regex: grade, $options: "i" };
//     }
    
//     if (gradeStatus) {
//       matchConditions["gradePrices.status"] = gradeStatus;
//     }
    
//     if (search) {
//       matchConditions.$or = [
//         { cropBriefDetails: { $regex: search, $options: "i" } },
//         { "gradePrices.grade": { $regex: search, $options: "i" } },
//         { productId: { $regex: search, $options: "i" } },
//       ];
//     }

//     // Aggregation pipeline
//     const pipeline: PipelineStage[] = [
//       // Unwind gradePrices
//       { $unwind: "$gradePrices" },

//       // Match conditions
//       {
//         $match: matchConditions,
//       },

//       // Lookup for category name
//       {
//         $lookup: {
//           from: "categories",
//           localField: "categoryId",
//           foreignField: "_id",
//           as: "categoryInfo",
//         },
//       },
      
//       // Lookup for subcategory name
//       {
//         $lookup: {
//           from: "subcategories",
//           localField: "subCategoryId",
//           foreignField: "_id",
//           as: "subCategoryInfo",
//         },
//       },

//       // Project required fields
//       {
//         $project: {
//           _id: 0,
//           productId: 1,
//           farmerId: 1,
//           categoryId: 1,
//           subCategoryId: 1,
//           cropBriefDetails: 1,
//           farmingType: 1,
//           packagingType: 1,
//           deliveryDate: 1,
//           deliveryTime: 1,
//           nearestMarket: 1,
//           createdAt: 1,
          
//           // Category and SubCategory names
//           categoryName: { $arrayElemAt: ["$categoryInfo.categoryName", 0] },
//           subCategoryName: { $arrayElemAt: ["$subCategoryInfo.subCategoryName", 0] },

//           // Grade price details
//           grade: "$gradePrices.grade",
//           pricePerUnit: "$gradePrices.pricePerUnit",
//           totalQty: "$gradePrices.totalQty",
//           quantityType: "$gradePrices.quantityType",
//           priceType: "$gradePrices.priceType",
//           gradeStatus: "$gradePrices.status",
//         },
//       },

//       // Sort
//       {
//         $sort: {
//           [sortBy]: order,
//         } as Record<string, 1 | -1>,
//       },

//       // Pagination
//       { $skip: skip },
//       { $limit: limit },
//     ];

//     const data = await Product.aggregate(pipeline);

//     // Total count pipeline
//     const totalCountPipeline: PipelineStage[] = [
//       { $unwind: "$gradePrices" },
//       { $match: matchConditions },
//       { $count: "total" },
//     ];

//     const totalResult = await Product.aggregate(totalCountPipeline);
//     const total = totalResult[0]?.total ?? 0;

//     return NextResponse.json({
//       success: true,
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit),
//       data,
//     });
//   } catch (error) {
//     console.error("Crop Sales Report Error:", error);
//     return NextResponse.json(
//       { success: false, message: "Server Error" },
//       { status: 500 }
//     );
//   }
// }




import connectDB from "@/app/lib/Db";
import Product from "@/app/models/Product";
import { NextRequest, NextResponse } from "next/server";
import { PipelineStage, Types } from "mongoose";
import Market from "@/app/models/Market";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);

    // Query params
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "10", 10);
    const search = searchParams.get("search") ?? "";
    const sortBy = searchParams.get("sortBy") ?? "createdAt";
    const order: 1 | -1 = searchParams.get("order") === "asc" ? 1 : -1;
    const categoryId = searchParams.get("categoryId");
    const subCategoryId = searchParams.get("subCategoryId");
    const farmerId = searchParams.get("farmerId");
    const grade = searchParams.get("grade");
    const gradeStatus = searchParams.get("gradeStatus");

    const skip = (page - 1) * limit;

    // Build match conditions
    const matchConditions: any = {};

    if (categoryId) {
      matchConditions.categoryId = new Types.ObjectId(categoryId);
    }
    
    if (subCategoryId) {
      matchConditions.subCategoryId = new Types.ObjectId(subCategoryId);
    }
    
    if (farmerId) {
      matchConditions.farmerId = farmerId;
    }
    
    if (grade) {
      matchConditions["gradePrices.grade"] = { $regex: grade, $options: "i" };
    }
    
    if (gradeStatus) {
      matchConditions["gradePrices.status"] = gradeStatus;
    }
    
    if (search) {
      matchConditions.$or = [
        { cropBriefDetails: { $regex: search, $options: "i" } },
        { "gradePrices.grade": { $regex: search, $options: "i" } },
        { productId: { $regex: search, $options: "i" } },
      ];
    }

    // SIMPLE Aggregation pipeline WITHOUT market lookup
    const pipeline: PipelineStage[] = [
      // Unwind gradePrices
      { $unwind: "$gradePrices" },

      // Match conditions
      {
        $match: matchConditions,
      },

      // Lookup for category name
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      
      // Lookup for subcategory name
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategoryId",
          foreignField: "_id",
          as: "subCategoryInfo",
        },
      },

      // Project required fields
      {
        $project: {
          _id: 0,
          productId: 1,
          farmerId: 1,
          categoryId: 1,
          subCategoryId: 1,
          cropBriefDetails: 1,
          farmingType: 1,
          packagingType: 1,
          deliveryDate: 1,
          deliveryTime: 1,
          createdAt: 1,
          nearestMarket: 1, // Keep as-is
          
          // Category and SubCategory names
          categoryName: { 
            $ifNull: [
              { $arrayElemAt: ["$categoryInfo.categoryName", 0] },
              ""
            ]
          },
          subCategoryName: { 
            $ifNull: [
              { $arrayElemAt: ["$subCategoryInfo.subCategoryName", 0] },
              ""
            ]
          },

          // Grade price details
          grade: "$gradePrices.grade",
          pricePerUnit: "$gradePrices.pricePerUnit",
          totalQty: "$gradePrices.totalQty",
          quantityType: "$gradePrices.quantityType",
          priceType: "$gradePrices.priceType",
          gradeStatus: "$gradePrices.status",
        },
      },

      // Sort
      {
        $sort: {
          [sortBy]: order,
        } as Record<string, 1 | -1>,
      },

      // Pagination
      { $skip: skip },
      { $limit: limit },
    ];

    const data = await Product.aggregate(pipeline);

    // Total count pipeline
    const totalCountPipeline: PipelineStage[] = [
      { $unwind: "$gradePrices" },
      { $match: matchConditions },
      { $count: "total" },
    ];

    const totalResult = await Product.aggregate(totalCountPipeline);
    const total = totalResult[0]?.total ?? 0;

    // Fetch all markets
    const markets = await Market.find({}).lean();
    
    // Create a map of markets for easy lookup
    const marketMap = new Map();
    markets.forEach(market => {
      // Map by _id
      marketMap.set(market._id.toString(), market);
      // Also map by marketId if it exists
      if (market.marketId) {
        marketMap.set(market.marketId, market);
      }
      // Also map by marketName if it exists
      if (market.marketName) {
        marketMap.set(market.marketName, market);
      }
    });

    // Process data to add market details
    const processedData = data.map(item => {
      let marketDetails = null;
      
      if (item.nearestMarket) {
        // Try to find market by different keys
        marketDetails = marketMap.get(item.nearestMarket.toString()) || 
                        marketMap.get(item.nearestMarket) ||
                        null;
      }
      
      return {
        ...item,
        marketDetails: marketDetails
      };
    });

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: processedData
    });
  } catch (error: any) {
    console.error("Crop Sales Report Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server Error: " + error.message
      },
      { status: 500 }
    );
  }
}