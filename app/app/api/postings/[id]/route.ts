// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Posting from "@/app/models/Posting";

// /* ================= VIEW ================= */
// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   await connectDB();
//   const { id } = await params;

//   const crop = await Posting.findById(id);

//   if (!crop) {
//     return NextResponse.json(
//       { success: false, message: "Not found" },
//       { status: 404 }
//     );
//   }

//   return NextResponse.json({ success: true, data: crop });
// }

// /* ================= UPDATE ================= */
// export async function PUT(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   await connectDB();
//   const body = await req.json();
//   const { id } = await params;

//   const updated = await Posting.findByIdAndUpdate(id, body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!updated) {
//     return NextResponse.json(
//       { success: false, message: "Not found" },
//       { status: 404 }
//     );
//   }

//   return NextResponse.json({ success: true, data: updated });
// }

// /* ================= DELETE ================= */
// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   await connectDB();
//   const { id } = await params;

//   await Posting.findByIdAndDelete(id);

//   return NextResponse.json({ success: true });
// }




import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Posting from "@/app/models/Posting";
import Tracking from "@/app/models/Tracking";
import mongoose from "mongoose";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = await params;

    // Validate required fields
    const { farmingType, seedType, acres, sowingDate, farmerId } = body;
    
    if (!farmingType || !seedType || !acres || !sowingDate || !farmerId) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if crop exists
    const existingCrop = await Posting.findById(id);
    if (!existingCrop) {
      return NextResponse.json(
        { success: false, message: "Crop not found" },
        { status: 404 }
      );
    }

    // Normalize inputs
    const normalizedFarmingType = farmingType.toLowerCase().trim();
    const normalizedSeedType = seedType.toLowerCase().trim();

    // Convert farmerId to ObjectId
    let farmerObjectId;
    try {
      farmerObjectId = mongoose.Types.ObjectId.isValid(farmerId) 
        ? new mongoose.Types.ObjectId(farmerId)
        : farmerId;
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid Farmer ID format" },
        { status: 400 }
      );
    }

    // Check if another crop with same seedType + farmingType already exists for this farmer
    const duplicateCrop = await Posting.findOne({
      _id: { $ne: id }, // Exclude current crop
      farmerId: farmerObjectId,
      seedType: normalizedSeedType,
      farmingType: normalizedFarmingType
    });

    if (duplicateCrop) {
      return NextResponse.json(
        { 
          success: false, 
          message: `You already have another ${seedType} crop with ${farmingType} farming type.`
        },
        { status: 409 }
      );
    }

    // Update the crop
    const updatedCrop = await Posting.findByIdAndUpdate(
      id,
      {
        farmingType: normalizedFarmingType,
        seedType: normalizedSeedType,
        acres: Number(acres),
        sowingDate: new Date(sowingDate),
        farmerId: farmerObjectId,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCrop) {
      return NextResponse.json(
        { success: false, message: "Crop not found" },
        { status: 404 }
      );
    }

    // Update tracking if it exists
    if (updatedCrop.trackingId) {
      try {
        // Generate unique tracking name with timestamp to avoid duplicates
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const trackingName = `${seedType} ${farmingType} - ${timestamp}${randomSuffix}`;
        
        await Tracking.findByIdAndUpdate(
          updatedCrop.trackingId,
          {
            name: trackingName,
            cropName: normalizedSeedType,
            farmerId: farmerObjectId,
          },
          { 
            new: true, 
            runValidators: true 
          }
        );
      } catch (trackingError: any) {
        // If tracking update fails, still return success for crop update
        console.error("Error updating tracking:", trackingError);
        // Continue without throwing - crop was updated successfully
      }
    }

    // Populate tracking data
    const populatedCrop = await Posting.findById(id)
      .populate('tracking')
      .lean();

    return NextResponse.json({
      success: true,
      data: populatedCrop,
      message: "Crop updated successfully",
    });

  } catch (error: any) {
    console.error("Error updating crop:", error);

    let errorMessage = "Update failed";
    let statusCode = 500;

    if (error.name === 'ValidationError') {
      errorMessage = Object.values(error.errors).map((err: any) => err.message).join(', ');
      statusCode = 400;
    } else if (error.code === 11000) {
      errorMessage = "Duplicate tracking name. Please try again.";
      statusCode = 409;
    } else if (error.message?.includes("required")) {
      errorMessage = error.message;
      statusCode = 400;
    } else if (error.name === 'CastError') {
      errorMessage = "Invalid ID format";
      statusCode = 400;
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}

// DELETE method without transactions
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const crop = await Posting.findById(id);
    
    if (!crop) {
      return NextResponse.json(
        { success: false, message: "Crop not found" },
        { status: 404 }
      );
    }

    // Delete tracking first
    if (crop.trackingId) {
      await Tracking.findByIdAndDelete(crop.trackingId);
    }

    // Then delete crop
    await Posting.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Crop and associated tracking deleted successfully",
    });

  } catch (error: any) {
    console.error("Error deleting crop:", error);

    let errorMessage = "Delete failed";
    let statusCode = 500;

    if (error.name === 'CastError') {
      errorMessage = "Invalid ID format";
      statusCode = 400;
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}

// GET single crop
export async function GET( req: NextRequest,{ params }:{params:Promise<{ id: string }>}) {
  try {
    await connectDB();
    const { id } = await params;

    const crop = await Posting.findById(id)
      .populate('tracking')
      .lean();

    if (!crop) {
      return NextResponse.json(
        { success: false, message: "Crop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: crop,
    });

  } catch (error: any) {
    console.error("Error fetching crop:", error);

    let errorMessage = "Fetch failed";
    let statusCode = 500;

    if (error.name === 'CastError') {
      errorMessage = "Invalid ID format";
      statusCode = 400;
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}