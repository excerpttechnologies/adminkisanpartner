// import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import Breed from '@/models/Breed';
// import mongoose from 'mongoose';

// // POST bulk delete breeds
// export async function POST(request: NextRequest) {
//   try {
//     await dbConnect();
    
//     const body = await request.json();
//     const { ids } = body;
    
//     if (!Array.isArray(ids) || ids.length === 0) {
//       return NextResponse.json(
//         { success: false, error: 'No breeds selected for deletion' },
//         { status: 400 }
//       );
//     }
    
//     // Validate all IDs
//     const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    
//     if (validIds.length === 0) {
//       return NextResponse.json(
//         { success: false, error: 'No valid breed IDs provided' },
//         { status: 400 }
//       );
//     }
    
//     // Convert string IDs to ObjectId
//     const objectIds = validIds.map(id => new mongoose.Types.ObjectId(id));
    
//     const result = await Breed.deleteMany({
//       _id: { $in: objectIds }
//     });
    
//     return NextResponse.json({
//       success: true,
//       message: `${result.deletedCount} breed(s) deleted successfully`,
//       deletedCount: result.deletedCount
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }





import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/Db';
import Breed from '@/app/models/Breed';
import mongoose from 'mongoose';

// POST bulk delete breeds
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { ids } = body;
    
    console.log('Bulk delete request for IDs:', ids);
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No breeds selected for deletion' },
        { status: 400 }
      );
    }
    
    // Validate all IDs
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid breed IDs provided' },
        { status: 400 }
      );
    }
    
    // Convert string IDs to ObjectId
    const objectIds = validIds.map(id => new mongoose.Types.ObjectId(id));
    
    const result = await Breed.deleteMany({
      _id: { $in: objectIds }
    });
    
    console.log('Bulk delete result:', result);
    
    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} breed(s) deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error: any) {
    console.error('Bulk delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}