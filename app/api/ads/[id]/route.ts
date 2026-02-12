

// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '../../../lib/Db';
// import Advertisement from '@/app/models/AdvertisementModel';
// import { v4 as uuidv4 } from 'uuid';

// // Helper function to get params
// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();
    
//     const { id } = await params;
//     const ad = await Advertisement.findById(id).lean();
    
//     if (!ad) {
//       return NextResponse.json(
//         { success: false, error: 'Advertisement not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data: ad
//     });

//   } catch (error: any) {
//     console.error('Error fetching ad:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // PUT update advertisement
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();
    
//     const { id } = await params;
//     const body = await request.json();
    
//     console.log('Updating advertisement:', id, body);

//     // Find existing ad
//     const existingAd = await Advertisement.findById(id);
//     if (!existingAd) {
//       return NextResponse.json(
//         { success: false, error: 'Advertisement not found' },
//         { status: 404 }
//       );
//     }

//     // Update fields
//     const updateData: any = {};
    
//     // Only update provided fields
//     if (body.heading !== undefined) updateData.heading = body.heading;
//     if (body.stage !== undefined) updateData.stage = body.stage;
//     if (body.tab !== undefined) updateData.tab = body.tab;
//     if (body.guide !== undefined) updateData.guide = body.guide;
//     if (body.companyLogo !== undefined) updateData.companyLogo = body.companyLogo;
//     if (body.companyName !== undefined) updateData.companyName = body.companyName;
//     if (body.description !== undefined) updateData.description = body.description;
//     if (body.advice !== undefined) updateData.advice = body.advice;
//     if (body.banner !== undefined) updateData.banner = body.banner;
    
//     // Update call to action
//     if (body.callToAction) {
//       updateData.callToAction = {
//         ...existingAd.callToAction.toObject(),
//         ...body.callToAction
//       };
//     }
    
//     // Update products
//     if (body.products !== undefined) {
//       updateData.products = body.products.map((product: any) => ({
//         ...product,
//         id: product.id || uuidv4()
//       }));
//     }

//     const updatedAd = await Advertisement.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       { new: true, runValidators: true }
//     ).lean();
    
//     if (!updatedAd) {
//       return NextResponse.json(
//         { success: false, error: 'Advertisement not found' },
//         { status: 404 }
//       );
//     }

//     console.log('Advertisement updated successfully:', id);

//     return NextResponse.json({
//       success: true,
//       message: 'Advertisement updated successfully',
//       data: updatedAd
//     });

//   } catch (error: any) {
//     console.error('Error updating ad:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: 'Failed to update advertisement',
//         details: process.env.NODE_ENV === 'development' ? error.message : undefined
//       },
//       { status: 500 }
//     );
//   }
// }

// // DELETE advertisement (soft delete)
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();
    
//     const { id } = await params;
    
//     console.log('Deleting advertisement:', id);

//     const deletedAd = await Advertisement.findByIdAndUpdate(
//       id,
//       { isActive: false },
//       { new: true }
//     ).lean();
    
//     if (!deletedAd) {
//       return NextResponse.json(
//         { success: false, error: 'Advertisement not found' },
//         { status: 404 }
//       );
//     }

//     console.log('Advertisement deleted successfully:', id);

//     return NextResponse.json({
//       success: true,
//       message: 'Advertisement deleted successfully',
//       data: deletedAd
//     });

//   } catch (error: any) {
//     console.error('Error deleting ad:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }















import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/Db';
import Advertisement from '@/app/models/AdvertisementModel';
import { v4 as uuidv4 } from 'uuid';

// Helper functions for file handling
import fs from 'fs';
import path from 'path';

// Define uploads directory (outside public folder)
const UPLOADS_BASE_DIR = path.join(process.cwd(), 'uploads');
const ADS_UPLOADS_DIR = path.join(UPLOADS_BASE_DIR, 'advertisements');

/**
 * Ensure uploads directory exists
 */
function ensureUploadsDirectory(): void {
  try {
    // Create base uploads directory if it doesn't exist
    if (!fs.existsSync(UPLOADS_BASE_DIR)) {
      fs.mkdirSync(UPLOADS_BASE_DIR, { recursive: true });
    }
    
    // Create advertisements subdirectory if it doesn't exist
    if (!fs.existsSync(ADS_UPLOADS_DIR)) {
      fs.mkdirSync(ADS_UPLOADS_DIR, { recursive: true });
    }
    
  } catch (error) {
    console.error('Error creating uploads directory:', error);
    throw error;
  }
}

/**
 * Save file to uploads directory
 */
