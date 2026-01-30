// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Posting from "@/app/models/Posting";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const { ids } = await req.json();

//     if (!Array.isArray(ids) || ids.length === 0) {
//       return NextResponse.json(
//         { success: false, message: "No IDs provided" },
//         { status: 400 }
//       );
//     }

//     const result = await Posting.deleteMany({ _id: { $in: ids } });

//     return NextResponse.json({
//       success: true,
//       message: `${result.deletedCount} postings deleted successfully`,
//     });
//   } catch (error: any) {
//     console.error("Error in bulk delete:", error);
//     return NextResponse.json(
//       { success: false, message: "Bulk delete failed", error: error.message },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Posting from "@/app/models/Posting";
import Tracking from "@/app/models/Tracking";

export async function POST(req: NextRequest) {
  const session = await Posting.startSession();
  session.startTransaction();
  
  try {
    await connectDB();
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, message: "No IDs provided" },
        { status: 400 }
      );
    }

    // Get all crops to find their tracking IDs
    const crops = await Posting.find({ 
      _id: { $in: ids } 
    }).session(session);

    if (crops.length === 0) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, message: "No crops found with the provided IDs" },
        { status: 404 }
      );
    }

    // Extract tracking IDs from crops
    const trackingIds = crops
      .map(crop => crop.trackingId)
      .filter(id => id); // Remove null/undefined

    // Delete tracking data first
    if (trackingIds.length > 0) {
      await Tracking.deleteMany({ 
        _id: { $in: trackingIds } 
      }).session(session);
    }

    // Delete crops
    const deleteResult = await Posting.deleteMany({ 
      _id: { $in: ids } 
    }).session(session);

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({
      success: true,
      message: `${deleteResult.deletedCount} crops and ${trackingIds.length} associated trackings deleted successfully`,
      deletedCropsCount: deleteResult.deletedCount,
      deletedTrackingsCount: trackingIds.length
    });
    
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    
    console.error("Error in bulk delete:", error);
    
    let errorMessage = "Bulk delete failed";
    let statusCode = 500;

    if (error.name === 'ValidationError') {
      errorMessage = Object.values(error.errors).map((err: any) => err.message).join(', ');
      statusCode = 400;
    } else if (error.name === 'CastError') {
      errorMessage = "Invalid ID format in the provided list";
      statusCode = 400;
    }

    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
      },
      { status: statusCode }
    );
  }
}