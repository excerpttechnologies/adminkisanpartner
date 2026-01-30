

// import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '@/app/lib/Db';
// import Breed from '@/app/models/Breed';
// import mongoose from 'mongoose';

// // GET single breed by ID
// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await dbConnect();
    
//     const { id } = await params;
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid breed ID' },
//         { status: 400 }
//       );
//     }
    
//     const breed = await Breed.findById(id).lean();
    
//     if (!breed) {
//       return NextResponse.json(
//         { success: false, error: 'Breed not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       success: true,
//       data: {
//         id: breed._id.toString(),
//         name: breed.name,
//         selected: false
//       }
//     });
//   } catch (error: any) {
//     console.error('GET breed error:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // PUT update breed
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await dbConnect();
    
//     const { id } = await params;
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid breed ID' },
//         { status: 400 }
//       );
//     }
    
//     const body = await request.json();
//     const { name } = body;
    
//     console.log('Update request for ID:', id, 'New name:', name);
    
//     if (!name || !name.trim()) {
//       return NextResponse.json(
//         { success: false, error: 'Breed name is required' },
//         { status: 400 }
//       );
//     }
    
//     // Check if another breed with same name exists
//     const existingBreed = await Breed.findOne({ 
//       name: name.trim(),
//       _id: { $ne: new mongoose.Types.ObjectId(id) }
//     });
    
//     if (existingBreed) {
//       return NextResponse.json(
//         { success: false, error: 'Breed name already exists' },
//         { status: 400 }
//       );
//     }
    
//     const breed = await Breed.findByIdAndUpdate(
//       id,
//       { name: name.trim() },
//       { new: true, runValidators: true }
//     ).lean();
    
//     console.log('Updated breed:', breed);
    
//     if (!breed) {
//       return NextResponse.json(
//         { success: false, error: 'Breed not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       success: true,
//       data: {
//         id: breed._id.toString(),
//         name: breed.name,
//         selected: false
//       }
//     });
//   } catch (error: any) {
//     console.error('Update breed error:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // DELETE breed
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await dbConnect();
    
//     const { id } = await params;
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid breed ID' },
//         { status: 400 }
//       );
//     }
    
//     const breed = await Breed.findByIdAndDelete(id).lean();
    
//     if (!breed) {
//       return NextResponse.json(
//         { success: false, error: 'Breed not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       success: true,
//       message: 'Breed deleted successfully'
//     });
//   } catch (error: any) {
//     console.error('Delete breed error:', error);
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

// GET single breed by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid breed ID' },
        { status: 400 }
      );
    }
    
    const breed = await Breed.findById(id).lean();
    
    if (!breed) {
      return NextResponse.json(
        { success: false, error: 'Breed not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: breed._id.toString(),
        name: breed.name,
        sortOrder: breed.sortOrder || 0, // Add sortOrder to response
        selected: false
      }
    });
  } catch (error: any) {
    console.error('GET breed error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update breed
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid breed ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { name, sortOrder } = body; // Add sortOrder to destructuring
    
    console.log('Update request for ID:', id, 'New name:', name, 'Sort order:', sortOrder);
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Breed name is required' },
        { status: 400 }
      );
    }
    
    // Check if another breed with same name exists
    const existingBreed = await Breed.findOne({ 
      name: name.trim(),
      _id: { $ne: new mongoose.Types.ObjectId(id) }
    });
    
    if (existingBreed) {
      return NextResponse.json(
        { success: false, error: 'Breed name already exists' },
        { status: 400 }
      );
    }
    
    // Prepare update data
    const updateData: any = { 
      name: name.trim(),
      updatedAt: Date.now() // Add updatedAt timestamp
    };
    
    // Add sortOrder if provided
    if (sortOrder !== undefined) {
      updateData.sortOrder = sortOrder || 0;
    }
    
    const breed = await Breed.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();
    
    console.log('Updated breed:', breed);
    
    if (!breed) {
      return NextResponse.json(
        { success: false, error: 'Breed not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: breed._id.toString(),
        name: breed.name,
        sortOrder: breed.sortOrder || 0, // Include sortOrder in response
        selected: false
      }
    });
  } catch (error: any) {
    console.error('Update breed error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE breed
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid breed ID' },
        { status: 400 }
      );
    }
    
    const breed = await Breed.findByIdAndDelete(id).lean();
    
    if (!breed) {
      return NextResponse.json(
        { success: false, error: 'Breed not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Breed deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete breed error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}