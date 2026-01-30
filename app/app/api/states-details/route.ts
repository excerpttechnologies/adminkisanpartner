import { NextResponse, NextRequest } from 'next/server';
import dbConnect from "@/app/lib/Db";
import StatesDetails, { IStatesDetails } from "@/app/models/StatesDetails";

// Type for API response
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Type for India Post API response
interface PostOffice {
  Name: string;
  BranchType: string;
  DeliveryStatus: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  State: string;
  Country: string;
  Block:string
}

interface IndiaPostResponse {
  Message: string;
  Status: string;
  PostOffice: PostOffice[];
}

// New endpoint to fetch PIN code details
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    // Check if this is a PIN code lookup request
    if (action === 'lookup-pin' || searchParams.has('pincode')) {
      const pincode = searchParams.get('pincode');
      return await handlePinCodeLookup(pincode);
    }
    
    // Otherwise, handle the regular data fetch
    await dbConnect();

    const  totaldata=await StatesDetails.find({})
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || String(totaldata.length));
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    // Build search query
    let query = {};
    if (search) {
      query = {
        $or: [
          { pinCode: { $regex: search, $options: 'i' } },
          { state: { $regex: search, $options: 'i' } },
          { district: { $regex: search, $options: 'i' } },
          { taluk: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const [data, total] = await Promise.all([
      StatesDetails.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      StatesDetails.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error in GET:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

// Handle PIN code lookup from India Post API
async function handlePinCodeLookup(pincode: string | null): Promise<NextResponse<ApiResponse>> {
  try {
    if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 6-digit PIN code' },
        { status: 400 }
      );
    }

    // Fetch from India Post API
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    

    const data: IndiaPostResponse[] = await response.json();

    
    
    if (!data || data.length === 0 || data[0].Status !== 'Success') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid PIN code or no data found' 
        },
        { status: 404 }
      );
    }

    const postOffices = data[0].PostOffice;
    
    if (!postOffices || postOffices.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No post office found for this PIN code' },
        { status: 404 }
      );
    }

    // Get unique states, districts, and talukas
    const states = [...new Set(postOffices.map(po => po.State))];
    const districts = [...new Set(postOffices.map(po => po.District))];
    const talukas = [...new Set(postOffices.map(po => {
      // Try to extract taluk from Name or use District as fallback
      const name = po.Name.toLowerCase();
      if (name.includes('taluk') || name.includes('tehsil')) {
        return po.Name;
      }
      return po.Block || po.District;
    }))];

    return NextResponse.json({
      success: true,
      data: {
        pinCode: pincode,
        state: states[0] || '',
        district: districts[0] || '',
        taluk: talukas[0] || ''
      }
    });
  } catch (error: any) {
    console.error('Error fetching PIN code details:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch PIN code details. Please try again.' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate required fields
    const { pinCode, state, district, taluk } = body;
    
    if (!pinCode || !state || !district || !taluk) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Trim whitespace
    const trimmedData = {
      pinCode: pinCode.trim(),
      state: state.trim(),
      district: district.trim(),
      taluk: taluk.trim()
    };

    // Validate PIN code
    if (!/^\d{6}$/.test(trimmedData.pinCode)) {
      return NextResponse.json(
        { success: false, error: 'PIN Code must be exactly 6 digits' },
        { status: 400 }
      );
    }

    // Check if PIN already exists
    const existing = await StatesDetails.findOne({ pinCode: trimmedData.pinCode });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'PIN Code already exists' },
        { status: 400 }
      );
    }

    const data = await StatesDetails.create(trimmedData);
    
    return NextResponse.json({
      success: true,
      data,
      message: 'State details added successfully'
    });
  } catch (error: any) {
    console.error('Error creating states details:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'PIN Code already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create data' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const data = await StatesDetails.findByIdAndDelete(id);
    
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'State details deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting states details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    // Validate PIN code if being updated
    if (body.pinCode && !/^\d{6}$/.test(body.pinCode)) {
      return NextResponse.json(
        { success: false, error: 'PIN Code must be exactly 6 digits' },
        { status: 400 }
      );
    }

    // Check for duplicate PIN code
    if (body.pinCode) {
      const existing = await StatesDetails.findOne({ 
        pinCode: body.pinCode,
        _id: { $ne: id }
      });
      
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'PIN Code already exists' },
          { status: 400 }
        );
      }
    }

    const data = await StatesDetails.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'State details updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating states details:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'PIN Code already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update data' },
      { status: 500 }
    );
  }
}