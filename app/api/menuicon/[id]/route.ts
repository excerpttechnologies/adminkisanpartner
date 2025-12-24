import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/Db';
import AdminMenuIcon from '../../../models/adminmenuicon';

// GET - Fetch single menu icon by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: 'Invalid menu icon ID format' },
        { status: 400 }
      );
    }

    const menuIcon = await AdminMenuIcon.findById(id);

    if (!menuIcon) {
      return NextResponse.json(
        { success: false, error: 'Menu icon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: menuIcon
    });

  } catch (error: any) {
    console.error('GET /api/menuicon/[id] error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch menu icon' },
      { status: 500 }
    );
  }
}

// PUT - Update menu icon by ID
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    console.log('Updating menu icon with ID:', id);

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: 'Invalid menu icon ID format' },
        { status: 400 }
      );
    }

    // Find existing menu icon
    const existingMenuIcon = await AdminMenuIcon.findById(id);
    if (!existingMenuIcon) {
      return NextResponse.json(
        { success: false, error: 'Menu icon not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updateData: any = {};

    // Update menuName if provided
    if (body.menuName !== undefined) {
      if (!body.menuName.trim()) {
        return NextResponse.json(
          { success: false, error: 'Menu name cannot be empty' },
          { status: 400 }
        );
      }
      updateData.menuName = body.menuName;
    }

    // Update menuIcon if provided
    if (body.menuIcon !== undefined) {
      if (!body.menuIcon.startsWith('data:image/')) {
        return NextResponse.json(
          { success: false, error: 'Invalid image format' },
          { status: 400 }
        );
      }
      updateData.menuIcon = body.menuIcon;
    }

    // Update isActive if provided
    if (body.isActive !== undefined) {
      updateData.isActive = body.isActive;
    }

    console.log('Update data:', { ...updateData, menuIcon: updateData.menuIcon ? 'base64...' : undefined });

    // Update menu icon
    const updatedMenuIcon = await AdminMenuIcon.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedMenuIcon) {
      return NextResponse.json(
        { success: false, error: 'Failed to update menu icon' },
        { status: 500 }
      );
    }

    console.log('Menu icon updated successfully:', updatedMenuIcon.menuName);

    return NextResponse.json({
      success: true,
      data: updatedMenuIcon,
      message: 'Menu icon updated successfully'
    });

  } catch (error: any) {
    console.error('PUT /api/menuicon/[id] error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update menu icon' },
      { status: 500 }
    );
  }
}

// DELETE - Delete menu icon by ID
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    console.log('Deleting menu icon with ID:', id);

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: 'Invalid menu icon ID format' },
        { status: 400 }
      );
    }

    // Find menu icon
    const menuIcon = await AdminMenuIcon.findById(id);

    if (!menuIcon) {
      return NextResponse.json(
        { success: false, error: 'Menu icon not found' },
        { status: 404 }
      );
    }

    console.log('Menu icon found:', menuIcon.menuName);

    // Delete menu icon from database
    await AdminMenuIcon.findByIdAndDelete(id);

    console.log('Menu icon deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Menu icon deleted successfully',
      deletedId: id
    });

  } catch (error: any) {
    console.error('DELETE /api/menuicon/[id] error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete menu icon' },
      { status: 500 }
    );
  }
}