



// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Posting from "@/app/models/Posting";
// import Tracking from "@/app/models/Tracking";
// import mongoose from "mongoose";


// const DEFAULT_STAGES = [
//   { name: "Nursery", status: "pending", photos: [] },
//   { name: "Pre-Planting", status: "pending", photos: [] },
//   { name: "Transplanting", status: "pending", photos: [] },
//   { name: "Vegetative", status: "pending", photos: [] },
//   { name: "Flowering", status: "pending", photos: [] },
//   { name: "Fruit Development", status: "pending", photos: [] },
//   { name: "Harvesting", status: "pending", photos: [] },
// ];

// /* ================= CREATE ================= */


// // export async function POST(req: NextRequest) {
// //   try {
// //     await connectDB();
// //     const body = await req.json();

// //     // Validate required fields
// //     const { farmingType, seedType, acres, sowingDate, farmerId } = body;
    
// //     if (!farmingType || !seedType || !acres || !sowingDate || !farmerId) {
// //       return NextResponse.json(
// //         { success: false, message: "All fields are required" },
// //         { status: 400 }
// //       );
// //     }

// //     // Start a transaction to ensure both crop and tracking are created
// //     const session = await mongoose.startSession();
// //     session.startTransaction();

// //     try {
// //       // 1. Create the crop/posting
// //       const crop = await Posting.create([{
// //         farmingType,
// //         seedType,
// //         acres: Number(acres),
// //         sowingDate: new Date(sowingDate),
// //         farmerId,
// //       }], { session });

// //       const createdCrop = crop[0];

// //       // 2. Generate a unique tracking name
// //       // Add timestamp to make it unique
// //       const timestamp = Date.now();
// //       const trackingName = `${seedType} Tracking (${farmingType}) - ${timestamp}`;
      
// //       // Or if you want more readable names, use incremental numbers
// //       // Count existing trackings for this farmer to create a sequence
// //       const existingTrackingsCount = await Tracking.countDocuments({ 
// //         farmerId,
// //         seedType,
// //         farmingType 
// //       }).session(session);
      
// //       const trackingNameWithSequence = `${seedType} Tracking (${farmingType}) #${existingTrackingsCount + 1}`;

// //       // 3. Create the tracking with 7 default stages
// //       const tracking = await Tracking.create([{
// //         name: trackingNameWithSequence, // Use unique name
// //         cropName: seedType,
// //         farmerId,
// //         cropId: createdCrop._id,
// //         stages: DEFAULT_STAGES,
// //         currentStageIndex: 0,
// //       }], { session });

// //       const createdTracking = tracking[0];

// //       // 4. Update the crop with trackingId
// //       createdCrop.trackingId = createdTracking._id;
// //       await createdCrop.save({ session });

// //       // Commit the transaction
// //       await session.commitTransaction();
// //       session.endSession();

// //       // Populate the crop with tracking data
// //       const populatedCrop = await Posting.findById(createdCrop._id)
// //         .populate('tracking')
// //         .lean();

// //       return NextResponse.json({ 
// //         success: true, 
// //         data: populatedCrop,
// //         tracking: createdTracking,
// //         message: "Crop and tracking created successfully" 
// //       });

// //     } catch (error: any) {
// //       // Rollback transaction on error
// //       await session.abortTransaction();
// //       session.endSession();
      
// //       console.error("Transaction error:", error);
// //       throw error;
// //     }

// //   } catch (error: any) {
// //     console.error("Error creating crop:", error);
    
// //     // Handle specific error cases
// //     let errorMessage = "Create failed";
// //     let statusCode = 500;

// //     if (error.name === 'ValidationError') {
// //       errorMessage = Object.values(error.errors).map((err: any) => err.message).join(', ');
// //       statusCode = 400;
// //     } else if (error.code === 11000) {
// //       if (error.keyPattern?.name) {
// //         errorMessage = "Tracking name already exists. Please try again with different seed type or farming type.";
// //       } else {
// //         errorMessage = "Duplicate entry found";
// //       }
// //       statusCode = 409;
// //     } else if (error.message?.includes("required")) {
// //       errorMessage = error.message;
// //       statusCode = 400;
// //     }

// //     return NextResponse.json(
// //       { success: false, message: errorMessage },
// //       { status: statusCode }
// //     );
// //   }
// // }

// // export async function POST(req: NextRequest) {
// //   try {
// //     await connectDB();
// //     const body = await req.json();

// //     // Validate required fields
// //     const { farmingType, seedType, acres, sowingDate, farmerId } = body;
    
// //     if (!farmingType || !seedType || !acres || !sowingDate || !farmerId) {
// //       return NextResponse.json(
// //         { success: false, message: "All fields are required" },
// //         { status: 400 }
// //       );
// //     }

// //     // Convert farmerId to ObjectId if it's a string
// //     const farmerObjectId = mongoose.Types.ObjectId.isValid(farmerId) 
// //       ? new mongoose.Types.ObjectId(farmerId)
// //       : farmerId;

// //     // Check if this crop already exists for this farmer (pre-emptive check)
// //     const existingCrop = await Posting.findOne({
// //       farmerId: farmerObjectId,
// //       seedType: seedType.toLowerCase(),
// //       farmingType: farmingType.toLowerCase()
// //     });

// //     if (existingCrop) {
// //       return NextResponse.json(
// //         { 
// //           success: false, 
// //           message: `You already have a ${seedType} crop with ${farmingType} farming type. Please choose a different seed type or farming type.`
// //         },
// //         { status: 409 }
// //       );
// //     }

// //     // Start a transaction to ensure both crop and tracking are created
// //     const session = await mongoose.startSession();
// //     session.startTransaction();

// //     try {
// //       // 1. Create the crop
// //       const crop = await Posting.create([{
// //         farmingType: farmingType.toLowerCase(),
// //         seedType: seedType.toLowerCase(),
// //         acres: Number(acres),
// //         sowingDate: new Date(sowingDate),
// //         farmerId: farmerObjectId,
// //       }], { session });

// //       const createdCrop = crop[0];

// //       // 2. Generate a unique tracking name
// //       // Get farmer's existing trackings count
// //       const existingTrackings = await Tracking.find({ 
// //         farmerId: farmerObjectId 
// //       }).session(session);
      
// //       // Count how many trackings of this seed type the farmer already has
// //       const sameSeedTypeCount = existingTrackings.filter(
// //         t => t.cropName?.toLowerCase() === seedType.toLowerCase()
// //       ).length;
      
// //       // Create a readable but unique tracking name
// //       const trackingName = `${seedType} ${farmingType} #${sameSeedTypeCount + 1}`;

// //       // 3. Create the tracking
// //       const tracking = await Tracking.create([{
// //         name: trackingName,
// //         cropName: seedType,
// //         farmerId: farmerObjectId,
// //         cropId: createdCrop._id,
// //         stages: DEFAULT_STAGES,
// //         currentStageIndex: 0,
// //       }], { session });

// //       const createdTracking = tracking[0];

// //       // 4. Update the crop with trackingId
// //       createdCrop.trackingId = createdTracking._id;
// //       await createdCrop.save({ session });

// //       // Commit the transaction
// //       await session.commitTransaction();
// //       session.endSession();

// //       // Populate the crop with tracking data
// //       const populatedCrop = await Posting.findById(createdCrop._id)
// //         .populate('tracking')
// //         .lean();

// //       return NextResponse.json({ 
// //         success: true, 
// //         data: populatedCrop,
// //         tracking: createdTracking,
// //         message: "Crop and tracking created successfully" 
// //       });

// //     } catch (error: any) {
// //       // Rollback transaction on error
// //       await session.abortTransaction();
// //       session.endSession();
      
// //       console.error("Transaction error:", error);
      
// //       // Handle specific MongoDB duplicate key error
// //       if (error.code === 11000) {
// //         const field = Object.keys(error.keyPattern || {})[0];
        
// //         if (field === 'unique_crop_per_farmer') {
// //           return NextResponse.json(
// //             { 
// //               success: false, 
// //               message: `This farmer already has a ${seedType} crop with ${farmingType} farming type.`
// //             },
// //             { status: 409 }
// //           );
// //         } else if (error.keyPattern?.name) {
// //           // Tracking name duplicate - retry with different name
// //           return NextResponse.json(
// //             { 
// //               success: false, 
// //               message: "Please try again. System will generate a unique tracking name."
// //             },
// //             { status: 409 }
// //           );
// //         }
// //       }
      
// //       throw error;
// //     }

// //   } catch (error: any) {
// //     console.error("Error creating crop:", error);
    
// //     let errorMessage = "Failed to create crop";
// //     let statusCode = 500;

// //     if (error.name === 'ValidationError') {
// //       errorMessage = Object.values(error.errors).map((err: any) => err.message).join(', ');
// //       statusCode = 400;
// //     } else if (error.code === 11000) {
// //       errorMessage = "Duplicate entry detected. Please use different seed type or farming type.";
// //       statusCode = 409;
// //     } else if (error.message?.includes("required") || error.message?.includes("must")) {
// //       errorMessage = error.message;
// //       statusCode = 400;
// //     }

