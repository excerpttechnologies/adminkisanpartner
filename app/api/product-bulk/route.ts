import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/lib/Db';
import ProductItem from '@/app/models/ProductItem';

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    
    const { updates } = await request.json();
    
    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { success: false, message: 'Invalid updates format' },
        { status: 400 }
      );
    }
    
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: update.id },
        update: { $set: { stock: update.stock } }
      }
    }));
    
    const result = await ProductItem.bulkWrite(bulkOps);
    
    return NextResponse.json({
      success: true,
      message: 'Products updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error bulk updating products:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating products', error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { ids } = await request.json();
    
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ids format' },
        { status: 400 }
      );
    }
    
    const result = await ProductItem.deleteMany({ _id: { $in: ids } });
    
    return NextResponse.json({
      success: true,
      message: 'Products deleted successfully',
      data: result
    });
  } catch (error) {
    console.error('Error bulk deleting products:', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting products', error: String(error) },
      { status: 500 }
    );
  }
}