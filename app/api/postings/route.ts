// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Posting from "@/app/models/Posting";

// /* ================= CREATE ================= */
// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const body = await req.json();

//     const crop = await Posting.create(body);

//     return NextResponse.json({ success: true, data: crop });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { success: false, message: "Create failed" },
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

//     // Add seed type filter if provided
//     if (seedType) {
//       filter.seedType = seedType;
//     }

//     const total = await Posting.countDocuments(filter);

//     const data = await Posting.find(filter)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     return NextResponse.json({
//       success: true,
//       page,
//       limit,
//       total,
//       data,
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


// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const body = await req.json();

//     // Validate required fields
//     const { farmingType, seedType, acres, sowingDate, farmerId } = body;
    
//     if (!farmingType || !seedType || !acres || !sowingDate || !farmerId) {
//       return NextResponse.json(
//         { success: false, message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // Start a transaction to ensure both crop and tracking are created
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       // 1. Create the crop/posting
//       const crop = await Posting.create([{
//         farmingType,
//         seedType,
//         acres: Number(acres),
//         sowingDate: new Date(sowingDate),
//         farmerId,
//       }], { session });

//       const createdCrop = crop[0];

//       // 2. Generate a unique tracking name
//       // Add timestamp to make it unique
//       const timestamp = Date.now();
//       const trackingName = `${seedType} Tracking (${farmingType}) - ${timestamp}`;
      
//       // Or if you want more readable names, use incremental numbers
//       // Count existing trackings for this farmer to create a sequence
//       const existingTrackingsCount = await Tracking.countDocuments({ 
//         farmerId,
//         seedType,
//         farmingType 
//       }).session(session);
      
//       const trackingNameWithSequence = `${seedType} Tracking (${farmingType}) #${existingTrackingsCount + 1}`;

//       // 3. Create the tracking with 7 default stages
//       const tracking = await Tracking.create([{
//         name: trackingNameWithSequence, // Use unique name
//         cropName: seedType,
//         farmerId,
//         cropId: createdCrop._id,
//         stages: DEFAULT_STAGES,
//         currentStageIndex: 0,
//       }], { session });

//       const createdTracking = tracking[0];

//       // 4. Update the crop with trackingId
//       createdCrop.trackingId = createdTracking._id;
//       await createdCrop.save({ session });

//       // Commit the transaction
//       await session.commitTransaction();
//       session.endSession();

//       // Populate the crop with tracking data
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
    
//     // Handle specific error cases
//     let errorMessage = "Create failed";
//     let statusCode = 500;

//     if (error.name === 'ValidationError') {
//       errorMessage = Object.values(error.errors).map((err: any) => err.message).join(', ');
//       statusCode = 400;
//     } else if (error.code === 11000) {
//       if (error.keyPattern?.name) {
//         errorMessage = "Tracking name already exists. Please try again with different seed type or farming type.";
//       } else {
//         errorMessage = "Duplicate entry found";
//       }
//       statusCode = 409;
//     } else if (error.message?.includes("required")) {
//       errorMessage = error.message;
//       statusCode = 400;
//     }

//     return NextResponse.json(
//       { success: false, message: errorMessage },
//       { status: statusCode }
//     );
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const body = await req.json();

//     // Validate required fields
//     const { farmingType, seedType, acres, sowingDate, farmerId } = body;
    
//     if (!farmingType || !seedType || !acres || !sowingDate || !farmerId) {
//       return NextResponse.json(
//         { success: false, message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // Convert farmerId to ObjectId if it's a string
//     const farmerObjectId = mongoose.Types.ObjectId.isValid(farmerId) 
//       ? new mongoose.Types.ObjectId(farmerId)
//       : farmerId;

//     // Check if this crop already exists for this farmer (pre-emptive check)
//     const existingCrop = await Posting.findOne({
//       farmerId: farmerObjectId,
//       seedType: seedType.toLowerCase(),
//       farmingType: farmingType.toLowerCase()
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

//     // Start a transaction to ensure both crop and tracking are created
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       // 1. Create the crop
//       const crop = await Posting.create([{
//         farmingType: farmingType.toLowerCase(),
//         seedType: seedType.toLowerCase(),
//         acres: Number(acres),
//         sowingDate: new Date(sowingDate),
//         farmerId: farmerObjectId,
//       }], { session });

//       const createdCrop = crop[0];

//       // 2. Generate a unique tracking name
//       // Get farmer's existing trackings count
//       const existingTrackings = await Tracking.find({ 
//         farmerId: farmerObjectId 
//       }).session(session);
      
//       // Count how many trackings of this seed type the farmer already has
//       const sameSeedTypeCount = existingTrackings.filter(
//         t => t.cropName?.toLowerCase() === seedType.toLowerCase()
//       ).length;
      
//       // Create a readable but unique tracking name
//       const trackingName = `${seedType} ${farmingType} #${sameSeedTypeCount + 1}`;

//       // 3. Create the tracking
//       const tracking = await Tracking.create([{
//         name: trackingName,
//         cropName: seedType,
//         farmerId: farmerObjectId,
//         cropId: createdCrop._id,
//         stages: DEFAULT_STAGES,
//         currentStageIndex: 0,
//       }], { session });

//       const createdTracking = tracking[0];

//       // 4. Update the crop with trackingId
//       createdCrop.trackingId = createdTracking._id;
//       await createdCrop.save({ session });