// //     return NextResponse.json(
// //       { success: false, message: errorMessage },
// //       { status: statusCode }
// //     );
// //   }
// // }


// // export async function POST(req: NextRequest) {
// //   try {
// //     await connectDB();
// //     const body = await req.json();

// //     // Validate required fields
// //     const { farmingType, seedType, acres, sowingDate, farmerId } = body;
    
// //     if (!farmingType || !seedType || !acres || !sowingDate || !farmerId) {
// //       return NextResponse.json(
// //         { success: false, message: "All fields are required" },
// //         { status: 400 }
// //       );
// //     }

// //     // Normalize inputs
// //     const normalizedFarmingType = farmingType.toLowerCase().trim();
// //     const normalizedSeedType = seedType.toLowerCase().trim();

// //     // Convert farmerId to ObjectId if it's a valid ObjectId string
// //     let farmerObjectId;
// //     try {
// //       // Check if it's a valid 24-character hex string (ObjectId)
// //       if (/^[0-9a-fA-F]{24}$/.test(farmerId)) {
// //         farmerObjectId = new mongoose.Types.ObjectId(farmerId);
// //       } else {
// //         // If it's not an ObjectId, keep it as string (adjust based on your needs)
// //         farmerObjectId = farmerId;
// //       }
// //     } catch (error) {
// //       return NextResponse.json(
// //         { success: false, message: "Invalid Farmer ID format" },
// //         { status: 400 }
// //       );
// //     }

// //     // Check if this crop already exists for this farmer
// //     const existingCrop = await Posting.findOne({
// //       farmerId: farmerObjectId,
// //       seedType: normalizedSeedType,
// //       farmingType: normalizedFarmingType
// //     });

// //     if (existingCrop) {
// //       return NextResponse.json(
// //         { 
// //           success: false, 
// //           message: `You already have a ${seedType} crop with ${farmingType} farming type. Please choose a different seed type or farming type.`
// //         },
// //         { status: 409 }
// //       );
// //     }

// //     // Start a transaction
// //     const session = await mongoose.startSession();
// //     session.startTransaction();

// //     try {
// //       // 1. Create the crop
// //       const crop = await Posting.create([{
// //         farmingType: normalizedFarmingType,
// //         seedType: normalizedSeedType,
// //         acres: Number(acres),
// //         sowingDate: new Date(sowingDate),
// //         farmerId: farmerObjectId,
// //       }], { session });

// //       const createdCrop = crop[0];

// //       // 2. Generate unique tracking name
// //       // Count existing trackings for this farmer to create sequence
// //       const existingTrackingsCount = await Tracking.countDocuments({ 
// //         farmerId: farmerObjectId 
// //       }).session(session);
      
// //       // Simple sequential naming - no need for complex uniqueness
// //       const trackingName = `${seedType} ${farmingType} - ${existingTrackingsCount + 1}`;

// //       // 3. Create the tracking
// //       const tracking = await Tracking.create([{
// //         name: trackingName,
// //         cropName: normalizedSeedType,
// //         farmerId: farmerObjectId.toString(), // Convert to string if needed
// //         cropId: createdCrop._id,
// //         stages: DEFAULT_STAGES,
// //         currentStageIndex: 0,
// //       }], { session });

// //       const createdTracking = tracking[0];

// //       // 4. Update the crop with trackingId
// //       createdCrop.trackingId = createdTracking._id;
// //       await createdCrop.save({ session });

// //       // Commit the transaction
// //       await session.commitTransaction();
// //       session.endSession();

// //       // Populate and return
// //       const populatedCrop = await Posting.findById(createdCrop._id)
// //         .populate('tracking')
// //         .lean();

// //       return NextResponse.json({ 
// //         success: true, 
// //         data: populatedCrop,
// //         tracking: createdTracking,
// //         message: "Crop and tracking created successfully" 
// //       });

// //     } catch (error: any) {
// //       // Rollback transaction on error
// //       await session.abortTransaction();
// //       session.endSession();
      
// //       console.error("Transaction error:", error);
// //       throw error; // Let the outer catch handle it
// //     }

// //   } catch (error: any) {
// //     console.error("Error creating crop:", error);
    
// //     let errorMessage = "Failed to create crop";
// //     let statusCode = 500;

// //     if (error.name === 'ValidationError') {
// //       errorMessage = Object.values(error.errors).map((err: any) => err.message).join(', ');
// //       statusCode = 400;
// //     } else if (error.code === 11000) {
// //       // MongoDB duplicate key error
// //       // Check which unique constraint was violated
// //       if (error.keyPattern) {
// //         const fields = Object.keys(error.keyPattern);
        
// //         if (fields.includes('farmerId') && fields.includes('seedType') && fields.includes('farmingType')) {
// //           errorMessage = `You already have a crop with  farming type.`;
// //         } else if (fields.includes('name') && error.keyPattern.name === 1) {
// //           // This shouldn't happen with your Tracking model, but handle just in case
// //           errorMessage = "A tracking with this name already exists. Please try again.";
// //         } else {
// //           errorMessage = "Duplicate entry detected.";
// //         }
// //       } else {
// //         errorMessage = "Duplicate entry detected.";
// //       }
// //       statusCode = 409;
// //     } else if (error.message?.includes("required") || error.message?.includes("must")) {
// //       errorMessage = error.message;
// //       statusCode = 400;
// //     }

// //     return NextResponse.json(
// //       { success: false, message: errorMessage },
// //       { status: statusCode }
// //     );
// //   }
// // }

// // Helper function to generate guaranteed unique tracking name
// function generateUniqueTrackingName(seedType:string, farmingType:string, farmerId:string, attempt = 0) {
//   const timestamp = Date.now();
//   const randomSuffix = Math.random().toString(36).substring(2, 8); // 6 random chars
  
//   if (attempt === 0) {
//     // First attempt: readable name with timestamp
//     return `${seedType} ${farmingType} - ${timestamp}`;
//   } else {
//     // Retry: add random suffix
//     return `${seedType} ${farmingType} - ${timestamp}${randomSuffix}`;
//   }
// }

// export async function POST(req: NextRequest) {
//   // Declare variables in outer scope so they're accessible in catch block
//   let farmingType, seedType, acres, sowingDate, farmerId;
  
//   try {
//     await connectDB();
//     const body = await req.json();

//     // Extract and validate required fields
//     ({ farmingType, seedType, acres, sowingDate, farmerId } = body);
    
//     if (!farmingType || !seedType || !acres || !sowingDate || !farmerId) {
//       return NextResponse.json(
//         { success: false, message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // Normalize inputs
//     const normalizedFarmingType = farmingType.toLowerCase().trim();
//     const normalizedSeedType = seedType.toLowerCase().trim();

//     // Convert farmerId to ObjectId
//     let farmerObjectId;
//     try {
//       if (mongoose.Types.ObjectId.isValid(farmerId)) {
//         farmerObjectId = new mongoose.Types.ObjectId(farmerId);
//       } else {
//         // If not ObjectId, use as string
//         farmerObjectId = farmerId;
//       }
//     } catch (error) {
//       return NextResponse.json(
//         { success: false, message: "Invalid Farmer ID format" },
//         { status: 400 }
//       );
//     }

//     // Validate acres is a positive number
//     const acresNumber = Number(acres);
//     if (isNaN(acresNumber) || acresNumber <= 0) {
//       return NextResponse.json(
//         { success: false, message: "Acres must be a positive number" },
//         { status: 400 }
//       );
//     }

//     // Validate sowingDate
//     const sowingDateObj = new Date(sowingDate);
//     if (isNaN(sowingDateObj.getTime())) {
//       return NextResponse.json(
//         { success: false, message: "Invalid sowing date" },
//         { status: 400 }
//       );
//     }

//     // Check if this crop already exists for this farmer
//     const existingCrop = await Posting.findOne({
//       farmerId: farmerObjectId,
//       seedType: normalizedSeedType,
//       farmingType: normalizedFarmingType
//     });

//     if (existingCrop) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: `You already have a ${seedType} crop with ${farmingType} farming type. Please choose a different seed type or farming type.`
//         },
//         { status: 409 }
//       );
//     }

//     // Start a transaction
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       // 1. Create the crop
//       const crop = await Posting.create([{
//         farmingType: normalizedFarmingType,
//         seedType: normalizedSeedType,
//         acres: acresNumber,
//         sowingDate: sowingDateObj,
//         farmerId: farmerObjectId,
//       }], { session });

//       const createdCrop = crop[0];

//       // 2. Generate guaranteed unique tracking name with retry logic
//       let createdTracking;
//       let retryCount = 0;
//       const maxRetries = 3;
      
//       while (retryCount < maxRetries) {
//         try {
//           const trackingName = generateUniqueTrackingName(seedType, farmingType, farmerObjectId, retryCount);
          
//           // 3. Create the tracking
//           const tracking = await Tracking.create([{
//             name: trackingName,
//             cropName: normalizedSeedType,
//             farmerId: farmerObjectId,
//             cropId: createdCrop._id,
//             stages: DEFAULT_STAGES,
//             currentStageIndex: 0,
//           }], { session });

//           createdTracking = tracking[0];
//           break; // Success, exit loop
          
