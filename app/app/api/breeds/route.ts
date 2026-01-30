// import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '@/app/lib/Db';
// import Breed from '@/app/models/Breed';

// // GET all breeds
// export async function GET(request: NextRequest) {
//   try {
//     await dbConnect();
    
//     const searchParams = request.nextUrl.searchParams;
//     const sortOrder = searchParams.get('sort') || 'asc';
    
//     const breeds = await Breed.find({})
//       .sort({ _id: sortOrder === 'desc' ? -1 : 1 })
//       .lean();
    
//     // Convert MongoDB _id to id and add selected field
//     const formattedBreeds = breeds.map(breed => ({
//       id: breed._id.toString(),
//       name: breed.name,
//       selected: false
//     }));
    
//     return NextResponse.json({ success: true, data: formattedBreeds });
//   } catch (error: any) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // POST new breed
// export async function POST(request: NextRequest) {
//   try {
//     await dbConnect();
    
//     const body = await request.json();
//     const { name } = body;
    
//     if (!name || !name.trim()) {
//       return NextResponse.json(
//         { success: false, error: 'Breed name is required' },
//         { status: 400 }
//       );
//     }
    
//     // Check if breed already exists
//     const existingBreed = await Breed.findOne({ name: name.trim() });
//     if (existingBreed) {
//       return NextResponse.json(
//         { success: false, error: 'Breed already exists' },
//         { status: 400 }
//       );
//     }
    
//     const breed = await Breed.create({ name: name.trim() });
    
//     return NextResponse.json(
//       { 
//         success: true, 
//         data: {
//           id: breed._id.toString(),
//           name: breed.name,
//           selected: false
//         }
//       },
//       { status: 201 }
//     );
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

// GET all breeds
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const sortParam = searchParams.get('sort') || 'asc';
    const sortBy = searchParams.get('sortBy') || 'sortOrder'; // Add sortBy parameter
    
    // Define sort options
    let sortOptions = {};
    if (sortBy === 'name') {
      // Sort by name
      sortOptions = { name: sortParam === 'desc' ? -1 : 1 };
    } else if (sortBy === 'sortOrder') {
      // Sort by sortOrder
      sortOptions = { sortOrder: sortParam === 'desc' ? -1 : 1 };
    } else {
      // Default sort by _id
      sortOptions = { _id: sortParam === 'desc' ? -1 : 1 };
    }
    
    const breeds = await Breed.find({})
      .sort(sortOptions)
      .lean();
    
    // Convert MongoDB _id to id and add selected field
    const formattedBreeds = breeds.map(breed => ({
      id: breed._id.toString(),
      name: breed.name,
      sortOrder: breed.sortOrder || 0, // Add sortOrder field
      selected: false
    }));
    
    return NextResponse.json({ success: true, data: formattedBreeds });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST new breed
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { name, sortOrder = 0 } = body; // Add sortOrder with default value 0
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Breed name is required' },
        { status: 400 }
      );
    }
    
    // Check if breed already exists
    const existingBreed = await Breed.findOne({ name: name.trim() });
    if (existingBreed) {
      return NextResponse.json(
        { success: false, error: 'Breed already exists' },
        { status: 400 }
      );
    }
    
    const breed = await Breed.create({ 
      name: name.trim(),
      sortOrder: sortOrder || 0 // Add sortOrder
    });
    
    return NextResponse.json(
      { 
        success: true, 
        data: {
          id: breed._id.toString(),
          name: breed.name,
          sortOrder: breed.sortOrder || 0, // Include sortOrder in response
          selected: false
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}