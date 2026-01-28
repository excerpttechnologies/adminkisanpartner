


// import connectDB from "@/app/lib/Db";
// import Product from "@/app/models/Product";
// import Market from "@/app/models/Market";
// import Farmer from "@/app/models/Farmer";
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
//     const traderId = searchParams.get("traderId");
//     const grade = searchParams.get("grade");
//     const gradeStatus = searchParams.get("gradeStatus");
//     const includePurchaseHistory = searchParams.get("includePurchaseHistory") === "true";
    
//     // NEW: State, District, Taluk filters
//     const state = searchParams.get("state") ?? "";
//     const district = searchParams.get("district") ?? "";
//     const taluk = searchParams.get("taluk") ?? "";

//     const skip = (page - 1) * limit;

//     // Step 1: Get farmers filtered by state, district, taluk
//     let filteredFarmerIds: string[] = [];
    
//     if (state || district || taluk) {
//       const farmerFilter: any = {};
      
//       if (state) farmerFilter["personalInfo.state"] = state;
//       if (district) farmerFilter["personalInfo.district"] = district;
//       if (taluk) farmerFilter["personalInfo.taluk"] = taluk;
      
//       // Get only active farmers with the specified location
//       farmerFilter.isActive = true;
      
//       const filteredFarmers = await Farmer.find(farmerFilter)
//         .select('farmerId')
//         .lean();
      
//       filteredFarmerIds = filteredFarmers.map(f => f.farmerId).filter(Boolean);
      
//       console.log(`Location filter: ${filteredFarmerIds.length} farmers found for state=${state}, district=${district}, taluk=${taluk}`);
//     }

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
//     } else if (filteredFarmerIds.length > 0) {
//       // Apply geographic filter if farmerId is not specified
//       matchConditions.farmerId = { $in: filteredFarmerIds };
//     } else if (state || district || taluk) {
//       // If geographic filter provided but no matching farmers, return empty
//       matchConditions.farmerId = { $in: [] };
//     }
    
//     if (grade) {
//       matchConditions["gradePrices.grade"] = { $regex: grade, $options: "i" };
//     }
    
//     if (gradeStatus) {
//       matchConditions["gradePrices.status"] = gradeStatus;
//     }
    
//     // Filter by trader in purchase history
//     if (traderId) {
//       matchConditions["gradePrices.purchaseHistory.traderId"] = traderId;
//     }
    
//     if (search) {
//       matchConditions.$or = [
//         { cropBriefDetails: { $regex: search, $options: "i" } },
//         { "gradePrices.grade": { $regex: search, $options: "i" } },
//         { productId: { $regex: search, $options: "i" } },
//         { farmerId: { $regex: search, $options: "i" } }, // Add farmerId to search
//       ];
//     }

//     // Aggregation pipeline
//     const pipeline: PipelineStage[] = [
//       // Unwind gradePrices
//       { $unwind: "$gradePrices" },

//       // Match conditions
//       { $match: matchConditions },

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

//       // Extract trader IDs from purchase history
//       {
//         $addFields: {
//           traderIds: {
//             $ifNull: [
//               {
//                 $reduce: {
//                   input: "$gradePrices.purchaseHistory",
//                   initialValue: [],
//                   in: {
//                     $concatArrays: [
//                       "$$value",
//                       {
//                         $cond: [
//                           { $ne: ["$$this.traderId", null] },
//                           ["$$this.traderId"],
//                           []
//                         ]
//                       }
//                     ]
//                   }
//                 }
//               },
//               []
//             ]
//           },
//           // Ensure we always have purchaseHistory field (empty array if none)
//           purchaseHistoryField: {
//             $ifNull: ["$gradePrices.purchaseHistory", []]
//           },
//           // Create sortable fields
//           sortProductId: "$productId",
//           sortTotalQty: "$gradePrices.totalQty",
//           sortGradeStatus: "$gradePrices.status",
//           sortGrade: "$gradePrices.grade",
//           sortPricePerUnit: "$gradePrices.pricePerUnit",
//           sortCropBriefDetails: "$cropBriefDetails",
//           sortDeliveryDate: "$deliveryDate",
//           sortCreatedAt: "$createdAt"
//         }
//       },