//         } catch (trackingError: any) {
//           if (trackingError.code === 11000 && trackingError.keyPattern?.name) {
//             // Duplicate name error, retry with different name
//             retryCount++;
//             if (retryCount >= maxRetries) {
//               throw new Error(`Failed to create unique tracking name after ${maxRetries} attempts`);
//             }
//             continue;
//           } else {
//             throw trackingError;
//           }
//         }
//       }

//       if (!createdTracking) {
//         throw new Error("Failed to create tracking");
//       }

//       // 4. Update the crop with trackingId
//       createdCrop.trackingId = createdTracking._id;
//       await createdCrop.save({ session });

//       // Commit the transaction
//       await session.commitTransaction();
//       session.endSession();

//       // Populate and return
//       const populatedCrop = await Posting.findById(createdCrop._id)
//         .populate('tracking')
//         .lean();

//       return NextResponse.json({ 
//         success: true, 
//         data: populatedCrop,
//         tracking: createdTracking,
//         message: "Crop and tracking created successfully" 
//       });

//     } catch (error: any) {
//       // Rollback transaction on error
//       await session.abortTransaction();
//       session.endSession();
      
//       console.error("Transaction error:", error);
//       throw error;
//     }

//   } catch (error: any) {
//     console.error("Error creating crop:", error);
    
//     let errorMessage = "Failed to create crop";
//     let statusCode = 500;

//     if (error.name === 'ValidationError') {
//       errorMessage = Object.values(error.errors).map((err: any) => err.message).join(', ');
//       statusCode = 400;
//     } else if (error.code === 11000) {
//       // MongoDB duplicate key error
//       // Extract seedType and farmingType from error object or use original values
//       const duplicateSeedType = error.keyValue?.seedType || seedType;
//       const duplicateFarmingType = error.keyValue?.farmingType || farmingType;
      
//       if (error.keyPattern?.seedType && error.keyPattern?.farmingType && error.keyPattern?.farmerId) {
//         errorMessage = `You already have a ${duplicateSeedType} crop with ${duplicateFarmingType} farming type.`;
//       } else if (error.keyPattern?.name) {
//         errorMessage = "A tracking with this name already exists. Please try again.";
//       } else {
//         errorMessage = "Duplicate entry detected.";
//       }
//       statusCode = 409;
//     } else if (error.message?.includes("required") || error.message?.includes("must")) {
//       errorMessage = error.message;
//       statusCode = 400;
//     }

//     return NextResponse.json(
//       { 
//         success: false, 
//         message: errorMessage,
//         // Add debug info in development
//         ...(process.env.NODE_ENV === 'development' && {
//           debug: {
//             errorCode: error.code,
//             keyPattern: error.keyPattern,
//             keyValue: error.keyValue,
//             errorMessage: error.message
//           }
//         })
//       },
//       { status: statusCode }
//     );
//   }
// }

// // Additional endpoint to fix the unique constraint issue
// export async function PATCH(req: NextRequest) {
//   try {
//     await connectDB();
    
//     const { action } = await req.json();
    
//     if (action === 'remove-unique-constraint') {
//       let message = "";
      
//       try {
//         // Try to remove the unique index on name field
//         await Tracking.collection.dropIndex("name_1");
//         message = "✅ Unique constraint removed from tracking name field. ";
//       } catch (dropError: any) {
//         if (dropError.codeName === 'IndexNotFound') {
//           message = "ℹ️ Unique constraint not found or already removed. ";
//         } else {
//           message = `⚠️ Could not remove index: ${dropError.message}. `;
//         }
//       }
      
//       // Create a non-unique index for better query performance
//       try {
//         await Tracking.collection.createIndex(
//           { name: 1 },
//           { 
//             name: "name_index",
//             background: true 
//           }
//         );
//         message += "✅ Created non-unique name index.";
//       } catch (createError: any) {
//         message += `⚠️ Could not create new index: ${createError.message}`;
//       }
      
//       return NextResponse.json({
//         success: true,
//         message
//       });
//     }
    
//     return NextResponse.json({
//       success: false,
//       message: "Invalid action. Send { action: 'remove-unique-constraint' }"
//     }, { status: 400 });
    
//   } catch (error: any) {
//     console.error("Error fixing constraint:", error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: error.message
//       },
//       { status: 500 }
//     );
//   }
// }


// /* ================= GET (LIST) ================= */
// /* ================= GET (LIST with SEARCH) ================= */
// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);

//     const search = searchParams.get("search") || "";
//     const page = Number(searchParams.get("page")) || 1;
//     const limit = Number(searchParams.get("limit")) || 10;
//     const farmingType = searchParams.get("farmingType") || "";
//     const seedType = searchParams.get("seedType") || "";
//     const trackingId= searchParams.get("trackingId") || "";
  

//     const filter: any = {};

//     if (search) {
//       filter.$or = [
//         { farmingType: { $regex: search, $options: "i" } },
//         { seedType: { $regex: search, $options: "i" } },
//         { farmerId: { $regex: search, $options: "i" } },
//         { trackingId: { $regex: search, $options: "i" } },
//         {
//           $expr: {
//             $regexMatch: {
//               input: { $toString: "$acres" },
//               regex: search,
//             },
//           },
//         },
//       ];
//     }

//     // Add farming type filter if provided
//     if (farmingType) {
//       filter.farmingType = farmingType;
//     }

//     if(trackingId){
//       filter.trackingId=trackingId;
//     }

//     // Add seed type filter if provided
//     if (seedType) {
//       filter.seedType = seedType;
//     }

//     const total = await Posting.countDocuments(filter);

//     const data = await Posting.find(filter)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//       const data1=await Posting.find({})

//     return NextResponse.json({
//       success: true,
//       page,
//       limit,
//       total,
//       data,
//       data1
//     });
//   } catch (error) {
//     console.error("Error fetching crops:", error);
//     return NextResponse.json(
//       { success: false, message: "Fetch failed" },
//       { status: 500 }
//     );
//   }
// }












import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Posting from "@/app/models/Posting";
import Tracking from "@/app/models/Tracking";
import Farmer from "@/app/models/Farmer";
import mongoose from "mongoose";


const DEFAULT_STAGES = [
  { name: "Nursery", status: "pending", photos: [] },
  { name: "Pre-Planting", status: "pending", photos: [] },
  { name: "Transplanting", status: "pending", photos: [] },
  { name: "Vegetative", status: "pending", photos: [] },
  { name: "Flowering", status: "pending", photos: [] },
  { name: "Fruit Development", status: "pending", photos: [] },
  { name: "Harvesting", status: "pending", photos: [] },
];

/* ================= CREATE ================= */


// Helper function to generate guaranteed unique tracking name
function generateUniqueTrackingName(seedType:string, farmingType:string, farmerId:string, attempt = 0) {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8); // 6 random chars
  
  if (attempt === 0) {
    // First attempt: readable name with timestamp
    return `${seedType} ${farmingType} - ${timestamp}`;
  } else {
    // Retry: add random suffix
    return `${seedType} ${farmingType} - ${timestamp}${randomSuffix}`;
  }
}

