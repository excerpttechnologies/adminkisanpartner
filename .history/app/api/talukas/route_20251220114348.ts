import connectDB from '@/app/lib/Db';
import { NextRequest, NextResponse } from 'next/server';


// GET /api/talukas - Get all talukas with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const districtId = searchParams.get('districtId') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (districtId) {
      query.district = districtId;
    }

    // Execute query with pagination and populate district name
    const [talukas, total] = await Promise.all([
      Taluka.find(query)
        .populate('district', 'name')
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Taluka.countDocuments(query)
    ]);

    // Format response
    const formattedTalukas = talukas.map(taluka => ({
      ...taluka,
      districtName: (taluka.district as any)?.name || 'Unknown District'
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: formattedTalukas,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    });
  } catch (error: any) {
    console.error('Error fetching talukas:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch talukas' 
      },
      { status: 500 }
    );
  }
}

// POST /api/talukas - Create new taluka
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { name, district } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Taluka name is required' },
        { status: 400 }
      );
    }

    if (!district) {
      return NextResponse.json(
        { success: false, message: 'District is required' },
        { status: 400 }
      );
    }

    // Check if district exists
    const districtExists = await District.findById(district);
    if (!districtExists) {
      return NextResponse.json(
        { success: false, message: 'District not found' },
        { status: 404 }
      );
    }

    // Check if taluka already exists in the same district
    const existingTaluka = await Taluka.findOne({ 
      name: name.trim(), 
      district 
    });
    if (existingTaluka) {
      return NextResponse.json(
        { success: false, message: 'Taluka already exists in this district' },
        { status: 400 }
      );
    }

    const taluka = await Taluka.create({ 
      name: name.trim(), 
      district 
    });

    // Populate district name for response
    const populatedTaluka = await Taluka.findById(taluka._id)
      .populate('district', 'name')
      .lean();

    return NextResponse.json({
      success: true,
      message: 'Taluka created successfully',
      data: {
        ...populatedTaluka,
        districtName: (populatedTaluka?.district as any)?.name || 'Unknown District'
      }
    });
  } catch (error: any) {
    console.error('Error creating taluka:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to create taluka' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/talukas - Bulk delete talukas
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No talukas selected for deletion' },
        { status: 400 }
      );
    }

    const result = await Taluka.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'No talukas found to delete' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} taluka(s) deleted successfully`
    });
  } catch (error: any) {
    console.error('Error deleting talukas:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to delete talukas' 
      },
      { status: 500 }
    );
  }
}