import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/Db';
import Acre from '@/app/models/Acre';
import mongoose from 'mongoose';

// POST bulk delete acres
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { ids } = body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No acres selected for deletion' },
        { status: 400 }
      );
    }
    
    // Validate all IDs
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid acre IDs provided' },
        { status: 400 }
      );
    }
    
    // Convert string IDs to ObjectId
    const objectIds = validIds.map(id => new mongoose.Types.ObjectId(id));
    
    const result = await Acre.deleteMany({
      _id: { $in: objectIds }
    });
    
    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} acre(s) deleted successfully`,
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