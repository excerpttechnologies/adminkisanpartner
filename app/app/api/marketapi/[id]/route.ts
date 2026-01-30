


// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/app/lib/Db';
// import Market from '@/app/models/Marketdb';
// import mongoose from 'mongoose';

// // Helper to extract params in App Router
// async function getParams(request: NextRequest) {
//   const url = new URL(request.url);
//   const pathname = url.pathname;
//   const id = pathname.split('/').pop();
//   return { id };
// }

// export async function PUT(request: NextRequest) {
//   console.log('=== PUT /api/markets/[id] called ===');
  
//   try {
//     const { id } = await getParams(request);
//     console.log(`✓ Market ID to update: ${id}`);
    
//     // Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid market ID format' },
//         { status: 400 }
//       );
//     }
    
//     // Connect to database
//     await connectDB();
//     console.log('✓ Database connected');
    
//     // Parse request body
//     const body = await request.json();
//     console.log('✓ Update data:', body);
    
//     // Update market
//     const updatedMarket = await Market.findByIdAndUpdate(
//       id,
//       { 
//         ...body, 
//         updatedAt: new Date() 
//       },
//       { 
//         new: true, // Return updated document
//         runValidators: true // Run schema validation
//       }
//     );
    
//     if (!updatedMarket) {
//       console.log(`✗ Market not found with ID: ${id}`);
//       return NextResponse.json(
//         { success: false, error: 'Market not found' },
//         { status: 404 }
//       );
//     }
    
//     console.log('✓ Market updated successfully:', updatedMarket._id);
//     return NextResponse.json({
//       success: true,
//       message: 'Market updated successfully',
//       market: updatedMarket
//     }, { status: 200 });
    
//   } catch (error: any) {
//     console.error('✗ PUT Error:', error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: 'Failed to update market',
//         details: error.message || 'Unknown error'
//       },
//       { status: 400 }
//     );
//   }
// }

// export async function DELETE(request: NextRequest) {
//   console.log('=== DELETE /api/markets/[id] called ===');
  
//   try {
//     const { id } = await getParams(request);
//     console.log(`✓ Market ID to delete: ${id}`);
    
//     // Validate ObjectId
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid market ID format' },
//         { status: 400 }
//       );
//     }
    
//     // Connect to database
//     await connectDB();
//     console.log('✓ Database connected');
    
//     // Delete market
//     const deletedMarket = await Market.findByIdAndDelete(id);
    
//     if (!deletedMarket) {
//       console.log(`✗ Market not found with ID: ${id}`);
//       return NextResponse.json(
//         { success: false, error: 'Market not found' },
//         { status: 404 }
//       );
//     }
    
//     console.log('✓ Market deleted successfully:', deletedMarket._id);
//     return NextResponse.json({
//       success: true,
//       message: 'Market deleted successfully',
//       market: deletedMarket
//     }, { status: 200 });
    
//   } catch (error: any) {
//     console.error('✗ DELETE Error:', error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: 'Failed to delete market',
//         details: error.message || 'Unknown error'
//       },
//       { status: 400 }
//     );
//   }
// }

// // GET single market (optional)
// export async function GET(request: NextRequest) {
//   try {
//     const { id } = await getParams(request);
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid market ID format' },
//         { status: 400 }
//       );
//     }
    
//     await connectDB();
//     const market = await Market.findById(id);
    
//     if (!market) {
//       return NextResponse.json(
//         { success: false, error: 'Market not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       success: true,
//       market: market
//     }, { status: 200 });
    
//   } catch (error: any) {
//     console.error('GET single market error:', error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: 'Failed to fetch market',
//         details: error.message
//       },
//       { status: 500 }
//     );
//   }
// }




//UPDATED BY SAGAR
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/Db';
import Market from '@/app/models/Marketdb';
import mongoose from 'mongoose';

// Helper to extract params in App Router
async function getParams(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const id = pathname.split('/').pop();
  return { id };
}

export async function PUT(request: NextRequest) {
  console.log('=== PUT /api/markets/[id] called ===');
  
  try {
    const { id } = await getParams(request);
    console.log(`✓ Market ID to update: ${id}`);
    
    // Validate ObjectId - Add null check first
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid market ID format' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectDB();
    console.log('✓ Database connected');
    
    // Parse request body
    const body = await request.json();
    console.log('✓ Update data:', body);
    
    // Update market
    const updatedMarket = await Market.findByIdAndUpdate(
      id,
      { 
        ...body, 
        updatedAt: new Date() 
      },
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validation
      }
    );
    
    if (!updatedMarket) {
      console.log(`✗ Market not found with ID: ${id}`);
      return NextResponse.json(
        { success: false, error: 'Market not found' },
        { status: 404 }
      );
    }
    
    console.log('✓ Market updated successfully:', updatedMarket._id);
    return NextResponse.json({
      success: true,
      message: 'Market updated successfully',
      market: updatedMarket
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('✗ PUT Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update market',
        details: error.message || 'Unknown error'
      },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  console.log('=== DELETE /api/markets/[id] called ===');
  
  try {
    const { id } = await getParams(request);
    console.log(`✓ Market ID to delete: ${id}`);
    
    // Validate ObjectId - Add null check first
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid market ID format' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectDB();
    console.log('✓ Database connected');
    
    // Delete market
    const deletedMarket = await Market.findByIdAndDelete(id);
    
    if (!deletedMarket) {
      console.log(`✗ Market not found with ID: ${id}`);
      return NextResponse.json(
        { success: false, error: 'Market not found' },
        { status: 404 }
      );
    }
    
    console.log('✓ Market deleted successfully:', deletedMarket._id);
    return NextResponse.json({
      success: true,
      message: 'Market deleted successfully',
      market: deletedMarket
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('✗ DELETE Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete market',
        details: error.message || 'Unknown error'
      },
      { status: 400 }
    );
  }
}

// GET single market (optional)
export async function GET(request: NextRequest) {
  try {
    const { id } = await getParams(request);
    
    // Validate ObjectId - Add null check first
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid market ID format' },
        { status: 400 }
      );
    }
    
    await connectDB();
    const market = await Market.findById(id);
    
    if (!market) {
      return NextResponse.json(
        { success: false, error: 'Market not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      market: market
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('GET single market error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch market',
        details: error.message
      },
      { status: 500 }
    );
  }
}