// import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '@/app/lib/Db';
// import Seed from '@/app/models/Seed';
// import mongoose from 'mongoose';

// // POST bulk delete seeds
// export async function POST(request: NextRequest) {
//   try {
//     await dbConnect();
    
//     const body = await request.json();
//     const { ids } = body;
    
//     if (!Array.isArray(ids) || ids.length === 0) {
//       return NextResponse.json(
//         { success: false, error: 'No seed IDs provided' },
//         { status: 400 }
//       );
//     }

//     // Validate all IDs are valid ObjectIds
//     const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    
//     if (validIds.length === 0) {
//       return NextResponse.json(
//         { success: false, error: 'No valid seed IDs provided' },
//         { status: 400 }
//       );
//     }

//     const result = await Seed.deleteMany({ _id: { $in: validIds } });
    
//     return NextResponse.json({
//       success: true,
//       data: {
//         deletedCount: result.deletedCount
//       },
//       message: `${result.deletedCount} seed(s) deleted successfully`
//     });

//   } catch (error: any) {
//     console.error('Error in bulk delete:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/Db';
import Seed from '@/app/models/Seed';
import mongoose from 'mongoose';

// POST bulk delete seeds
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { ids } = body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No seed IDs provided' },
        { status: 400 }
      );
    }

    // Validate all IDs are valid ObjectIds
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid seed IDs provided' },
        { status: 400 }
      );
    }

    const result = await Seed.deleteMany({ _id: { $in: validIds } });
    
    return NextResponse.json({
      success: true,
      data: {
        deletedCount: result.deletedCount
      },
      message: `${result.deletedCount} seed(s) deleted successfully`
    });

  } catch (error: any) {
    console.error('Error in bulk delete:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}