export async function POST(req: NextRequest) {
  // Declare variables in outer scope so they're accessible in catch block
  let farmingType, seedType, acres, sowingDate, farmerId;
  
  try {
    await connectDB();
    const body = await req.json();

    // Extract and validate required fields
    ({ farmingType, seedType, acres, sowingDate, farmerId } = body);
    
    if (!farmingType || !seedType || !acres || !sowingDate || !farmerId) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Normalize inputs
    const normalizedFarmingType = farmingType.toLowerCase().trim();
    const normalizedSeedType = seedType.toLowerCase().trim();

    // Convert farmerId to ObjectId
    let farmerObjectId;
    try {
      if (mongoose.Types.ObjectId.isValid(farmerId)) {
        farmerObjectId = new mongoose.Types.ObjectId(farmerId);
      } else {
        // If not ObjectId, use as string
        farmerObjectId = farmerId;
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid Farmer ID format" },
        { status: 400 }
      );
    }

    // Validate acres is a positive number
    const acresNumber = Number(acres);
    if (isNaN(acresNumber) || acresNumber <= 0) {
      return NextResponse.json(
        { success: false, message: "Acres must be a positive number" },
        { status: 400 }
      );
    }

    // Validate sowingDate
    const sowingDateObj = new Date(sowingDate);
    if (isNaN(sowingDateObj.getTime())) {
      return NextResponse.json(
        { success: false, message: "Invalid sowing date" },
        { status: 400 }
      );
    }

    // Check if this crop already exists for this farmer
    const existingCrop = await Posting.findOne({
      farmerId: farmerObjectId,
      seedType: normalizedSeedType,
      farmingType: normalizedFarmingType
    });

    if (existingCrop) {
      return NextResponse.json(
        { 
          success: false, 
          message: `You already have a ${seedType} crop with ${farmingType} farming type. Please choose a different seed type or farming type.`
        },
        { status: 409 }
      );
    }

    // Start a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Create the crop
      const crop = await Posting.create([{
        farmingType: normalizedFarmingType,
        seedType: normalizedSeedType,
        acres: acresNumber,
        sowingDate: sowingDateObj,
        farmerId: farmerObjectId,
      }], { session });

      const createdCrop = crop[0];

      // 2. Generate guaranteed unique tracking name with retry logic
      let createdTracking;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          const trackingName = generateUniqueTrackingName(seedType, farmingType, farmerObjectId, retryCount);
          
          // 3. Create the tracking
          const tracking = await Tracking.create([{
            name: trackingName,
            cropName: normalizedSeedType,
            farmerId: farmerObjectId,
            cropId: createdCrop._id,
            stages: DEFAULT_STAGES,
            currentStageIndex: 0,
          }], { session });

          createdTracking = tracking[0];
          break; // Success, exit loop
          
        } catch (trackingError: any) {
          if (trackingError.code === 11000 && trackingError.keyPattern?.name) {
            // Duplicate name error, retry with different name
            retryCount++;
            if (retryCount >= maxRetries) {
              throw new Error(`Failed to create unique tracking name after ${maxRetries} attempts`);
            }
            continue;
          } else {
            throw trackingError;
          }
        }
      }

      if (!createdTracking) {
        throw new Error("Failed to create tracking");
      }

      // 4. Update the crop with trackingId
      createdCrop.trackingId = createdTracking._id;
      await createdCrop.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Populate and return
      const populatedCrop = await Posting.findById(createdCrop._id)
        .populate('tracking')
        .lean();

      return NextResponse.json({ 
        success: true, 
        data: populatedCrop,
        tracking: createdTracking,
        message: "Crop and tracking created successfully" 
      });

    } catch (error: any) {
      // Rollback transaction on error
      await session.abortTransaction();
      session.endSession();
      
      console.error("Transaction error:", error);
      throw error;
    }

  } catch (error: any) {
    console.error("Error creating crop:", error);
    
    let errorMessage = "Failed to create crop";
    let statusCode = 500;

    if (error.name === 'ValidationError') {
      errorMessage = Object.values(error.errors).map((err: any) => err.message).join(', ');
      statusCode = 400;
    } else if (error.code === 11000) {
      // MongoDB duplicate key error
      // Extract seedType and farmingType from error object or use original values
      const duplicateSeedType = error.keyValue?.seedType || seedType;
      const duplicateFarmingType = error.keyValue?.farmingType || farmingType;
      
      if (error.keyPattern?.seedType && error.keyPattern?.farmingType && error.keyPattern?.farmerId) {
        errorMessage = `You already have a ${duplicateSeedType} crop with ${duplicateFarmingType} farming type.`;
      } else if (error.keyPattern?.name) {
        errorMessage = "A tracking with this name already exists. Please try again.";
      } else {
        errorMessage = "Duplicate entry detected.";
      }
      statusCode = 409;
    } else if (error.message?.includes("required") || error.message?.includes("must")) {
      errorMessage = error.message;
      statusCode = 400;
    }

    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        // Add debug info in development
        ...(process.env.NODE_ENV === 'development' && {
          debug: {
            errorCode: error.code,
            keyPattern: error.keyPattern,
            keyValue: error.keyValue,
            errorMessage: error.message
          }
        })
      },
      { status: statusCode }
    );
  }
}

// Additional endpoint to fix the unique constraint issue
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    
    const { action } = await req.json();
    
    if (action === 'remove-unique-constraint') {
      let message = "";
      
      try {
        // Try to remove the unique index on name field
        await Tracking.collection.dropIndex("name_1");
        message = "✅ Unique constraint removed from tracking name field. ";
      } catch (dropError: any) {
        if (dropError.codeName === 'IndexNotFound') {
          message = "ℹ️ Unique constraint not found or already removed. ";
        } else {
          message = `⚠️ Could not remove index: ${dropError.message}. `;
        }
      }
      
      // Create a non-unique index for better query performance
      try {
        await Tracking.collection.createIndex(
          { name: 1 },
          { 
            name: "name_index",
            background: true 
          }
        );
        message += "✅ Created non-unique name index.";
      } catch (createError: any) {
        message += `⚠️ Could not create new index: ${createError.message}`;
      }
      
      return NextResponse.json({
        success: true,
        message
      });
    }
    
    return NextResponse.json({
      success: false,
      message: "Invalid action. Send { action: 'remove-unique-constraint' }"
    }, { status: 400 });
    
  } catch (error: any) {
    console.error("Error fixing constraint:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message
      },
      { status: 500 }
    );
  }
}



/* ================= GET (LIST with POPULATE) ================= */



// Type definitions - Make them more flexible
interface Stage {
  name: string;
  status: "pending" | "in_progress" | "completed";
  photos: string[];
  _id: any;
  completedAt?: Date;
}

interface TrackingData {
  _id: any;
  name: string;
  cropName: string;
  farmerId: string;
  cropId: any;
  stages: Stage[];
  currentStageIndex: number;
  createdAt: Date;
  updatedAt: Date;
  progress?: number;
  isCompleted?: boolean;
  currentStageName?: string;
  __v?: number;
}