async function saveFileToUploads(file: File, subfolder: string = ''): Promise<string> {
  try {
    // Ensure directory exists
    ensureUploadsDirectory();
    
    // Generate unique filename
    const originalName = file.name;
    const fileExtension = originalName.split('.').pop() || '';
    const uniqueName = `${uuidv4()}.${fileExtension}`;
    
    // Determine target directory
    let targetDir = ADS_UPLOADS_DIR;
    if (subfolder) {
      targetDir = path.join(ADS_UPLOADS_DIR, subfolder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save file
    const filePath = path.join(targetDir, uniqueName);
    fs.writeFileSync(filePath, buffer);
    
    // Return the URL path that will be used to access the file
    const urlPath = subfolder 
      ? `/api/uploads/advertisements/${subfolder}/${uniqueName}`
      : `/api/uploads/advertisements/${uniqueName}`;
    
    return urlPath;
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
}

/**
 * Delete file from uploads directory
 */
async function deleteFileFromUploads(fileUrl: string): Promise<boolean> {
  try {
    if (!fileUrl) return false;
    
    // Extract filename and path from URL
    let filePath = '';
    
    if (fileUrl.includes('/api/uploads/advertisements/')) {
      const pathAfterApi = fileUrl.split('/api/uploads/advertisements/')[1];
      filePath = path.join(ADS_UPLOADS_DIR, pathAfterApi);
    } else if (fileUrl.includes('/uploads/advertisements/')) {
      const pathAfterUploads = fileUrl.split('/uploads/advertisements/')[1];
      filePath = path.join(ADS_UPLOADS_DIR, pathAfterUploads);
    } else {
      // For backward compatibility
      const parts = fileUrl.split('/');
      const filename = parts[parts.length - 1];
      filePath = path.join(ADS_UPLOADS_DIR, filename);
    }
    
    if (!filePath) return false;
    
    // Check if file exists and delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

// Initialize uploads directory on import
ensureUploadsDirectory();

// Helper function to get params
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await context.params;
    const ad = await Advertisement.findById(id).lean();
    
    if (!ad) {
      return NextResponse.json(
        { success: false, error: 'Advertisement not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ad
    });

  } catch (error: any) {
    console.error('Error fetching ad:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update advertisement
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await context.params;
    
    // Check if advertisement exists
    const existingAd = await Advertisement.findById(id);
    if (!existingAd) {
      return NextResponse.json(
        { success: false, error: 'Advertisement not found' },
        { status: 404 }
      );
    }
    
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle form data with file uploads
      return await handleFormDataUpdate(request, id, existingAd);
    } else {
      // Handle JSON data (backward compatibility)
      return await handleJsonUpdate(request, id, existingAd);
    }

  } catch (error: any) {
    console.error('Error updating ad:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Advertisement with this name already exists'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update advertisement',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Handle form data update with file uploads
async function handleFormDataUpdate(
  request: NextRequest, 
  id: string, 
  existingAd: any
) {
  const formData = await request.formData();
  
  console.log('Updating advertisement with form data:', id);
  
  // Extract text fields
  const updateData: any = {};
  
  const heading = formData.get('heading') as string;
  if (heading !== null) updateData.heading = heading.trim();
  
  const stage = formData.get('stage') as string;
  if (stage !== null) updateData.stage = stage;
  
  const tab = formData.get('tab') as string;
  if (tab !== null) updateData.tab = tab;
  
  const guide = formData.get('guide') as string;
  if (guide !== null) updateData.guide = guide.trim();
  
  const companyName = formData.get('companyName') as string;
  if (companyName !== null) updateData.companyName = companyName.trim();
  
  const description = formData.get('description') as string;
  if (description !== null) updateData.description = description.trim();
  
  const advice = formData.get('advice') as string;
  if (advice !== null) updateData.advice = advice.trim();
  
  // Extract call to action fields
  const callToAction: any = {};
  const buyNowLink = formData.get('callToAction.buyNowLink') as string;
  if (buyNowLink !== null) callToAction.buyNowLink = buyNowLink.trim();
  
  const visitWebsiteLink = formData.get('callToAction.visitWebsiteLink') as string;
  if (visitWebsiteLink !== null) callToAction.visitWebsiteLink = visitWebsiteLink.trim();
  
  const callNowNumber = formData.get('callToAction.callNowNumber') as string;
  if (callNowNumber !== null) callToAction.callNowNumber = callNowNumber.trim();
  
  const whatsappNowNumber = formData.get('callToAction.whatsappNowNumber') as string;
  if (whatsappNowNumber !== null) callToAction.whatsappNowNumber = whatsappNowNumber.trim();
  
  const price = formData.get('callToAction.price') as string;
  if (price !== null) callToAction.price = parseFloat(price) || 0;
  
  const selectedAction = formData.get('callToAction.selectedAction') as string;
  if (selectedAction !== null) callToAction.selectedAction = selectedAction;
  
  if (Object.keys(callToAction).length > 0) {
    updateData.callToAction = { ...existingAd.callToAction.toObject(), ...callToAction };
  }
  
  // Extract products (if any)
  const productsJson = formData.get('products') as string;
  if (productsJson !== null) {
    const products = JSON.parse(productsJson);
    updateData.products = products.map((product: any) => ({
      ...product,
      id: product.id || uuidv4()
    }));
  }
  
  // Handle file uploads
  // Upload new company logo if provided
  const companyLogoFile = formData.get('companyLogo') as File | null;
  const existingCompanyLogo = formData.get('existingCompanyLogo') as string;
  
  if (companyLogoFile && companyLogoFile.size > 0) {
    // Delete old logo if exists
    const logoToDelete = existingCompanyLogo || existingAd.companyLogo;
    if (logoToDelete) {
      await deleteFileFromUploads(logoToDelete);
    }
    
    // Upload new logo
    try {
      updateData.companyLogo = await saveFileToUploads(companyLogoFile, 'logos');
      console.log('New company logo uploaded:', updateData.companyLogo);
    } catch (uploadError) {
      console.error('Company logo upload error:', uploadError);
    }
  } else if (existingCompanyLogo !== null) {
    updateData.companyLogo = existingCompanyLogo;
  }
  
  // Upload new banner if provided
  const bannerFile = formData.get('banner') as File | null;
  const existingBanner = formData.get('existingBanner') as string;
  
  if (bannerFile && bannerFile.size > 0) {
    // Delete old banner if exists
    const bannerToDelete = existingBanner || existingAd.banner;
    if (bannerToDelete) {
      await deleteFileFromUploads(bannerToDelete);
    }
    
    // Upload new banner
    try {
      updateData.banner = await saveFileToUploads(bannerFile, 'banners');
      console.log('New banner uploaded:', updateData.banner);
    } catch (uploadError) {
      console.error('Banner upload error:', uploadError);
    }
  } else if (existingBanner !== null) {
    updateData.banner = existingBanner;
  }
  
  // Update isActive if provided
  const isActive = formData.get('isActive');
  if (isActive !== null) {
    updateData.isActive = isActive === 'true';
  }
  
  const updatedAd = await Advertisement.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).lean();
  
  if (!updatedAd) {
    return NextResponse.json(
      { success: false, error: 'Advertisement not found' },
      { status: 404 }
    );
  }
  
  console.log('Advertisement updated successfully:', id);
  
  return NextResponse.json({
    success: true,
    message: 'Advertisement updated successfully',
    data: updatedAd
  });
}

// Handle JSON update (backward compatibility)
async function handleJsonUpdate(
  request: NextRequest, 
  id: string, 
  existingAd: any
) {
  const body = await request.json();
  
  console.log('Updating advertisement with JSON:', id, body);
  
  // Update fields
  const updateData: any = {};
  
  // Only update provided fields
  if (body.heading !== undefined) updateData.heading = body.heading.trim();
  if (body.stage !== undefined) updateData.stage = body.stage;
  if (body.tab !== undefined) updateData.tab = body.tab;
  if (body.guide !== undefined) updateData.guide = body.guide.trim();
  if (body.companyLogo !== undefined) updateData.companyLogo = body.companyLogo;
  if (body.companyName !== undefined) updateData.companyName = body.companyName.trim();
  if (body.description !== undefined) updateData.description = body.description.trim();
  if (body.advice !== undefined) updateData.advice = body.advice.trim();
  if (body.banner !== undefined) updateData.banner = body.banner;
  
  // Update call to action
  if (body.callToAction) {
    updateData.callToAction = {
      ...existingAd.callToAction.toObject(),
      ...body.callToAction
    };
  }
  
  // Update products
  if (body.products !== undefined) {
    updateData.products = body.products.map((product: any) => ({
      ...product,
      id: product.id || uuidv4()
    }));
  }
  
  // Update isActive if provided
  if (body.isActive !== undefined) {
    updateData.isActive = body.isActive;
  }

  const updatedAd = await Advertisement.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();
  
  if (!updatedAd) {
    return NextResponse.json(
      { success: false, error: 'Advertisement not found' },
      { status: 404 }
    );
  }

  console.log('Advertisement updated successfully:', id);

  return NextResponse.json({
    success: true,
    message: 'Advertisement updated successfully',
    data: updatedAd
  });
}

// DELETE advertisement (hard delete with file cleanup)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await context.params;
    
    console.log('Deleting advertisement:', id);

    // Find the advertisement first to get file URLs
    const ad = await Advertisement.findById(id);
    if (!ad) {
      return NextResponse.json(
        { success: false, error: 'Advertisement not found' },
        { status: 404 }
      );
    }
    
    // Delete associated files
    if (ad.companyLogo) {
      await deleteFileFromUploads(ad.companyLogo);
    }
    
    if (ad.banner) {
      await deleteFileFromUploads(ad.banner);
    }
    
    // Delete from database
    const deletedAd = await Advertisement.findByIdAndDelete(id).lean();
    
    if (!deletedAd) {
      return NextResponse.json(
        { success: false, error: 'Advertisement not found' },
        { status: 404 }
      );
    }

    console.log('Advertisement deleted successfully:', id);

    return NextResponse.json({
      success: true,
      message: 'Advertisement deleted successfully',
      data: deletedAd
    });

  } catch (error: any) {
    console.error('Error deleting ad:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}