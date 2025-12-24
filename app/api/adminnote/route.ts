import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../lib/Db';
import AdminNote from '../../models/adminnote';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'admin-notes');

async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// GET - Fetch all notes with optional search
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Build search query
    let query: any = {};
    if (search && search.trim() !== '') {
      const searchRegex = { $regex: search, $options: 'i' };
      query = {
        $or: [
          { name: searchRegex },
          { content: searchRegex }
        ]
      };
      
      // If search looks like a valid MongoDB ID, include it in search
      if (search.match(/^[0-9a-fA-F]{24}$/)) {
        query.$or.push({ _id: search });
      }
    }

    const notes = await AdminNote.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: notes,
      count: notes.length
    });

  } catch (error: any) {
    console.error('GET /api/adminnote error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

// POST - Create new note with optional file upload
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    await ensureUploadDir();

    const contentType = request.headers.get('content-type') || '';

    let noteData: any = {};

    // Handle multipart/form-data (file upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      noteData = {
        name: formData.get('name') as string,
        status: (formData.get('status') as string) || 'draft',
        content: (formData.get('content') as string) || '',
      };

      const file = formData.get('file') as File | null;
      
      if (file && file.size > 0) {
        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${timestamp}-${originalName}`;
        
        // Save file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = path.join(UPLOAD_DIR, fileName);
        await writeFile(filePath, buffer);
        
        noteData.file = fileName;
      }
    } 
    // Handle application/json (notepad without file)
    else if (contentType.includes('application/json')) {
      const body = await request.json();
      noteData = body.data || body;
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid content type' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!noteData.name || noteData.name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Note name is required' },
        { status: 400 }
      );
    }

    // Create note
    const newNote = await AdminNote.create(noteData);

    return NextResponse.json({
      success: true,
      data: newNote,
      message: 'Note created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST /api/adminnote error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create note' },
      { status: 500 }
    );
  }
}