interface FarmerData {
  _id: any;
  farmerId?: string;
  traderId?: string;
  role: string;
  personalInfo: {
    name: string;
    mobileNo: string;
    email?: string;
    address?: string;
    villageGramaPanchayat?: string;
    pincode?: string;
    state?: string;
    district?: string;
    taluk?: string;
    post?: string;
  };
  registrationStatus: string;
  isActive: boolean;
  commodities?: string[];
  subcategories?: string[];
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

interface CropData {
  _id: any;
  farmingType: string;
  seedType: string;
  acres: number;
  sowingDate: Date;
  farmerId: string;
  trackingId?: any;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

interface EnrichedCropData extends Omit<CropData, 'trackingId'> {
  tracking: TrackingData | null;
  farmer: FarmerData | null;
}

// Helper functions - Make them more robust
const calculateProgress = (stages: any[]): number => {
  if (!stages || !Array.isArray(stages) || stages.length === 0) return 0;
  const completed = stages.filter(stage => stage?.status === 'completed').length;
  return Math.round((completed / stages.length) * 100);
};

const getCurrentStageName = (tracking: any): string | null => {
  if (!tracking || !tracking.stages || !Array.isArray(tracking.stages)) return null;
  
  const currentStageIndex = typeof tracking.currentStageIndex === 'number' 
    ? tracking.currentStageIndex 
    : parseInt(tracking.currentStageIndex) || 0;
  
  if (currentStageIndex >= 0 && currentStageIndex < tracking.stages.length) {
    const stage = tracking.stages[currentStageIndex];
    return stage?.name || null;
  }
  return null;
};

/* ================= GET (LIST with POPULATE) ================= */
// export async function GET(req: NextRequest): Promise<NextResponse> {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);

//     const search = searchParams.get("search") || "";
//     const page = Number(searchParams.get("page")) || 1;
//     const limit = Number(searchParams.get("limit")) || 10;
//     const farmingType = searchParams.get("farmingType") || "";
//     const seedType = searchParams.get("seedType") || "";
//     const trackingId = searchParams.get("trackingId") || "";
//     const farmerId = searchParams.get("farmerId") || "";
//     const role = searchParams.get("role") || "farmer";

//     // Build filter
//     const filter: any = {};
    
//     if (search) {
//       filter.$or = [
//         { farmingType: { $regex: search, $options: "i" } },
//         { seedType: { $regex: search, $options: "i" } },
//         { farmerId: { $regex: search, $options: "i" } },
//         { trackingId: { $regex: search, $options: "i" } },
//       ];
//     }

//     if (farmingType) filter.farmingType = farmingType;
//     if (seedType) filter.seedType = seedType;
//     if (trackingId) filter.trackingId = trackingId;
//     if (farmerId) filter.farmerId = farmerId;

//     // Get total count
//     const total = await Posting.countDocuments(filter);

//     // Get paginated crops
//     const crops = await Posting.find(filter)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .lean();

//     // Prepare arrays for batch lookups
//     const trackingIds: string[] = [];
//     const farmerIds: string[] = [];

//     // Collect unique IDs
//     crops.forEach((crop: any) => {
//       if (crop.trackingId) {
//         trackingIds.push(crop.trackingId.toString());
//       }
//       if (crop.farmerId) {
//         farmerIds.push(crop.farmerId.toString());
//       }
//     });

//     // Remove duplicates
//     const uniqueTrackingIds = [...new Set(trackingIds)];
//     const uniqueFarmerIds = [...new Set(farmerIds)];

//     // Initialize lookup maps
//     const trackingMap: Record<string, any> = {};
//     const farmerMap: Record<string, any> = {};

//     // Batch fetch tracking data
//     if (uniqueTrackingIds.length > 0) {
//       try {
//         // Separate ObjectId and string IDs
//         const objectIdTrackings: any[] = [];
//         const stringTrackings: string[] = [];

//         uniqueTrackingIds.forEach(id => {
//           if (mongoose.Types.ObjectId.isValid(id)) {
//             objectIdTrackings.push(new mongoose.Types.ObjectId(id));
//           } else {
//             stringTrackings.push(id);
//           }
//         });

//         const trackingQueries: any[] = [];
        
//         if (objectIdTrackings.length > 0) {
//           trackingQueries.push({ _id: { $in: objectIdTrackings } });
//         }
        
//         if (stringTrackings.length > 0) {
//           trackingQueries.push({
//             $expr: {
//               $in: [
//                 { $toString: "$_id" },
//                 stringTrackings
//               ]
//             }
//           });
//         }

//         if (trackingQueries.length > 0) {
//           const trackingData = await Tracking.find({
//             $or: trackingQueries
//           }).lean();

//           // Build tracking map
//           trackingData.forEach((tracking: any) => {
//             const id = tracking._id.toString();
//             trackingMap[id] = {
//               ...tracking,
//               progress: calculateProgress(tracking.stages || []),
//               isCompleted: (tracking.stages || []).every((stage: any) => stage?.status === 'completed'),
//               currentStageName: getCurrentStageName(tracking)
//             };
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching tracking data:", error);
//       }
//     }

//     // Batch fetch farmer data
//     if (uniqueFarmerIds.length > 0) {
//       try {
//         // Build queries for different ID types
//         const objectIdFarmers: any[] = [];
//         const stringFarmerIds: string[] = [];

//         uniqueFarmerIds.forEach(id => {
//           if (mongoose.Types.ObjectId.isValid(id)) {
//             objectIdFarmers.push(new mongoose.Types.ObjectId(id));
//           } else {
//             stringFarmerIds.push(id);
//           }
//         });

//         const farmerQueries: any[] = [];
        
//         // Query for ObjectId matches
//         if (objectIdFarmers.length > 0) {
//           farmerQueries.push({ _id: { $in: objectIdFarmers } });
//         }
        
//         // Query for string matches
//         if (stringFarmerIds.length > 0) {
//           // Match by farmerId field
//           farmerQueries.push({ farmerId: { $in: stringFarmerIds } });
//           // Match by traderId field
//           farmerQueries.push({ traderId: { $in: stringFarmerIds } });
//           // Match _id as string
//           farmerQueries.push({
//             $expr: {
//               $in: [
//                 { $toString: "$_id" },
//                 stringFarmerIds
//               ]
//             }
//           });
//         }

//         if (farmerQueries.length > 0) {
//           const farmerFilter: any = {
//             $or: farmerQueries
//           };

//           // Add role filter if specified
//           if (role) {
//             farmerFilter.role = role;
//           }

//           const farmerData = await Farmer.find(farmerFilter).lean();

//           // Build farmer map
//           farmerData.forEach((farmer: any) => {
//             // Map by all possible ID fields
//             if (farmer._id) {
//               farmerMap[farmer._id.toString()] = farmer;
//             }
//             if (farmer.farmerId) {
//               farmerMap[farmer.farmerId] = farmer;
//             }
//             if (farmer.traderId) {
//               farmerMap[farmer.traderId] = farmer;
//             }
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching farmer data:", error);
//       }
//     }

//     // Enrich crops data
//     const enrichedData: any[] = crops.map((crop: any) => {
//       const enriched: any = {
//         ...crop,
//         tracking: null,
//         farmer: null
//       };
      
//       // Add tracking info
//       if (crop.trackingId) {
//         const trackingIdStr = crop.trackingId.toString();
//         enriched.tracking = trackingMap[trackingIdStr] || null;
//       }
      
//       // Add farmer info
//       if (crop.farmerId) {
//         const farmerIdStr = crop.farmerId.toString();
//         enriched.farmer = farmerMap[farmerIdStr] || null;
        
//         // If not found, try ObjectId conversion
//         if (!enriched.farmer && mongoose.Types.ObjectId.isValid(farmerIdStr)) {
//           const objId = new mongoose.Types.ObjectId(farmerIdStr);
//           enriched.farmer = farmerMap[objId.toString()] || null;
//         }
//       }
      
//       return enriched;
//     });

//     // Get statistics
//     const farmerCount = await Farmer.countDocuments({ role: "farmer" });
//     const traderCount = await Farmer.countDocuments({ role: "trader" });

//     // Get all data for reference (limited)
//     const allCrops = await Posting.find({}).lean().limit(50);

//     return NextResponse.json({
//       success: true,
//       page,
//       limit,
//       total,
//       data: enrichedData,
//       allData: allCrops,
//       stats: {
//         totalCrops: total,
//         totalFarmers: farmerCount,
//         totalTraders: traderCount,
//         foundFarmersInBatch: Object.keys(farmerMap).length,
//         foundTrackingInBatch: Object.keys(trackingMap).length,
//         pageCount: Math.ceil(total / limit),
//         currentPage: page
//       },
//       filters: {
//         search,
//         farmingType,
//         seedType,
//         trackingId,
//         farmerId,
//         role
//       }
//     });
//   } catch (error: any) {
//     console.error("Error fetching crops:", error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: "Fetch failed",
//         error: error.message,
//         stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       },
//       { status: 500 }
//     );
//   }
// }


/* ================= GET (LIST with POPULATE) ================= */
// export async function GET(req: NextRequest): Promise<NextResponse> {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);

//     const search = searchParams.get("search") || "";
//     const page = Number(searchParams.get("page")) || 1;
//     const limit = Number(searchParams.get("limit")) || 10;
//     const farmingType = searchParams.get("farmingType") || "";
//     const seedType = searchParams.get("seedType") || "";
//     const trackingId = searchParams.get("trackingId") || "";
//     const farmerId = searchParams.get("farmerId") || "";
//     const role = searchParams.get("role") || "farmer";

//     // Build filter
//     const filter: any = {};
    
//     if (farmingType) filter.farmingType = farmingType;
//     if (seedType) filter.seedType = seedType;
//     if (trackingId) filter.trackingId = trackingId;
//     if (farmerId) filter.farmerId = farmerId;

//     // Get total count
//     const total = await Posting.countDocuments(filter);

//     // Get paginated crops
//     const crops = await Posting.find(filter)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .lean();

//     // Prepare arrays for batch lookups
//     const trackingIds: string[] = [];
//     const farmerIds: string[] = [];

//     // Collect unique IDs
//     crops.forEach((crop: any) => {
//       if (crop.trackingId) {
//         trackingIds.push(crop.trackingId.toString());
//       }
//       if (crop.farmerId) {
//         farmerIds.push(crop.farmerId.toString());
//       }
//     });

//     // Remove duplicates
//     const uniqueTrackingIds = [...new Set(trackingIds)];
//     const uniqueFarmerIds = [...new Set(farmerIds)];

//     // Initialize lookup maps
//     const trackingMap: Record<string, any> = {};
//     const farmerMap: Record<string, any> = {};

//     // Batch fetch tracking data
//     if (uniqueTrackingIds.length > 0) {
//       try {
//         // Separate ObjectId and string IDs
//         const objectIdTrackings: any[] = [];
//         const stringTrackings: string[] = [];

//         uniqueTrackingIds.forEach(id => {
//           if (mongoose.Types.ObjectId.isValid(id)) {
//             objectIdTrackings.push(new mongoose.Types.ObjectId(id));
//           } else {
//             stringTrackings.push(id);
//           }
//         });

//         const trackingQueries: any[] = [];
        
//         if (objectIdTrackings.length > 0) {
//           trackingQueries.push({ _id: { $in: objectIdTrackings } });
//         }
        
//         if (stringTrackings.length > 0) {
//           trackingQueries.push({
//             $expr: {
//               $in: [
//                 { $toString: "$_id" },
//                 stringTrackings
//               ]
//             }
//           });
//         }

//         if (trackingQueries.length > 0) {
//           const trackingData = await Tracking.find({
//             $or: trackingQueries
//           }).lean();

//           // Build tracking map
//           trackingData.forEach((tracking: any) => {
//             const id = tracking._id.toString();
//             trackingMap[id] = {
//               ...tracking,
//               progress: calculateProgress(tracking.stages || []),
//               isCompleted: (tracking.stages || []).every((stage: any) => stage?.status === 'completed'),
//               currentStageName: getCurrentStageName(tracking)
//             };
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching tracking data:", error);
//       }
//     }

//     // Batch fetch farmer data
//     if (uniqueFarmerIds.length > 0) {
//       try {
//         // Build queries for different ID types
//         const objectIdFarmers: any[] = [];
//         const stringFarmerIds: string[] = [];

//         uniqueFarmerIds.forEach(id => {
//           if (mongoose.Types.ObjectId.isValid(id)) {
//             objectIdFarmers.push(new mongoose.Types.ObjectId(id));
//           } else {
//             stringFarmerIds.push(id);
//           }
//         });

//         const farmerQueries: any[] = [];
        
//         // Query for ObjectId matches
//         if (objectIdFarmers.length > 0) {
//           farmerQueries.push({ _id: { $in: objectIdFarmers } });
//         }
        
//         // Query for string matches
//         if (stringFarmerIds.length > 0) {
//           // Match by farmerId field
//           farmerQueries.push({ farmerId: { $in: stringFarmerIds } });
//           // Match by traderId field
//           farmerQueries.push({ traderId: { $in: stringFarmerIds } });
//           // Match _id as string
//           farmerQueries.push({
//             $expr: {
//               $in: [
//                 { $toString: "$_id" },
//                 stringFarmerIds
//               ]
//             }
//           });
//         }

//         if (farmerQueries.length > 0) {
//           const farmerFilter: any = {
//             $or: farmerQueries
//           };

//           // Add role filter if specified
//           if (role) {
//             farmerFilter.role = role;
//           }

//           const farmerData = await Farmer.find(farmerFilter).lean();

//           // Build farmer map
//           farmerData.forEach((farmer: any) => {
//             // Map by all possible ID fields
//             if (farmer._id) {
//               farmerMap[farmer._id.toString()] = farmer;
//             }
//             if (farmer.farmerId) {
//               farmerMap[farmer.farmerId] = farmer;
//             }
//             if (farmer.traderId) {
//               farmerMap[farmer.traderId] = farmer;
//             }
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching farmer data:", error);
//       }
//     }

//     // Enrich crops data
//     const enrichedData: any[] = crops.map((crop: any) => {
//       const enriched: any = {
//         ...crop,
//         tracking: null,
//         farmer: null
//       };
      
//       // Add tracking info
//       if (crop.trackingId) {
//         const trackingIdStr = crop.trackingId.toString();
//         enriched.tracking = trackingMap[trackingIdStr] || null;
//       }
      
//       // Add farmer info
//       if (crop.farmerId) {
//         const farmerIdStr = crop.farmerId.toString();
//         enriched.farmer = farmerMap[farmerIdStr] || null;
        
//         // If not found, try ObjectId conversion
//         if (!enriched.farmer && mongoose.Types.ObjectId.isValid(farmerIdStr)) {
//           const objId = new mongoose.Types.ObjectId(farmerIdStr);
//           enriched.farmer = farmerMap[objId.toString()] || null;
//         }
//       }
      
//       return enriched;
//     });

//     // Filter by search term across all fields including farmer info
//     let filteredData = enrichedData;
//     if (search) {
//       const searchLower = search.toLowerCase();
//       filteredData = enrichedData.filter((crop) => {
//         // Search in crop fields
//         const cropFields = [
//           crop.farmingType?.toLowerCase() || '',
//           crop.seedType?.toLowerCase() || '',
//           crop.farmerId?.toLowerCase() || '',
//           crop.trackingId?.toLowerCase() || '',
//         ];

//         // Search in tracking fields
//         const trackingFields = [
//           crop.tracking?.name?.toLowerCase() || '',
//           crop.tracking?.cropName?.toLowerCase() || '',
//         ];

//         // Search in farmer fields if farmer exists
//         // FIX: Explicitly type the farmerFields array
//         let farmerFields: string[] = [];
//         if (crop.farmer) {
//           farmerFields = [
//             crop.farmer.personalInfo?.name?.toLowerCase() || '',
//             crop.farmer.personalInfo?.mobileNo?.toLowerCase() || '',
//             crop.farmer.personalInfo?.email?.toLowerCase() || '',
//             crop.farmer.personalInfo?.address?.toLowerCase() || '',
//             crop.farmer.personalInfo?.villageGramaPanchayat?.toLowerCase() || '',
//             crop.farmer.personalInfo?.state?.toLowerCase() || '',
//             crop.farmer.personalInfo?.district?.toLowerCase() || '',
//             crop.farmer.personalInfo?.taluk?.toLowerCase() || '',
//             crop.farmer.personalInfo?.post?.toLowerCase() || '',
//             crop.farmer.farmerId?.toLowerCase() || '',
//             crop.farmer.traderId?.toLowerCase() || '',
//           ];
//         }

//         // Combine all searchable fields
//         const allSearchableFields = [...cropFields, ...trackingFields, ...farmerFields];
        
//         // Check if search term exists in any field
//         return allSearchableFields.some(field => field.includes(searchLower));
//       });
//     }

//     // Get statistics
//     const farmerCount = await Farmer.countDocuments({ role: "farmer" });
//     const traderCount = await Farmer.countDocuments({ role: "trader" });

//     // Get all data for reference (limited)
//     const allCrops = await Posting.find(filter).lean().limit(50);
    
//     // Enrich all crops data for filters/stats
//     const enrichedAllCrops = allCrops.map((crop: any) => {
//       const enriched: any = {
//         ...crop,
//         tracking: null,
//         farmer: null
//       };
      
//       // Add tracking info
//       if (crop.trackingId) {
//         const trackingIdStr = crop.trackingId.toString();
//         enriched.tracking = trackingMap[trackingIdStr] || null;
//       }
      
//       // Add farmer info
//       if (crop.farmerId) {
//         const farmerIdStr = crop.farmerId.toString();
//         enriched.farmer = farmerMap[farmerIdStr] || null;
        
//         if (!enriched.farmer && mongoose.Types.ObjectId.isValid(farmerIdStr)) {
//           const objId = new mongoose.Types.ObjectId(farmerIdStr);
//           enriched.farmer = farmerMap[objId.toString()] || null;
//         }
//       }
      
//       return enriched;
//     });

//     // Apply search filter to all crops for stats
//     let filteredAllCrops = enrichedAllCrops;
//     if (search) {
//       const searchLower = search.toLowerCase();
//       filteredAllCrops = enrichedAllCrops.filter((crop) => {
//         const cropFields = [
//           crop.farmingType?.toLowerCase() || '',
//           crop.seedType?.toLowerCase() || '',
//           crop.farmerId?.toLowerCase() || '',
//           crop.trackingId?.toLowerCase() || '',
//         ];

//         const trackingFields = [
//           crop.tracking?.name?.toLowerCase() || '',
//           crop.tracking?.cropName?.toLowerCase() || '',
//         ];

//         // FIX: Explicitly type the farmerFields array here too
//         let farmerFields: string[] = [];
//         if (crop.farmer) {
//           farmerFields = [
//             crop.farmer.personalInfo?.name?.toLowerCase() || '',
//             crop.farmer.personalInfo?.mobileNo?.toLowerCase() || '',
//             crop.farmer.personalInfo?.email?.toLowerCase() || '',
//             crop.farmer.personalInfo?.address?.toLowerCase() || '',
//             crop.farmer.personalInfo?.villageGramaPanchayat?.toLowerCase() || '',
//             crop.farmer.personalInfo?.state?.toLowerCase() || '',
//             crop.farmer.personalInfo?.district?.toLowerCase() || '',
//             crop.farmer.personalInfo?.taluk?.toLowerCase() || '',
//             crop.farmer.personalInfo?.post?.toLowerCase() || '',
//             crop.farmer.farmerId?.toLowerCase() || '',
//             crop.farmer.traderId?.toLowerCase() || '',
//           ];
//         }

//         const allSearchableFields = [...cropFields, ...trackingFields, ...farmerFields];
//         return allSearchableFields.some(field => field.includes(searchLower));
//       });
//     }

//     // Get unique farming types and seed types from filtered data
//     const uniqueFarmingTypes = [...new Set(filteredAllCrops.map(crop => crop.farmingType).filter(Boolean))];
//     const uniqueSeedTypes = [...new Set(filteredAllCrops.map(crop => crop.seedType).filter(Boolean))];

//     return NextResponse.json({
//       success: true,
//       page,
//       limit,
//       total: filteredData.length, // Return filtered count
//       data: filteredData,
//       allData: filteredAllCrops,
//       filters: {
//         farmingTypes: uniqueFarmingTypes,
//         seedTypes: uniqueSeedTypes,
//       },
//       stats: {
//         totalCrops: filteredData.length,
//         totalFarmers: farmerCount,
//         totalTraders: traderCount,
//         foundFarmersInBatch: Object.keys(farmerMap).length,
//         foundTrackingInBatch: Object.keys(trackingMap).length,
//         pageCount: Math.ceil(filteredData.length / limit),
//         currentPage: page,
//         searchApplied: !!search,
//       }
//     });
//   } catch (error: any) {
//     console.error("Error fetching crops:", error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: "Fetch failed",
//         error: error.message,
//         stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       },
//       { status: 500 }
//     );
//   }
// }




// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
    
//     // Get pagination parameters
//     const page = Number(searchParams.get("page")) || 1;
//     const limit = Number(searchParams.get("limit")) || 10;
//     const search = searchParams.get("search") || "";
//     const farmingType = searchParams.get("farmingType") || "";
//     const seedType = searchParams.get("seedType") || "";
//     const farmerId = searchParams.get("farmerId") || "";

//     // Build filter
//     const filter: any = {};

//     if (search) {
//       filter.$or = [
//         { farmingType: { $regex: search, $options: "i" } },
//         { seedType: { $regex: search, $options: "i" } },
//         { farmerId: { $regex: search, $options: "i" } },
//         { trackingId: { $regex: search, $options: "i" } },
//       ];
//     }

//     if (farmingType) filter.farmingType = farmingType;
//     if (seedType) filter.seedType = seedType;
//     if (farmerId) filter.farmerId = farmerId;

//     // Get ALL crops (for filters and stats)
//     const allCrops = await Posting.find(filter).lean();
//     const filteredData = allCrops; // Since we already applied filter

//     // Get paginated crops
//     const paginatedCrops = filteredData
//       .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//       .slice((page - 1) * limit, page * limit);

//     console.log(`Found ${filteredData.length} total crops, showing ${paginatedCrops.length} on page ${page}`);

//     // If no crops found, return empty array with proper structure
//     if (paginatedCrops.length === 0) {
//       return NextResponse.json({
//         success: true,
//         page,
//         limit,
//         total: 0,
//         data: [],
//         allData: [],
//         filters: {
//           farmingTypes: [],
//           seedTypes: [],
//         },
//         stats: {
//           totalCrops: 0,
//           totalFarmers: 0,
//           totalTraders: 0,
//           foundFarmersInBatch: 0,
//           foundTrackingInBatch: 0,
//           pageCount: 0,
//           currentPage: page,
//           searchApplied: !!search,
//         }
//       });
//     }

//     // Get unique farmer IDs from paginated crops
//     const farmerIds = [...new Set(paginatedCrops.map((crop: any) => crop.farmerId).filter(Boolean))];

//     // Get all farmers in one query
//     const farmers = await Farmer.find({ farmerId: { $in: farmerIds } }).lean();
    
//     // Create farmer map for easy lookup
//     const farmerMap: { [key: string]: any } = {};
//     farmers.forEach(farmer => {
//       farmerMap[farmer.farmerId] = farmer;
//     });

//     // Get unique tracking IDs from paginated crops
//     const trackingIds = [...new Set(paginatedCrops.map((crop: any) => crop.trackingId).filter(Boolean))];

//     // Get all trackings in one query
//     let trackings: any[] = [];
//     if (trackingIds.length > 0) {
//       trackings = await Tracking.find({ _id: { $in: trackingIds } }).lean();
//     }
    
//     // Create tracking map for easy lookup
//     const trackingMap: { [key: string]: any } = {};
//     trackings.forEach(tracking => {
//       trackingMap[tracking._id.toString()] = tracking;
//     });

//     // Get stats for all filtered data
//     const uniqueFarmersInAllData = [...new Set(filteredData.map((crop: any) => crop.farmerId).filter(Boolean))];
//     const allFarmersCount = await Farmer.countDocuments({ farmerId: { $in: uniqueFarmersInAllData } });
    
//     // Count farmers vs traders
//     const allFarmers = await Farmer.find({ farmerId: { $in: uniqueFarmersInAllData } }).lean();
//     const farmerCount = allFarmers.filter(f => f.role === 'farmer').length;
//     const traderCount = allFarmers.filter(f => f.role === 'trader').length;

//     // Get unique farming types and seed types for filters
//     const uniqueFarmingTypes = [...new Set(filteredData.map((crop: any) => crop.farmingType).filter(Boolean))];
//     const uniqueSeedTypes = [...new Set(filteredData.map((crop: any) => crop.seedType).filter(Boolean))];

//     // Combine paginated crops with farmer and tracking details
//     const cropsWithDetails = paginatedCrops.map((crop: any) => {
//       const farmer = farmerMap[crop.farmerId] || null;
//       const tracking = crop.trackingId ? trackingMap[crop.trackingId] || null : null;
      
//       return {
//         ...crop,
//         farmer: farmer ? {
//           _id: farmer._id,
//           personalInfo: farmer.personalInfo,
//           role: farmer.role,
//           farmerId: farmer.farmerId,
//           commodities: farmer.commodities,
//           subcategories: farmer.subcategories,
//           bankDetails: farmer.bankDetails,
//           farmLocation: farmer.farmLocation
//         } : null,
//         tracking: tracking ? {
//           _id: tracking._id,
//           name: tracking.name,
//           cropName: tracking.cropName,
//           stages: tracking.stages,
//           currentStageIndex: tracking.currentStageIndex,
//           progress: tracking.stages ? 
//             Math.round((tracking.stages.filter((s: any) => s.status === 'completed').length / tracking.stages.length) * 100) : 0,
//           isCompleted: tracking.stages ? tracking.stages.every((s: any) => s.status === 'completed') : false
//         } : null
//       };
//     });

//     // Create allData with basic information (without details for performance)
//     const filteredAllCrops = filteredData.map((crop: any) => ({
//       _id: crop._id,
//       farmingType: crop.farmingType,
//       seedType: crop.seedType,
//       acres: crop.acres,
//       sowingDate: crop.sowingDate,
//       farmerId: crop.farmerId,
//       trackingId: crop.trackingId,
//       createdAt: crop.createdAt
//     }));

//     return NextResponse.json({
//       success: true,
//       page,
//       limit,
//       total: filteredData.length, // Return filtered count
//       data: cropsWithDetails,
//       allData: filteredAllCrops,
//       filters: {
//         farmingTypes: uniqueFarmingTypes,
//         seedTypes: uniqueSeedTypes,
//       },
//       stats: {
//         totalCrops: filteredData.length,
//         totalFarmers: farmerCount,
//         totalTraders: traderCount,
//         foundFarmersInBatch: Object.keys(farmerMap).length,
//         foundTrackingInBatch: Object.keys(trackingMap).length,
//         pageCount: Math.ceil(filteredData.length / limit),
//         currentPage: page,
//         searchApplied: !!search,
//       }
//     });
//   } catch (error: any) {
//     console.error("Error fetching crops with details:", error);
    
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: "Failed to fetch crops",
//         error: process.env.NODE_ENV === 'development' ? error.message : undefined
//       },
//       { status: 500 }
//     );
//   }
// }





export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    
    // Get pagination and sorting parameters
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const farmingType = searchParams.get("farmingType") || "";
    const seedType = searchParams.get("seedType") || "";
    const farmerId = searchParams.get("farmerId") || "";
    const registrationStatus = searchParams.get("registrationStatus") || ""; // NEW: Filter by registration status
    
