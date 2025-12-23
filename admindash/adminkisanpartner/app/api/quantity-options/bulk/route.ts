import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/Db';
import QuantityOption from '@/app/models/QuantityOption';
import mongoose from 'mongoose';

// POST bulk delete quantity options
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { ids } = body;
    
    console.log('Bulk delete request for IDs:', ids);
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No quantity options selected for deletion' },
        { status: 400 }
      );
    }
    
    // Validate all IDs
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid quantity option IDs provided' },
        { status: 400 }
      );
    }
    
    // Convert string IDs to ObjectId
    const objectIds = validIds.map(id => new mongoose.Types.ObjectId(id));
    
    const result = await QuantityOption.deleteMany({
      _id: { $in: objectIds }
    });
    
    console.log('Bulk delete result:', result);
    
    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} quantity option(s) deleted successfully`,
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