//       // Commit the transaction
//       await session.commitTransaction();
//       session.endSession();

//       // Populate the crop with tracking data
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
      
//       // Handle specific MongoDB duplicate key error
//       if (error.code === 11000) {
//         const field = Object.keys(error.keyPattern || {})[0];
        
//         if (field === 'unique_crop_per_farmer') {
//           return NextResponse.json(
//             { 
//               success: false, 
//               message: `This farmer already has a ${seedType} crop with ${farmingType} farming type.`
//             },
//             { status: 409 }
//           );
//         } else if (error.keyPattern?.name) {
//           // Tracking name duplicate - retry with different name
//           return NextResponse.json(
//             { 
//               success: false, 
//               message: "Please try again. System will generate a unique tracking name."
//             },
//             { status: 409 }
//           );
//         }
//       }
      
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
//       errorMessage = "Duplicate entry detected. Please use different seed type or farming type.";
//       statusCode = 409;
//     } else if (error.message?.includes("required") || error.message?.includes("must")) {
//       errorMessage = error.message;
//       statusCode = 400;
//     }

//     return NextResponse.json(
//       { success: false, message: errorMessage },
//       { status: statusCode }
//     );
//   }
// }


// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const body = await req.json();

//     // Validate required fields
//     const { farmingType, seedType, acres, sowingDate, farmerId } = body;
    
//     if (!farmingType || !seedType || !acres || !sowingDate || !farmerId) {
//       return NextResponse.json(
//         { success: false, message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // Normalize inputs
//     const normalizedFarmingType = farmingType.toLowerCase().trim();
//     const normalizedSeedType = seedType.toLowerCase().trim();

//     // Convert farmerId to ObjectId if it's a valid ObjectId string
//     let farmerObjectId;
//     try {
//       // Check if it's a valid 24-character hex string (ObjectId)
//       if (/^[0-9a-fA-F]{24}$/.test(farmerId)) {
//         farmerObjectId = new mongoose.Types.ObjectId(farmerId);
//       } else {
//         // If it's not an ObjectId, keep it as string (adjust based on your needs)
//         farmerObjectId = farmerId;
//       }
//     } catch (error) {
//       return NextResponse.json(
//         { success: false, message: "Invalid Farmer ID format" },
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
//         acres: Number(acres),
//         sowingDate: new Date(sowingDate),
//         farmerId: farmerObjectId,
//       }], { session });

//       const createdCrop = crop[0];

//       // 2. Generate unique tracking name
//       // Count existing trackings for this farmer to create sequence
//       const existingTrackingsCount = await Tracking.countDocuments({ 
//         farmerId: farmerObjectId 
//       }).session(session);
      
//       // Simple sequential naming - no need for complex uniqueness
//       const trackingName = `${seedType} ${farmingType} - ${existingTrackingsCount + 1}`;

//       // 3. Create the tracking
//       const tracking = await Tracking.create([{
//         name: trackingName,
//         cropName: normalizedSeedType,
//         farmerId: farmerObjectId.toString(), // Convert to string if needed
//         cropId: createdCrop._id,
//         stages: DEFAULT_STAGES,
//         currentStageIndex: 0,
//       }], { session });

//       const createdTracking = tracking[0];

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
//       throw error; // Let the outer catch handle it
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
//       // Check which unique constraint was violated
//       if (error.keyPattern) {
//         const fields = Object.keys(error.keyPattern);
        
//         if (fields.includes('farmerId') && fields.includes('seedType') && fields.includes('farmingType')) {
//           errorMessage = `You already have a crop with  farming type.`;
//         } else if (fields.includes('name') && error.keyPattern.name === 1) {
//           // This shouldn't happen with your Tracking model, but handle just in case
//           errorMessage = "A tracking with this name already exists. Please try again.";
//         } else {
//           errorMessage = "Duplicate entry detected.";
//         }
//       } else {
//         errorMessage = "Duplicate entry detected.";
//       }
//       statusCode = 409;
//     } else if (error.message?.includes("required") || error.message?.includes("must")) {
//       errorMessage = error.message;
//       statusCode = 400;
//     }

//     return NextResponse.json(
//       { success: false, message: errorMessage },
//       { status: statusCode }
//     );
//   }
// }

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


/* ================= GET (LIST) ================= */
/* ================= GET (LIST with SEARCH) ================= */
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const farmingType = searchParams.get("farmingType") || "";
    const seedType = searchParams.get("seedType") || "";
    const trackingId= searchParams.get("trackingId") || "";
  

    const filter: any = {};

    if (search) {
      filter.$or = [
        { farmingType: { $regex: search, $options: "i" } },
        { seedType: { $regex: search, $options: "i" } },
        { farmerId: { $regex: search, $options: "i" } },
        { trackingId: { $regex: search, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$acres" },
              regex: search,
            },
          },
        },
      ];
    }

    // Add farming type filter if provided
    if (farmingType) {
      filter.farmingType = farmingType;
    }

    if(trackingId){
      filter.trackingId=trackingId;
    }

    // Add seed type filter if provided
    if (seedType) {
      filter.seedType = seedType;
    }

    const total = await Posting.countDocuments(filter);

    const data = await Posting.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

      const data1=await Posting.find({})

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      data,
      data1
    });
  } catch (error) {
    console.error("Error fetching crops:", error);
    return NextResponse.json(
      { success: false, message: "Fetch failed" },
      { status: 500 }
    );
  }
}