//       // Project only required fields
//       {
//         $project: {
//           // Product basic info
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
//           productId: 1,
          
//           // Category names
//           categoryName: { 
//             $ifNull: [
//               { $arrayElemAt: ["$categoryInfo.categoryName", 0] },
//               ""
//             ]
//           },
//           subCategoryName: { 
//             $ifNull: [
//               { $arrayElemAt: ["$subCategoryInfo.subCategoryName", 0] },
//               ""
//             ]
//           },

//           // Grade price details
//           grade: "$gradePrices.grade",
//           pricePerUnit: "$gradePrices.pricePerUnit",
//           totalQty: "$gradePrices.totalQty",
//           quantityType: "$gradePrices.quantityType",
//           priceType: "$gradePrices.priceType",
//           gradeStatus: "$gradePrices.status",
          
//           // Trader IDs for lookup
//           traderIds: 1,
          
//           // Sort fields
//           sortProductId: 1,
//           sortTotalQty: 1,
//           sortGradeStatus: 1,
//           sortGrade: 1,
//           sortPricePerUnit: 1,
//           sortCropBriefDetails: 1,
//           sortDeliveryDate: 1,
//           sortCreatedAt: 1,
          
//           // Purchase history (if requested)
//           purchaseHistory: {
//             $cond: {
//               if: { $eq: [includePurchaseHistory, true] },
//               then: "$purchaseHistoryField",
//               else: []
//             }
//           }
//         },
//       },

//       // Sort based on the sortBy parameter
//       {
//         $sort: {
//           [sortBy === 'productId' ? 'sortProductId' : 
//            sortBy === 'totalQty' ? 'sortTotalQty' :
//            sortBy === 'gradeStatus' ? 'sortGradeStatus' :
//            sortBy === 'grade' ? 'sortGrade' :
//            sortBy === 'pricePerUnit' ? 'sortPricePerUnit' :
//            sortBy === 'cropBriefDetails' ? 'sortCropBriefDetails' :
//            sortBy === 'deliveryDate' ? 'sortDeliveryDate' :
//            'sortCreatedAt']: order
//         }
//       },

//       // Pagination
//       { $skip: skip },
//       { $limit: limit },
//     ];

//     // Execute pipeline
//     const products = await Product.aggregate(pipeline);

//     // Total count
//     const totalCountPipeline: PipelineStage[] = [
//       { $unwind: "$gradePrices" },
//       { $match: matchConditions },
//       { $count: "total" },
//     ];
//     const totalResult = await Product.aggregate(totalCountPipeline);
//     const total = totalResult[0]?.total ?? 0;

//     // Get all unique IDs needed
//     const userIds = new Set<string>();
//     const marketIds = new Set<string>();
    
//     products.forEach(product => {
//       // Add farmer ID
//       if (product.farmerId) userIds.add(product.farmerId);
      
//       // Add trader IDs
//       if (product.traderIds && product.traderIds.length > 0) {
//         product.traderIds.forEach((id: string) => userIds.add(id));
//       }
      
//       // Add market ID
//       if (product.nearestMarket) marketIds.add(product.nearestMarket.toString());
//     });

//     // Fetch markets
//     const markets = await Market.find({
//       _id: { $in: Array.from(marketIds).map(id => new Types.ObjectId(id)) }
//     }).lean();
    
//     const marketMap = new Map();
//     markets.forEach(market => {
//       marketMap.set(market._id.toString(), market);
//     });

//     // Fetch farmer/trader details with geographic info
//     const farmersTraders = await Farmer.find({
//       $or: [
//         { farmerId: { $in: Array.from(userIds) } },
//         { traderId: { $in: Array.from(userIds) } }
//       ]
//     }).lean();
    
