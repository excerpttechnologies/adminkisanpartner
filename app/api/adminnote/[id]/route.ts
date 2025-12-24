import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/Db';
import AdminNote from '../../../models/adminnote';
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// Upload directory
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'admin-notes');

async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// Helper function to delete file
async function deleteFile(fileName: string) {
  if (!fileName) return;
  
  try {
    const filePath = path.join(UPLOAD_DIR, fileName);
    if (existsSync(filePath)) {
      await unlink(filePath);
      console.log('File deleted:', fileName);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

// GET - Fetch single note by ID
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
        { success: false, error: 'Invalid note ID format' },
        { status: 400 }
      );
    }

    const note = await AdminNote.findById(id);

    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: note
    });

  } catch (error: any) {
    console.error('GET /api/adminnote/[id] error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

// PUT - Update note by ID
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await ensureUploadDir();

    const { id } = await context.params;

    console.log('Updating note with ID:', id);

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: 'Invalid note ID format' },
        { status: 400 }
      );
    }

    // Find existing note
    const existingNote = await AdminNote.findById(id);
    if (!existingNote) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    console.log('Existing note found:', existingNote.name);

    const contentType = request.headers.get('content-type') || '';
    let updateData: any = {};

    // Handle multipart/form-data (with file upload)
    if (contentType.includes('multipart/form-data')) {
      console.log('Processing multipart/form-data');
      const formData = await request.formData();
      
      updateData = {
        name: formData.get('name') as string,
        status: formData.get('status') as string,
        content: (formData.get('content') as string) || '',
      };

      const file = formData.get('file') as File | null;
      
      if (file && file.size > 0) {
        console.log('New file uploaded:', file.name);
        // Delete old file if exists
        if (existingNote.file) {
          await deleteFile(existingNote.file);
        }

        // Save new file
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const newFileName = `${timestamp}-${originalName}`;
        
        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = path.join(UPLOAD_DIR, newFileName);
        await writeFile(filePath, buffer);
        
        updateData.file = newFileName;
      }
    } 
    // Handle application/json (status update or notepad edit)
    else if (contentType.includes('application/json')) {
      console.log('Processing application/json');
      const body = await request.json();
      updateData = body.data || body;

      console.log('Update data:', updateData);

      // If updating to notepad (no file) and there was a file before
      if (updateData.file === null && existingNote.file) {
        console.log('Deleting old file:', existingNote.file);
        await deleteFile(existingNote.file);
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid content type: ' + contentType },
        { status: 400 }
      );
    }

    // Validate name if provided
    if (updateData.name !== undefined && (!updateData.name || updateData.name.trim() === '')) {
      return NextResponse.json(
        { success: false, error: 'Note name cannot be empty' },
        { status: 400 }
      );
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    console.log('Final update data:', updateData);

    // Update note
    const updatedNote = await AdminNote.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return NextResponse.json(
        { success: false, error: 'Failed to update note' },
        { status: 500 }
      );
    }

    console.log('Note updated successfully:', updatedNote.name);

    return NextResponse.json({
      success: true,
      data: updatedNote,
      message: 'Note updated successfully'
    });

  } catch (error: any) {
    console.error('PUT /api/adminnote/[id] error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update note' },
      { status: 500 }
    );
  }
}

// DELETE - Delete note by ID
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    console.log('Deleting note with ID:', id);

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: 'Invalid note ID format' },
        { status: 400 }
      );
    }

    // Find note
    const note = await AdminNote.findById(id);

    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    console.log('Note found:', note.name);

    // Delete associated file if exists
    if (note.file) {
      console.log('Deleting file:', note.file);
      await deleteFile(note.file);
    }

    // Delete note from database
    await AdminNote.findByIdAndDelete(id);

    console.log('Note deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Note deleted successfully',
      deletedId: id
    });

  } catch (error: any) {
    console.error('DELETE /api/adminnote/[id] error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete note' },
      { status: 500 }
    );
  }
}