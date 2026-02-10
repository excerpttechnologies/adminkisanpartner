// import { NextRequest, NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// // Define uploads directory (same as in your category route)
// const UPLOADS_BASE_DIR = path.join(process.cwd(), 'uploads');

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { path: string[] } }
// ) {
//   try {
//     // Get the file path from URL parameters
//     const filePath = params.path.join('/');
    
//     // Construct full path to the file
//     const fullPath = path.join(UPLOADS_BASE_DIR, filePath);
    
//     // Check if file exists
//     if (!fs.existsSync(fullPath)) {
//       return NextResponse.json(
//         { success: false, message: 'File not found' },
//         { status: 404 }
//       );
//     }
    
//     // Read file
//     const fileBuffer = fs.readFileSync(fullPath);
//     const fileExtension = path.extname(fullPath).toLowerCase();
    
//     // Determine content type
//     let contentType = 'application/octet-stream';
//     const imageExtensions: Record<string, string> = {
//       '.jpg': 'image/jpeg',
//       '.jpeg': 'image/jpeg',
//       '.png': 'image/png',
//       '.gif': 'image/gif',
//       '.webp': 'image/webp',
//       '.svg': 'image/svg+xml',
//       '.bmp': 'image/bmp',
//       '.ico': 'image/x-icon'
//     };
    
//     if (fileExtension in imageExtensions) {
//       contentType = imageExtensions[fileExtension];
//     }
    
//     // Return file with appropriate headers
//     return new NextResponse(fileBuffer, {
//       status: 200,
//       headers: {
//         'Content-Type': contentType,
//         'Content-Disposition': `inline; filename="${path.basename(fullPath)}"`,
//         'Cache-Control': 'public, max-age=31536000, immutable',
//       },
//     });
    
//   } catch (error: any) {
//     console.error('Error serving file:', error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }




import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define uploads directory (same as in your category route)
const UPLOADS_BASE_DIR = path.join(process.cwd(), 'uploads');

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await the params since they're now a Promise
    const { path: pathSegments } = await context.params;
    
    // Get the file path from URL parameters
    const filePath = pathSegments.join('/');
    
    // Construct full path to the file
    const fullPath = path.join(UPLOADS_BASE_DIR, filePath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { success: false, message: 'File not found' },
        { status: 404 }
      );
    }
    
    // Read file
    const fileBuffer = fs.readFileSync(fullPath);
    const fileExtension = path.extname(fullPath).toLowerCase();
    
    // Determine content type
    let contentType = 'application/octet-stream';
    const imageExtensions: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.bmp': 'image/bmp',
      '.ico': 'image/x-icon'
    };
    
    if (fileExtension in imageExtensions) {
      contentType = imageExtensions[fileExtension];
    }
    
    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${path.basename(fullPath)}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
    
  } catch (error: any) {
    console.error('Error serving file:', error);
    
    // Handle specific error cases
    if (error.code === 'ENOENT') {
      return NextResponse.json(
        { success: false, message: 'File not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}