//     const userMap = new Map();
//     farmersTraders.forEach(user => {
//       const id = user.farmerId || user.traderId;
//       if (id) {
//         userMap.set(id, {
//           // Include the ID field
//           farmerId: user.farmerId,
//           traderId: user.traderId,
          
//           personalInfo: user.personalInfo || {},
//           role: user.role,
//           farmLocation: user.farmLocation || {},
//           farmLand: user.farmLand || {},
//           bankDetails: user.bankDetails || {},
//           registrationStatus: user.registrationStatus,
//           isActive: user.isActive,
          
//           // Include other useful fields
//           commodities: user.commodities || [],
//           nearestMarkets: user.nearestMarkets || [],
//           subcategories: user.subcategories || [],
//           registeredAt: user.registeredAt,
//           updatedAt: user.updatedAt,
          
//           // Include geographic info for easy filtering
//           state: user.personalInfo?.state,
//           district: user.personalInfo?.district,
//           taluk: user.personalInfo?.taluk,
//           address: user.personalInfo?.address
//         });
//       }
//     });

//     // Format the final response
//     const formattedData = products.map(product => {
//       // Get market details
//       const marketDetails = product.nearestMarket ? 
//         marketMap.get(product.nearestMarket.toString()) || null : null;
      
//       // Get farmer details
//       const farmerDetails = product.farmerId ? 
//         userMap.get(product.farmerId) || null : null;
      
//       // Get unique trader details
//       let traderDetails = [];
//       if (product.traderIds && product.traderIds.length > 0) {
//         const uniqueTraderIds = [...new Set(product.traderIds)];
//         traderDetails = uniqueTraderIds
//           .map(id => userMap.get(id))
//           .filter(Boolean);
//       }

//       // Create response object with ALL fields
//       const response: any = {
//         farmerId: product.farmerId,
//         categoryId: product.categoryId,
//         subCategoryId: product.subCategoryId,
//         cropBriefDetails: product.cropBriefDetails,
//         farmingType: product.farmingType,
//         packagingType: product.packagingType,
//         deliveryDate: product.deliveryDate,
//         deliveryTime: product.deliveryTime,
//         nearestMarket: product.nearestMarket,
//         createdAt: product.createdAt,
//         productId: product.productId,
//         categoryName: product.categoryName,
//         subCategoryName: product.subCategoryName,
//         grade: product.grade,
//         pricePerUnit: product.pricePerUnit,
//         totalQty: product.totalQty,
//         quantityType: product.quantityType,
//         priceType: product.priceType,
//         gradeStatus: product.gradeStatus,
//         marketDetails: marketDetails,
//         farmerDetails: farmerDetails,
//         traderDetails: traderDetails
//       };

//       // Add purchase history if requested
//       if (includePurchaseHistory && product.purchaseHistory) {
//         response.purchaseHistory = product.purchaseHistory;
//       }

//       return response;
//     });

//     // Get filter options for state, district, taluk
//     let stateOptions: string[] = [];
//     let districtOptions: string[] = [];
//     let talukOptions: string[] = [];
    
//     // Get all farmers with products
//     const farmersWithProducts = await Product.distinct('farmerId', matchConditions);
    
//     if (farmersWithProducts.length > 0) {
//       // Get unique states from these farmers
//       const farmerDetails = await Farmer.find({ 
//         farmerId: { $in: farmersWithProducts },
//         "personalInfo.state": { $exists: true, $ne: "" }
//       }).select('personalInfo.state personalInfo.district personalInfo.taluk').lean();
      
//       stateOptions = [...new Set(farmerDetails
//         .map(f => f.personalInfo?.state)
//         .filter(Boolean))].sort();
      
//       // Get districts based on selected state
//       if (state) {
//         districtOptions = [...new Set(farmerDetails
//           .filter(f => f.personalInfo?.state === state)
//           .map(f => f.personalInfo?.district)
//           .filter(Boolean))].sort();
//       }
      
