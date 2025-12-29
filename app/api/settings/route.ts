import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/Db';
import Setting from '@/app/models/Setting';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/settings');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }
}

// GET: Fetch settings
export async function GET() {
  try {
    await dbConnect();
    
    const settings = await Setting.findOne();
    
    if (!settings) {
      // Return empty settings if none exist
      return NextResponse.json({});
    }
    
    return NextResponse.json(settings.toObject());
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST: Update settings
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    await ensureUploadDir();
    
    const formData = await request.formData();
    const settingsData = formData.get('settings') as string;
    
    if (!settingsData) {
      return NextResponse.json(
        { error: 'Settings data is required' },
        { status: 400 }
      );
    }
    
    const parsedSettings = JSON.parse(settingsData);
    
    // Handle file uploads
    const fileFields = ['logo', 'favicon', 'paymentQrCode', 'termsAudio'];
    const uploadedFiles: Record<string, string> = {};
    
    for (const field of fileFields) {
      const file = formData.get(field) as File;
      if (file && file.size > 0) {
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: `${field} exceeds 5MB limit` },
            { status: 400 }
          );
        }
        
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate unique filename
        const fileExtension = path.extname(file.name);
        const uniqueFileName = `${field}_${uuidv4()}${fileExtension}`;
        const filePath = path.join(UPLOAD_DIR, uniqueFileName);
        
        // Save file
        await writeFile(filePath, buffer);
        
        // Store relative path
        uploadedFiles[field] = `/uploads/settings/${uniqueFileName}`;
        
        // Delete old file if exists
        const oldSettings = await Setting.findOne();
        if (oldSettings && oldSettings[field]) {
          try {
            const oldFilePath = path.join(process.cwd(), 'public', oldSettings[field]);
            await unlink(oldFilePath);
          } catch (err) {
            console.log(`Could not delete old ${field}:`, err);
          }
        }
      }
    }
    
    // Merge uploaded files with settings
    const updatedSettings = {
      ...parsedSettings,
      ...uploadedFiles
    };
    
    // Find and update or create settings
    let existingSettings = await Setting.findOne();
    
    if (existingSettings) {
      // Update existing settings
      Object.assign(existingSettings, updatedSettings);
      await existingSettings.save();
    } else {
      // Create new settings
      existingSettings = await Setting.create(updatedSettings);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: existingSettings
    });
  } catch (error: any) {
    console.error('Error saving settings:', error);
    
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON data' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to save settings' },
      { status: 500 }
    );
  }
}

// DELETE: Reset to empty settings
export async function DELETE() {
  try {
    await dbConnect();
    
    const settings = await Setting.findOne();
    
    if (settings) {
      // Delete uploaded files
      const fileFields = ['logo', 'favicon', 'paymentQrCode', 'termsAudio'];
      for (const field of fileFields) {
        if (settings[field]) {
          try {
            const filePath = path.join(process.cwd(), 'public', settings[field]);
            await unlink(filePath);
          } catch (err) {
            console.log(`Could not delete ${field}:`, err);
          }
        }
      }
      
      // Delete the settings document
      await settings.deleteOne();
    }
    
    return NextResponse.json({
      success: true,
      message: 'Settings reset successfully'
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    return NextResponse.json(
      { error: 'Failed to reset settings' },
      { status: 500 }
    );
  }
}