    // Sorting parameters
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    
    // Validate sort parameters
    const validSortFields = ["createdAt", "updatedAt", "sowingDate", "acres", "farmingType", "seedType"];
    const validSortOrders = ["asc", "desc"];
    
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const finalSortOrder = validSortOrders.includes(sortOrder) ? sortOrder : "desc";
    const sortDirection = finalSortOrder === "desc" ? -1 : 1;

    // Start building the main filter
    const mainFilter: any = {};
    
    // Apply basic filters if provided
    if (farmingType) mainFilter.farmingType = farmingType;
    if (seedType) mainFilter.seedType = seedType;
    if (farmerId) mainFilter.farmerId = farmerId;

    let searchApplied = false;
    let searchFilter: any = {};

    // If search parameter is provided
    if (search && search.trim() !== "") {
      searchApplied = true;
      const searchTerm = search.trim();
      
      console.log(`Searching for: "${searchTerm}" with filters: farmingType=${farmingType}, seedType=${seedType}`);
      
      // Search in CROPS collection - but respect farmingType and seedType filters
      const cropSearchConditions: any[] = [
        { farmingType: { $regex: searchTerm, $options: "i" } },
        { seedType: { $regex: searchTerm, $options: "i" } },
        { farmerId: { $regex: searchTerm, $options: "i" } },
        { trackingId: { $regex: searchTerm, $options: "i" } },
      ];
      
      // Add numeric search for acres if search term is numeric
      if (!isNaN(Number(searchTerm))) {
        cropSearchConditions.push({ 
          $expr: { $regexMatch: { input: { $toString: "$acres" }, regex: searchTerm } } 
        });
      }
      
      // Build crop search filter WITH farmingType and seedType filters
      const cropSearchFilter: any = { $and: [] };
      
      if (farmingType) {
        cropSearchFilter.$and.push({ farmingType: farmingType });
      }
      if (seedType) {
        cropSearchFilter.$and.push({ seedType: seedType });
      }
      
      cropSearchFilter.$and.push({ $or: cropSearchConditions });
      
      const cropSearchResults = await Posting.find(cropSearchFilter).select('_id').lean();
      const cropIdsFromSearch = cropSearchResults.map(crop => crop._id.toString());
      const farmerIdsFromCrops = [...new Set(cropSearchResults.map(crop => crop.farmerId).filter(Boolean))];
      
      // Search in FARMERS collection - INCLUDING registrationStatus
      const farmerSearchConditions: any[] = [
        { farmerId: { $regex: searchTerm, $options: "i" } },
        { traderId: { $regex: searchTerm, $options: "i" } },
        { "personalInfo.name": { $regex: searchTerm, $options: "i" } },
        { "personalInfo.mobileNo": { $regex: searchTerm, $options: "i" } },
        { "personalInfo.email": { $regex: searchTerm, $options: "i" } },
        { "personalInfo.address": { $regex: searchTerm, $options: "i" } },
        { "personalInfo.villageGramaPanchayat": { $regex: searchTerm, $options: "i" } },
        { "personalInfo.pincode": { $regex: searchTerm, $options: "i" } },
        { "personalInfo.state": { $regex: searchTerm, $options: "i" } },
        { "personalInfo.district": { $regex: searchTerm, $options: "i" } },
        { "personalInfo.taluk": { $regex: searchTerm, $options: "i" } },
        { "personalInfo.post": { $regex: searchTerm, $options: "i" } },
        { "farmLocation.latitude": { $regex: searchTerm, $options: "i" } },
        { "farmLocation.longitude": { $regex: searchTerm, $options: "i" } },
        { "bankDetails.accountHolderName": { $regex: searchTerm, $options: "i" } },
        { "bankDetails.accountNumber": { $regex: searchTerm, $options: "i" } },
        { "bankDetails.ifscCode": { $regex: searchTerm, $options: "i" } },
        { "bankDetails.branch": { $regex: searchTerm, $options: "i" } },
        { registrationStatus: { $regex: searchTerm, $options: "i" } } // ADDED: Search in registrationStatus
      ];

      const farmerSearchFilter: any = {};
      if (registrationStatus) {
        farmerSearchFilter.registrationStatus = registrationStatus;
      }
      farmerSearchFilter.$or = farmerSearchConditions;

      const farmerSearchResults = await Farmer.find(farmerSearchFilter).select('farmerId').lean();
      const farmerIdsFromSearch = farmerSearchResults.map(f => f.farmerId).filter(Boolean);
      
      // Search in TRACKING collection
      const trackingSearchResults = await Tracking.find({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { cropName: { $regex: searchTerm, $options: "i" } },
          { farmerId: { $regex: searchTerm, $options: "i" } },
          { "stages.name": { $regex: searchTerm, $options: "i" } }
        ]
      }).select('cropId farmerId').lean();