//       // Get taluks based on selected district
//       if (district) {
//         talukOptions = [...new Set(farmerDetails
//           .filter(f => f.personalInfo?.district === district)
//           .map(f => f.personalInfo?.taluk)
//           .filter(Boolean))].sort();
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit),
//       data: formattedData,
//       filters: {
//         geographic: {
//           states: stateOptions,
//           districts: districtOptions,
//           taluks: talukOptions
//         },
//         applied: {
//           state,
//           district,
//           taluk
//         }
//       }
//     });
//   } catch (error: any) {
//     console.error("Crop Sales Report API Error:", error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: "Server Error: " + error.message,
//         error: error.message
//       },
//       { status: 500 }
//     );
//   }
// }









import connectDB from "@/app/lib/Db";
import Product from "@/app/models/Product";
import Market from "@/app/models/Market";
import Farmer from "@/app/models/Farmer";
import { NextRequest, NextResponse } from "next/server";
import { PipelineStage, Types } from "mongoose";

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
    const traderId = searchParams.get("traderId");
    const grade = searchParams.get("grade");
    const gradeStatus = searchParams.get("gradeStatus");
    const includePurchaseHistory = searchParams.get("includePurchaseHistory") === "true";
   
    // NEW: State, District, Taluk filters
    const state = searchParams.get("state") ?? "";
    const district = searchParams.get("district") ?? "";
    const taluk = searchParams.get("taluk") ?? "";

    const skip = (page - 1) * limit;

    // Step 1: Get farmers filtered by state, district, taluk
    let filteredFarmerIds: string[] = [];
    
    if (state || district || taluk) {
      const farmerFilter: any = {};
      
      if (state) farmerFilter["personalInfo.state"] = state;
      if (district) farmerFilter["personalInfo.district"] = district;
      if (taluk) farmerFilter["personalInfo.taluk"] = taluk;
      
      // Get only active farmers with the specified location
      farmerFilter.isActive = true;
      
      const filteredFarmers = await Farmer.find(farmerFilter)
        .select('farmerId')
        .lean();
      
      filteredFarmerIds = filteredFarmers.map(f => f.farmerId).filter(Boolean);
      
      console.log(`Location filter: ${filteredFarmerIds.length} farmers found for state=${state}, district=${district}, taluk=${taluk}`);
    }

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
    } else if (filteredFarmerIds.length > 0) {
      // Apply geographic filter if farmerId is not specified
      matchConditions.farmerId = { $in: filteredFarmerIds };
    } else if (state || district || taluk) {
      // If geographic filter provided but no matching farmers, return empty
      matchConditions.farmerId = { $in: [] };
    }
    
    if (grade) {
      matchConditions["gradePrices.grade"] = { $regex: grade, $options: "i" };
    }
    
    if (gradeStatus) {
      matchConditions["gradePrices.status"] = gradeStatus;
    }
    
    // Filter by trader in purchase history
    if (traderId) {
      matchConditions["gradePrices.purchaseHistory.traderId"] = traderId;
    }
    
    if (search) {
      matchConditions.$or = [
        { cropBriefDetails: { $regex: search, $options: "i" } },
        { "gradePrices.grade": { $regex: search, $options: "i" } },
        { productId: { $regex: search, $options: "i" } },
        { farmerId: { $regex: search, $options: "i" } }, // Add farmerId to search
      ];
    }

    // Aggregation pipeline
    const pipeline: PipelineStage[] = [
      // Unwind gradePrices
      { $unwind: "$gradePrices" },

      // Match conditions
      { $match: matchConditions },

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

      // Extract trader IDs from purchase history
      {
        $addFields: {
          traderIds: {
            $ifNull: [
              {
                $reduce: {
                  input: "$gradePrices.purchaseHistory",
                  initialValue: [],
                  in: {
                    $concatArrays: [
                      "$$value",
                      {
                        $cond: [
                          { $ne: ["$$this.traderId", null] },
                          ["$$this.traderId"],
                          []
                        ]
                      }
                    ]
                  }
                }
              },
              []
            ]
          },
          // Ensure we always have purchaseHistory field (empty array if none)
          purchaseHistoryField: {
            $ifNull: ["$gradePrices.purchaseHistory", []]
          },
          // Create sortable fields
          sortProductId: "$productId",
          sortTotalQty: "$gradePrices.totalQty",
          sortGradeStatus: "$gradePrices.status",
          sortGrade: "$gradePrices.grade",
          sortPricePerUnit: "$gradePrices.pricePerUnit",
          sortCropBriefDetails: "$cropBriefDetails",
          sortDeliveryDate: "$deliveryDate",
          sortCreatedAt: "$createdAt"
        }
      },

      // Project only required fields
      {
        $project: {
          // Product basic info
          farmerId: 1,
          categoryId: 1,
          subCategoryId: 1,
          cropBriefDetails: 1,
          farmingType: 1,
          packagingType: 1,
          deliveryDate: 1,
          deliveryTime: 1,
          nearestMarket: 1,
          createdAt: 1,
          productId: 1,
          
          // Category names
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
          
          // Trader IDs for lookup
          traderIds: 1,
          
          // Sort fields
          sortProductId: 1,
          sortTotalQty: 1,
          sortGradeStatus: 1,
          sortGrade: 1,
          sortPricePerUnit: 1,
          sortCropBriefDetails: 1,
          sortDeliveryDate: 1,
          sortCreatedAt: 1,
          
          // Purchase history (if requested)
          purchaseHistory: {
            $cond: {
              if: { $eq: [includePurchaseHistory, true] },
              then: "$purchaseHistoryField",
              else: []
            }
          }
        },
      },

      // Sort based on the sortBy parameter
      {
        $sort: {
          [sortBy === 'productId' ? 'sortProductId' : 
           sortBy === 'totalQty' ? 'sortTotalQty' :
           sortBy === 'gradeStatus' ? 'sortGradeStatus' :
           sortBy === 'grade' ? 'sortGrade' :
           sortBy === 'pricePerUnit' ? 'sortPricePerUnit' :
           sortBy === 'cropBriefDetails' ? 'sortCropBriefDetails' :
           sortBy === 'deliveryDate' ? 'sortDeliveryDate' :
           'sortCreatedAt']: order
        }
      },

      // Pagination
      { $skip: skip },
      { $limit: limit },
    ];

    // Execute pipeline
    const products = await Product.aggregate(pipeline);

    // Total count
    const totalCountPipeline: PipelineStage[] = [
      { $unwind: "$gradePrices" },
      { $match: matchConditions },
      { $count: "total" },
    ];
    const totalResult = await Product.aggregate(totalCountPipeline);
    const total = totalResult[0]?.total ?? 0;

    // Get all unique IDs needed
    const userIds = new Set<string>();
    const marketIds = new Set<string>();
    
    products.forEach(product => {
      // Add farmer ID
      if (product.farmerId) userIds.add(product.farmerId);
      
      // Add trader IDs
      if (product.traderIds && product.traderIds.length > 0) {
        product.traderIds.forEach((id: string) => userIds.add(id));
      }
      
      // Add market ID
      if (product.nearestMarket) marketIds.add(product.nearestMarket.toString());
    });

    // Fetch markets
    const markets = await Market.find({
      _id: { $in: Array.from(marketIds).map(id => new Types.ObjectId(id)) }
    }).lean();
    
    const marketMap = new Map();
    markets.forEach(market => {
      marketMap.set(market._id.toString(), market);
    });

    // Fetch farmer/trader details with geographic info
    const farmersTraders = await Farmer.find({
      $or: [
        { farmerId: { $in: Array.from(userIds) } },
        { traderId: { $in: Array.from(userIds) } }
      ]
    }).lean();
    
    const userMap = new Map();
    farmersTraders.forEach(user => {
      const id = user.farmerId || user.traderId;
      if (id) {
        userMap.set(id, {
          // Include the ID field
          farmerId: user.farmerId,
          traderId: user.traderId,
          
          personalInfo: user.personalInfo || {},
          role: user.role,
          farmLocation: user.farmLocation || {},
          farmLand: user.farmLand || {},
          bankDetails: user.bankDetails || {},
          registrationStatus: user.registrationStatus,
          isActive: user.isActive,
          
          // Include other useful fields
          commodities: user.commodities || [],
          nearestMarkets: user.nearestMarkets || [],
          subcategories: user.subcategories || [],
          registeredAt: user.registeredAt,
          updatedAt: user.updatedAt,
          
          // Include geographic info for easy filtering
          state: user.personalInfo?.state,
          district: user.personalInfo?.district,
          taluk: user.personalInfo?.taluk,
          address: user.personalInfo?.address
        });
      }
    });

    // Format the final response
    const formattedData = products.map(product => {
      // Get market details
      const marketDetails = product.nearestMarket ? 
        marketMap.get(product.nearestMarket.toString()) || null : null;
      
      // Get farmer details
      const farmerDetails = product.farmerId ? 
        userMap.get(product.farmerId) || null : null;
      
      // Get unique trader details
      let traderDetails = [];
      if (product.traderIds && product.traderIds.length > 0) {
        const uniqueTraderIds = [...new Set(product.traderIds)];
        traderDetails = uniqueTraderIds
          .map(id => userMap.get(id))
          .filter(Boolean);
      }

      // Create response object with ALL fields
      const response: any = {
        farmerId: product.farmerId,
        categoryId: product.categoryId,
        subCategoryId: product.subCategoryId,
        cropBriefDetails: product.cropBriefDetails,
        farmingType: product.farmingType,
        packagingType: product.packagingType,
        deliveryDate: product.deliveryDate,
        deliveryTime: product.deliveryTime,
        nearestMarket: product.nearestMarket,
        createdAt: product.createdAt,
        productId: product.productId,
        categoryName: product.categoryName,
        subCategoryName: product.subCategoryName,
        grade: product.grade,
        pricePerUnit: product.pricePerUnit,
        totalQty: product.totalQty,
        quantityType: product.quantityType,
        priceType: product.priceType,
        gradeStatus: product.gradeStatus,
        marketDetails: marketDetails,
        farmerDetails: farmerDetails,
        traderDetails: traderDetails
      };

      // Add purchase history if requested
      if (includePurchaseHistory && product.purchaseHistory) {
        response.purchaseHistory = product.purchaseHistory;
      }

      return response;
    });

    // Get filter options for state, district, taluk
    let stateOptions: string[] = [];
    let districtOptions: string[] = [];
    let talukOptions: string[] = [];
    
    // Get all farmers with products
    const farmersWithProducts = await Product.distinct('farmerId', matchConditions);
    
    if (farmersWithProducts.length > 0) {
      // Get unique states from these farmers
      const farmerDetails = await Farmer.find({ 
        farmerId: { $in: farmersWithProducts },
        "personalInfo.state": { $exists: true, $ne: "" }
      }).select('personalInfo.state personalInfo.district personalInfo.taluk').lean();
      
      stateOptions = [...new Set(farmerDetails
        .map(f => f.personalInfo?.state)
        .filter(Boolean))].sort();
      
      // Get districts based on selected state
      if (state) {
        districtOptions = [...new Set(farmerDetails
          .filter(f => f.personalInfo?.state === state)
          .map(f => f.personalInfo?.district)
          .filter(Boolean))].sort();
      }
      
      // Get taluks based on selected district
      if (district) {
        talukOptions = [...new Set(farmerDetails
          .filter(f => f.personalInfo?.district === district)
          .map(f => f.personalInfo?.taluk)
          .filter(Boolean))].sort();
      }
    }

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: formattedData,
      filters: {
        geographic: {
          states: stateOptions,
          districts: districtOptions,
          taluks: talukOptions
        },
        applied: {
          state,
          district,
          taluk
        }
      }
    });
  } catch (error: any) {
    console.error("Crop Sales Report API Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Server Error: " + error.message,
        error: error.message
      },
      { status: 500 }
    );
  }
}