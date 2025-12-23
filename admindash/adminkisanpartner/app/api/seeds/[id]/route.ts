// import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '@/app/lib/Db';
// import Seed from '@/app/models/Seed';
// import mongoose from 'mongoose';

// // GET single seed by ID
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await dbConnect();
    
//     if (!mongoose.Types.ObjectId.isValid(params.id)) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid seed ID' },
//         { status: 400 }
//       );
//     }

//     const seed = await Seed.findById(params.id);
    
//     if (!seed) {
//       return NextResponse.json(
//         { success: false, error: 'Seed not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data: seed
//     });

//   } catch (error: any) {
//     console.error('Error fetching seed:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // PUT update seed
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await dbConnect();
    
//     if (!mongoose.Types.ObjectId.isValid(params.id)) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid seed ID' },
//         { status: 400 }
//       );
//     }

//     const body = await request.json();
    
//     // Validate required fields
//     if (!body.name || !body.name.trim()) {
//       return NextResponse.json(
//         { success: false, error: 'Seed name is required' },
//         { status: 400 }
//       );
//     }

//     // Check if seed exists
//     const existingSeed = await Seed.findById(params.id);
//     if (!existingSeed) {
//       return NextResponse.json(
//         { success: false, error: 'Seed not found' },
//         { status: 404 }
//       );
//     }

//     // Check for duplicate seed name (excluding current seed)
//     const duplicateSeed = await Seed.findOne({
//       _id: { $ne: params.id },
//       name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') }
//     });
    
//     if (duplicateSeed) {
//       return NextResponse.json(
//         { success: false, error: 'Seed with this name already exists' },
//         { status: 400 }
//       );
//     }

//     // Update seed
//     const seed = await Seed.findByIdAndUpdate(
//       params.id,
//       {
//         name: body.name.trim(),
//         description: body.description?.trim(),
//         category: body.category || existingSeed.category
//       },
//       { new: true, runValidators: true }
//     );

//     return NextResponse.json({
//       success: true,
//       data: seed,
//       message: 'Seed updated successfully'
//     });

//   } catch (error: any) {
//     console.error('Error updating seed:', error);
    
//     if (error instanceof mongoose.Error.ValidationError) {
//       const messages = Object.values(error.errors).map(err => err.message);
//       return NextResponse.json(
//         { success: false, error: messages.join(', ') },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // DELETE seed
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await dbConnect();
    
//     if (!mongoose.Types.ObjectId.isValid(params.id)) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid seed ID' },
//         { status: 400 }
//       );
//     }

//     const seed = await Seed.findByIdAndDelete(params.id);
    
//     if (!seed) {
//       return NextResponse.json(
//         { success: false, error: 'Seed not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: 'Seed deleted successfully'
//     });

//   } catch (error: any) {
//     console.error('Error deleting seed:', error);
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

// GET single seed by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params is a Promise
) {
  try {
    await dbConnect();
    
    // Await the params promise
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid seed ID' },
        { status: 400 }
      );
    }

    const seed = await Seed.findById(id);
    
    if (!seed) {
      return NextResponse.json(
        { success: false, error: 'Seed not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: seed
    });

  } catch (error: any) {
    console.error('Error fetching seed:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update seed
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params is a Promise
) {
  try {
    await dbConnect();
    
    // Await the params promise
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid seed ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Seed name is required' },
        { status: 400 }
      );
    }

    // Check if seed exists
    const existingSeed = await Seed.findById(id);
    if (!existingSeed) {
      return NextResponse.json(
        { success: false, error: 'Seed not found' },
        { status: 404 }
      );
    }

    // Check for duplicate seed name (excluding current seed)
    const duplicateSeed = await Seed.findOne({
      _id: { $ne: id },
      name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') }
    });
    
    if (duplicateSeed) {
      return NextResponse.json(
        { success: false, error: 'Seed with this name already exists' },
        { status: 400 }
      );
    }

    // Update seed
    const seed = await Seed.findByIdAndUpdate(
      id,
      {
        name: body.name.trim(),
        description: body.description?.trim(),
        category: body.category || existingSeed.category
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: seed,
      message: 'Seed updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating seed:', error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE seed
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params is a Promise
) {
  try {
    await dbConnect();
    
    // Await the params promise
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid seed ID' },
        { status: 400 }
      );
    }

    const seed = await Seed.findByIdAndDelete(id);
    
    if (!seed) {
      return NextResponse.json(
        { success: false, error: 'Seed not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Seed deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting seed:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