      const cropIdsFromTracking = trackingSearchResults.map(t => t.cropId?.toString()).filter(Boolean);
      const farmerIdsFromTracking = [...new Set(trackingSearchResults.map(t => t.farmerId).filter(Boolean))];

      // Combine all search results
      const allFarmerIds = [...new Set([
        ...farmerIdsFromCrops,
        ...farmerIdsFromSearch,
        ...farmerIdsFromTracking
      ])];

      const allCropIds = [...new Set([
        ...cropIdsFromSearch,
        ...cropIdsFromTracking
      ])];

      console.log(`Search results: ${allCropIds.length} crops, ${allFarmerIds.length} farmers`);

      // Build the final search filter that combines all filters
      if (allFarmerIds.length > 0 || allCropIds.length > 0) {
        const searchConditions: any[] = [];
        
        if (allFarmerIds.length > 0) {
          searchConditions.push({ farmerId: { $in: allFarmerIds } });
        }
        
        if (allCropIds.length > 0) {
          searchConditions.push({ _id: { $in: allCropIds } });
        }
        
        // Start with basic filters
        const combinedFilter: any = {};
        
        // Always apply basic filters if provided
        if (farmingType) combinedFilter.farmingType = farmingType;
        if (seedType) combinedFilter.seedType = seedType;
        if (farmerId) combinedFilter.farmerId = farmerId;
        
        // Add search conditions
        if (searchConditions.length > 0) {
          combinedFilter.$or = searchConditions;
        }
        
        searchFilter = combinedFilter;
      } else {
        // No search results found, but still apply basic filters
        const noResultsFilter: any = {};
        if (farmingType) noResultsFilter.farmingType = farmingType;
        if (seedType) noResultsFilter.seedType = seedType;
        if (farmerId) noResultsFilter.farmerId = farmerId;
        
        // Add a condition that will never match to return empty results
        noResultsFilter._id = { $in: [] };
        searchFilter = noResultsFilter;
      }
    } else {
      // No search, just use the main filter with basic filters
      searchFilter = mainFilter;
    }

    // Step 2: Get total count and paginated crops WITH PROPER SORTING
    const total = await Posting.countDocuments(searchFilter);

    if (total === 0) {
      return NextResponse.json({
        success: true,
        page,
        limit,
        total: 0,
        data: [],
        allData: [],
        filters: {
          farmingTypes: [],
          seedTypes: [],
        },
        stats: {
          totalCrops: 0,
          totalFarmers: 0,
          totalTraders: 0,
          foundFarmersInBatch: 0,
          foundTrackingInBatch: 0,
          pageCount: 0,
          currentPage: page,
          searchApplied,
          searchTerm: search,
          appliedFilters: {
            farmingType,
            seedType,
            farmerId,
            registrationStatus
          }
        }
      });
    }

    const pageCount = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    // Get paginated crops WITH SORTING
    const paginatedCrops = await Posting.find(searchFilter)
      .sort({ [finalSortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log(`Showing ${paginatedCrops.length} of ${total} filtered crops, sorted by ${finalSortBy} ${finalSortOrder}`);

    // Step 3: Get farmer details for paginated crops - INCLUDING registrationStatus
    const paginatedFarmerIds = [...new Set(paginatedCrops.map(crop => crop.farmerId).filter(Boolean))];
    
    const farmerFilter: any = { farmerId: { $in: paginatedFarmerIds } };
    if (registrationStatus) {
      farmerFilter.registrationStatus = registrationStatus;
    }
    
    const farmers = await Farmer.find(farmerFilter).lean();
    
    // Create farmer map for easy lookup
    const farmerMap: { [key: string]: any } = {};
    farmers.forEach(farmer => {
      farmerMap[farmer.farmerId] = farmer;
    });

    // Step 4: Get tracking details for paginated crops - INCLUDING createdAt
    const paginatedTrackingIds = [...new Set(paginatedCrops.map(crop => crop.trackingId).filter(Boolean))];
    
    let trackings: any[] = [];
    if (paginatedTrackingIds.length > 0) {
      trackings = await Tracking.find({ _id: { $in: paginatedTrackingIds } })
        .select('_id name cropName stages currentStageIndex createdAt') // ADDED: createdAt
        .lean();
    }
    
    // Create tracking map for easy lookup
    const trackingMap: { [key: string]: any } = {};
    trackings.forEach(tracking => {
      trackingMap[tracking._id.toString()] = tracking;
    });

    // Step 5: Get stats for all filtered data
    const allFilteredFarmerIds = [...new Set(
      (await Posting.find(searchFilter).select('farmerId').lean())
        .map(crop => crop.farmerId)
        .filter(Boolean)
    )];
    
    const allFarmerFilter: any = { farmerId: { $in: allFilteredFarmerIds } };
    if (registrationStatus) {
      allFarmerFilter.registrationStatus = registrationStatus;
    }
    
    const allFilteredFarmers = await Farmer.find(allFarmerFilter).lean();
    const farmerCount = allFilteredFarmers.filter(f => f.role === 'farmer').length;
    const traderCount = allFilteredFarmers.filter(f => f.role === 'trader').length;

    // Get unique farming types and seed types for filters
    const allFilteredCrops = await Posting.find(searchFilter).select('farmingType seedType').lean();
    const uniqueFarmingTypes = [...new Set(allFilteredCrops.map(crop => crop.farmingType).filter(Boolean))];
    const uniqueSeedTypes = [...new Set(allFilteredCrops.map(crop => crop.seedType).filter(Boolean))];

    // Step 6: Combine paginated crops with farmer and tracking details
    const cropsWithDetails = paginatedCrops.map(crop => {
      const farmer = farmerMap[crop.farmerId] || null;
      const tracking = crop.trackingId ? trackingMap[crop.trackingId] || null : null;
      
      return {
        ...crop,
        farmer: farmer ? {
          _id: farmer._id,
          farmerId: farmer.farmerId,
          personalInfo: farmer.personalInfo,
          role: farmer.role,
          registrationStatus: farmer.registrationStatus, // ADDED: registrationStatus
          commodities: farmer.commodities,
          subcategories: farmer.subcategories,
          bankDetails: farmer.bankDetails,
          farmLocation: farmer.farmLocation,
          isActive: farmer.isActive,
          registeredAt: farmer.registeredAt
        } : null,
        tracking: tracking ? {
          _id: tracking._id,
          name: tracking.name,
          cropName: tracking.cropName,
          stages: tracking.stages,
          currentStageIndex: tracking.currentStageIndex,
          createdAt: tracking.createdAt, // ADDED: createdAt
          updatedAt: tracking.updatedAt, // Also include updatedAt if available
          progress: tracking.stages ? 
            Math.round((tracking.stages.filter((s: any) => s.status === 'completed').length / tracking.stages.length) * 100) : 0,
          isCompleted: tracking.stages ? tracking.stages.every((s: any) => s.status === 'completed') : false
        } : null
      };
    });

    // Step 7: Create allData with basic information (sorted)
    const filteredAllCrops = await Posting.find(searchFilter)
      .select('_id farmingType seedType acres sowingDate farmerId trackingId createdAt')
      .sort({ [finalSortBy]: sortDirection })
      .lean();

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      data: cropsWithDetails,
      allData: filteredAllCrops,
      filters: {
        farmingTypes: uniqueFarmingTypes,
        seedTypes: uniqueSeedTypes,
      },
      sorting: {
        sortBy: finalSortBy,
        sortOrder: finalSortOrder
      },
      stats: {
        totalCrops: total,
        totalFarmers: farmerCount,
        totalTraders: traderCount,
        foundFarmersInBatch: Object.keys(farmerMap).length,
        foundTrackingInBatch: Object.keys(trackingMap).length,
        pageCount,
        currentPage: page,
        searchApplied,
        searchTerm: search,
        appliedFilters: {
          farmingType,
          seedType,
          farmerId,
          registrationStatus
        }
      }
    });
  } catch (error: any) {
    console.error("Error fetching crops with enhanced search:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch crops",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}