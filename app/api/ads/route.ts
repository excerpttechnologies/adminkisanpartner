

// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '../../lib/Db';
// import Advertisement from '../../models/AdvertisementModel';
// import { v4 as uuidv4 } from 'uuid';

// // GET all advertisements with filtering
// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const searchParams = request.nextUrl.searchParams;
//     const tab = searchParams.get('tab') || 'tab01';
//     const stage = searchParams.get('stage');
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '20');
//     const skip = (page - 1) * limit;

//     // Build query
//     const query: any = { isActive: true };
    
//     if (tab) {
//       query.tab = tab;
//     }
    
//     if (stage) {
//       query.stage = stage;
//     }

//     console.log('Fetching ads with query:', { query, skip, limit });

//     // Execute query
//     const [ads, total] = await Promise.all([
//       Advertisement.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       Advertisement.countDocuments(query)
//     ]);

//     console.log(`Found ${ads.length} advertisements`);

//     return NextResponse.json({
//       success: true,
//       data: ads,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });

//   } catch (error: any) {
//     console.error('Error fetching ads:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: 'Failed to fetch advertisements',
//         details: process.env.NODE_ENV === 'development' ? error.message : undefined
//       },
//       { status: 500 }
//     );
//   }
// }

// // POST create new advertisement
// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const body = await request.json();
    
//     console.log('Creating advertisement with data:', {
//       ...body,
//       products: body.products?.length || 0
//     });

//     // Validate required fields
//     if (!body.heading || !body.heading.trim()) {
//       return NextResponse.json(
//         { success: false, error: 'Heading is required' },
//         { status: 400 }
//       );
//     }

//     if (!body.stage) {
//       return NextResponse.json(
//         { success: false, error: 'Stage is required' },
//         { status: 400 }
//       );
//     }

//     // Generate IDs for products if not provided
//     const productsWithIds = body.products?.map((product: any) => ({
//       ...product,
//       id: product.id || uuidv4()
//     })) || [];

//     // Create new advertisement
//     const newAd = new Advertisement({
//       stage: body.stage,
//       tab: body.tab || 'tab01',
//       heading: body.heading,
//       guide: body.guide || '',
//       companyLogo: body.companyLogo || '',
//       companyName: body.companyName || '',
//       description: body.description || '',
//       advice: body.advice || '',
//       banner: body.banner || '',
//       callToAction: {
//         buyNowLink: body.callToAction?.buyNowLink || '',
//         visitWebsiteLink: body.callToAction?.visitWebsiteLink || '',
//         callNowNumber: body.callToAction?.callNowNumber || '',
//         whatsappNowNumber: body.callToAction?.whatsappNowNumber || '',
//         price: body.callToAction?.price || 0,
//         selectedAction: body.callToAction?.selectedAction || 'buyNow',
//       },
//       products: productsWithIds,
//       isActive: true,
//     });

//     const savedAd = await newAd.save();
//     console.log('Advertisement created successfully:', savedAd._id);

//     return NextResponse.json({
//       success: true,
//       message: 'Advertisement created successfully',
//       data: savedAd
//     });

//   } catch (error: any) {
//     console.error('Error creating ad:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         error: 'Failed to create advertisement',
//         details: process.env.NODE_ENV === 'development' ? error.message : undefined
//       },
//       { status: 500 }
//     );
//   }
// }


















import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../lib/Db';
import Advertisement from '../../models/AdvertisementModel';
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
      console.log('Base uploads directory created:', UPLOADS_BASE_DIR);
    }
    
    // Create advertisements subdirectory if it doesn't exist
    if (!fs.existsSync(ADS_UPLOADS_DIR)) {
      fs.mkdirSync(ADS_UPLOADS_DIR, { recursive: true });
      console.log('Advertisements uploads directory created:', ADS_UPLOADS_DIR);
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

// GET all advertisements with filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const tab = searchParams.get('tab') || 'tab01';
    const stage = searchParams.get('stage');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { isActive: true };
    
    if (tab) {
      query.tab = tab;
    }
    
    if (stage) {
      query.stage = stage;
    }

    console.log('Fetching ads with query:', { query, skip, limit });

    // Execute query
    const [ads, total] = await Promise.all([
      Advertisement.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Advertisement.countDocuments(query)
    ]);

    console.log(`Found ${ads.length} advertisements`);

    return NextResponse.json({
      success: true,
      data: ads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Error fetching ads:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch advertisements',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST create new advertisement (with file upload support)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle form data with file uploads
      return await handleFormDataRequest(request);
    } else {
      // Handle JSON data (backward compatibility)
      return await handleJsonRequest(request);
    }

  } catch (error: any) {
    console.error('Error creating ad:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create advertisement',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Handle form data request with file uploads
// async function handleFormDataRequest(request: NextRequest) {
//   const formData = await request.formData();
  
//   console.log('Creating advertisement with form data');
  
//   // Extract text fields
//   const heading = formData.get('heading') as string;
//   const stage = formData.get('stage') as string;
//   const tab = formData.get('tab') as string || 'tab01';
//   const guide = formData.get('guide') as string || '';
//   const companyName = formData.get('companyName') as string || '';
//   const description = formData.get('description') as string || '';
//   const advice = formData.get('advice') as string || '';
  
//   // Extract call to action fields
//   const buyNowLink = formData.get('callToAction.buyNowLink') as string || '';
//   const visitWebsiteLink = formData.get('callToAction.visitWebsiteLink') as string || '';
//   const callNowNumber = formData.get('callToAction.callNowNumber') as string || '';
//   const whatsappNowNumber = formData.get('callToAction.whatsappNowNumber') as string || '';
//   const price = formData.get('callToAction.price') as string || '0';
//   const selectedAction = formData.get('callToAction.selectedAction') as string || 'buyNow';
  
//   // Extract products (if any)
//   const productsJson = formData.get('products') as string;
//   const products = productsJson ? JSON.parse(productsJson) : [];
  
//   // Validate required fields
//   if (!heading || !heading.trim()) {
//     return NextResponse.json(
//       { success: false, error: 'Heading is required' },
//       { status: 400 }
//     );
//   }

//   if (!stage) {
//     return NextResponse.json(
//       { success: false, error: 'Stage is required' },
//       { status: 400 }
//     );
//   }

//   // Handle file uploads
//   let companyLogoUrl = '';
//   let bannerUrl = '';
  
//   // Upload company logo if provided
//   const companyLogoFile = formData.get('companyLogo') as File | null;
//   if (companyLogoFile && companyLogoFile.size > 0) {
//     try {
//       companyLogoUrl = await saveFileToUploads(companyLogoFile, 'logos');
//       console.log('Company logo uploaded:', companyLogoUrl);
//     } catch (uploadError) {
//       console.error('Company logo upload error:', uploadError);
//     }
//   }
  
//   // Upload banner if provided
//   const bannerFile = formData.get('banner') as File | null;
//   if (bannerFile && bannerFile.size > 0) {
//     try {
//       bannerUrl = await saveFileToUploads(bannerFile, 'banners');
//       console.log('Banner uploaded:', bannerUrl);
//     } catch (uploadError) {
//       console.error('Banner upload error:', uploadError);
//     }
//   }
  
//   // Generate IDs for products if not provided
//   const productsWithIds = products?.map((product: any) => ({
//     ...product,
//     id: product.id || uuidv4()
//   })) || [];

//   // Create new advertisement
//   const newAd = new Advertisement({
//     stage: stage,
//     tab: tab,
//     heading: heading.trim(),
//     guide: guide.trim(),
//     companyLogo: companyLogoUrl,
//     companyName: companyName.trim(),
//     description: description.trim(),
//     advice: advice.trim(),
//     banner: bannerUrl,
//     callToAction: {
//       buyNowLink: buyNowLink.trim(),
//       visitWebsiteLink: visitWebsiteLink.trim(),
//       callNowNumber: callNowNumber.trim(),
//       whatsappNowNumber: whatsappNowNumber.trim(),
//       price: parseFloat(price) || 0,
//       selectedAction: selectedAction,
//     },
//     products: productsWithIds,
//     isActive: true,
//   });

//   const savedAd = await newAd.save();
//   console.log('Advertisement created successfully:', savedAd._id);

//   return NextResponse.json({
//     success: true,
//     message: 'Advertisement created successfully',
//     data: savedAd
//   });
// }

// Handle form data request with file uploads
async function handleFormDataRequest(request: NextRequest) {
  const formData = await request.formData();
  
  console.log('Creating advertisement with form data');
  
  // Extract text fields
  const heading = formData.get('heading') as string;
  const stage = formData.get('stage') as string;
  const tab = formData.get('tab') as string || 'tab01';
  const guide = formData.get('guide') as string || '';
  const companyName = formData.get('companyName') as string || '';
  const description = formData.get('description') as string || '';
  const advice = formData.get('advice') as string || '';
  
  // Extract call to action fields
  const buyNowLink = formData.get('callToAction.buyNowLink') as string || '';
  const visitWebsiteLink = formData.get('callToAction.visitWebsiteLink') as string || '';
  const callNowNumber = formData.get('callToAction.callNowNumber') as string || '';
  const whatsappNowNumber = formData.get('callToAction.whatsappNowNumber') as string || '';
  const price = formData.get('callToAction.price') as string || '0';
  const selectedAction = formData.get('callToAction.selectedAction') as string || 'buyNow';
  
  // Extract products (if any)
  const productsJson = formData.get('products') as string;
  const products = productsJson ? JSON.parse(productsJson) : [];
  
  // Validate required fields
  if (!heading || !heading.trim()) {
    return NextResponse.json(
      { success: false, error: 'Heading is required' },
      { status: 400 }
    );
  }

  if (!stage) {
    return NextResponse.json(
      { success: false, error: 'Stage is required' },
      { status: 400 }
    );
  }

  // Handle file uploads
  let companyLogoUrl = '';
  let bannerUrl = '';
  
  // Upload company logo if provided
  const companyLogoFile = formData.get('companyLogo') as File | null;
  if (companyLogoFile && companyLogoFile.size > 0) {
    try {
      companyLogoUrl = await saveFileToUploads(companyLogoFile, 'logos');
      console.log('Company logo uploaded:', companyLogoUrl);
    } catch (uploadError) {
      console.error('Company logo upload error:', uploadError);
    }
  }
  
  // Upload banner if provided
  const bannerFile = formData.get('banner') as File | null;
  if (bannerFile && bannerFile.size > 0) {
    try {
      bannerUrl = await saveFileToUploads(bannerFile, 'banners');
      console.log('Banner uploaded:', bannerUrl);
    } catch (uploadError) {
      console.error('Banner upload error:', uploadError);
    }
  }
  
  // Generate IDs for products if not provided
  const productsWithIds = products?.map((product: any) => ({
    ...product,
    id: product.id || uuidv4()
  })) || [];

  // Create new advertisement
  const newAd = new Advertisement({
    stage: stage,
    tab: tab,
    heading: heading.trim(),
    guide: guide.trim(),
    companyLogo: companyLogoUrl,
    companyName: companyName.trim(),
    description: description.trim(),
    advice: advice.trim(),
    banner: bannerUrl,
    callToAction: {
      buyNowLink: buyNowLink.trim(),
      visitWebsiteLink: visitWebsiteLink.trim(),
      callNowNumber: callNowNumber.trim(),
      whatsappNowNumber: whatsappNowNumber.trim(),
      price: parseFloat(price) || 0,
      selectedAction: selectedAction,
    },
    products: productsWithIds,
    isActive: true,
  });

  const savedAd = await newAd.save();
  console.log('Advertisement created successfully:', savedAd._id);

  return NextResponse.json({
    success: true,
    message: 'Advertisement created successfully',
    data: savedAd
  });
}

// Handle JSON request (backward compatibility)
async function handleJsonRequest(request: NextRequest) {
  const body = await request.json();
  
  console.log('Creating advertisement with JSON data:', {
    ...body,
    products: body.products?.length || 0
  });

  // Validate required fields
  if (!body.heading || !body.heading.trim()) {
    return NextResponse.json(
      { success: false, error: 'Heading is required' },
      { status: 400 }
    );
  }

  if (!body.stage) {
    return NextResponse.json(
      { success: false, error: 'Stage is required' },
      { status: 400 }
    );
  }

  // Generate IDs for products if not provided
  const productsWithIds = body.products?.map((product: any) => ({
    ...product,
    id: product.id || uuidv4()
  })) || [];

  // Create new advertisement
  const newAd = new Advertisement({
    stage: body.stage,
    tab: body.tab || 'tab01',
    heading: body.heading.trim(),
    guide: body.guide || '',
    companyLogo: body.companyLogo || '',
    companyName: body.companyName || '',
    description: body.description || '',
    advice: body.advice || '',
    banner: body.banner || '',
    callToAction: {
      buyNowLink: body.callToAction?.buyNowLink || '',
      visitWebsiteLink: body.callToAction?.visitWebsiteLink || '',
      callNowNumber: body.callToAction?.callNowNumber || '',
      whatsappNowNumber: body.callToAction?.whatsappNowNumber || '',
      price: body.callToAction?.price || 0,
      selectedAction: body.callToAction?.selectedAction || 'buyNow',
    },
    products: productsWithIds,
    isActive: true,
  });

  const savedAd = await newAd.save();
  console.log('Advertisement created successfully:', savedAd._id);

  return NextResponse.json({
    success: true,
    message: 'Advertisement created successfully',
    data: savedAd
  });
}

// PUT - Update advertisement (with file upload support)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const contentType = request.headers.get('content-type') || '';
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Advertisement ID is required' },
        { status: 400 }
      );
    }
    
    // Find existing advertisement
    const existingAd = await Advertisement.findById(id);
    if (!existingAd) {
      return NextResponse.json(
        { success: false, error: 'Advertisement not found' },
        { status: 404 }
      );
    }
    
    if (contentType.includes('multipart/form-data')) {
      return await handleUpdateFormData(request, existingAd);
    } else {
      return await handleUpdateJson(request, existingAd);
    }

  } catch (error: any) {
    console.error('Error updating ad:', error);
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
// async function handleUpdateFormData(request: NextRequest, existingAd: any) {
//   const formData = await request.formData();
  
//   // Extract text fields
//   const updateData: any = {};
  
//   const heading = formData.get('heading') as string;
//   if (heading !== null) updateData.heading = heading.trim();
  
//   const stage = formData.get('stage') as string;
//   if (stage !== null) updateData.stage = stage;
  
//   const tab = formData.get('tab') as string;
//   if (tab !== null) updateData.tab = tab;
  
//   const guide = formData.get('guide') as string;
//   if (guide !== null) updateData.guide = guide.trim();
  
//   const companyName = formData.get('companyName') as string;
//   if (companyName !== null) updateData.companyName = companyName.trim();
  
//   const description = formData.get('description') as string;
//   if (description !== null) updateData.description = description.trim();
  
//   const advice = formData.get('advice') as string;
//   if (advice !== null) updateData.advice = advice.trim();
  
//   // Extract call to action fields
//   const callToAction: any = {};
//   const buyNowLink = formData.get('callToAction.buyNowLink') as string;
//   if (buyNowLink !== null) callToAction.buyNowLink = buyNowLink.trim();
  
//   const visitWebsiteLink = formData.get('callToAction.visitWebsiteLink') as string;
//   if (visitWebsiteLink !== null) callToAction.visitWebsiteLink = visitWebsiteLink.trim();
  
//   const callNowNumber = formData.get('callToAction.callNowNumber') as string;
//   if (callNowNumber !== null) callToAction.callNowNumber = callNowNumber.trim();
  
//   const whatsappNowNumber = formData.get('callToAction.whatsappNowNumber') as string;
//   if (whatsappNowNumber !== null) callToAction.whatsappNowNumber = whatsappNowNumber.trim();
  
//   const price = formData.get('callToAction.price') as string;
//   if (price !== null) callToAction.price = parseFloat(price) || 0;
  
//   const selectedAction = formData.get('callToAction.selectedAction') as string;
//   if (selectedAction !== null) callToAction.selectedAction = selectedAction;
  
//   if (Object.keys(callToAction).length > 0) {
//     updateData.callToAction = { ...existingAd.callToAction, ...callToAction };
//   }
  
//   // Extract products (if any)
//   const productsJson = formData.get('products') as string;
//   if (productsJson !== null) {
//     const products = JSON.parse(productsJson);
//     updateData.products = products.map((product: any) => ({
//       ...product,
//       id: product.id || uuidv4()
//     }));
//   }
  
//   // Handle file uploads
//   // Upload new company logo if provided
//   const companyLogoFile = formData.get('companyLogo') as File | null;
//   const existingCompanyLogo = formData.get('existingCompanyLogo') as string;
  
//   if (companyLogoFile && companyLogoFile.size > 0) {
//     // Delete old logo if exists
//     const logoToDelete = existingCompanyLogo || existingAd.companyLogo;
//     if (logoToDelete) {
//       await deleteFileFromUploads(logoToDelete);
//     }
    
//     // Upload new logo
//     try {
//       updateData.companyLogo = await saveFileToUploads(companyLogoFile, 'logos');
//       console.log('New company logo uploaded:', updateData.companyLogo);
//     } catch (uploadError) {
//       console.error('Company logo upload error:', uploadError);
//     }
//   } else if (existingCompanyLogo !== null) {
//     updateData.companyLogo = existingCompanyLogo;
//   }
  
//   // Upload new banner if provided
//   const bannerFile = formData.get('banner') as File | null;
//   const existingBanner = formData.get('existingBanner') as string;
  
//   if (bannerFile && bannerFile.size > 0) {
//     // Delete old banner if exists
//     const bannerToDelete = existingBanner || existingAd.banner;
//     if (bannerToDelete) {
//       await deleteFileFromUploads(bannerToDelete);
//     }
    
//     // Upload new banner
//     try {
//       updateData.banner = await saveFileToUploads(bannerFile, 'banners');
//       console.log('New banner uploaded:', updateData.banner);
//     } catch (uploadError) {
//       console.error('Banner upload error:', uploadError);
//     }
//   } else if (existingBanner !== null) {
//     updateData.banner = existingBanner;
//   }
  
//   // Update isActive if provided
//   const isActive = formData.get('isActive');
//   if (isActive !== null) {
//     updateData.isActive = isActive === 'true';
//   }
  
//   const updatedAd = await Advertisement.findByIdAndUpdate(
//     existingAd._id,
//     updateData,
//     { new: true, runValidators: true }
//   );
  
//   console.log('Advertisement updated successfully:', updatedAd._id);
  
//   return NextResponse.json({
//     success: true,
//     message: 'Advertisement updated successfully',
//     data: updatedAd
//   });
// }

// Handle form data update with file uploads
async function handleUpdateFormData(request: NextRequest, existingAd: any) {
  const formData = await request.formData();
  const searchParams = new URL(request.url).searchParams;
  const id = searchParams.get('id');
  
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
  
  // Extract call to action fields INDIVIDUALLY
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
    updateData.callToAction = { ...existingAd.callToAction, ...callToAction };
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
    existingAd._id,
    updateData,
    { new: true, runValidators: true }
  );
  
  console.log('Advertisement updated successfully:', updatedAd?._id);
  
  return NextResponse.json({
    success: true,
    message: 'Advertisement updated successfully',
    data: updatedAd
  });
}
// Handle JSON update (backward compatibility)
async function handleUpdateJson(request: NextRequest, existingAd: any) {
  const body = await request.json();
  
  const updateData: any = { ...body };
  
  // Clean up text fields
  if (updateData.heading) updateData.heading = updateData.heading.trim();
  if (updateData.guide) updateData.guide = updateData.guide.trim();
  if (updateData.companyName) updateData.companyName = updateData.companyName.trim();
  if (updateData.description) updateData.description = updateData.description.trim();
  if (updateData.advice) updateData.advice = updateData.advice.trim();
  
  // Handle products
  if (updateData.products) {
    updateData.products = updateData.products.map((product: any) => ({
      ...product,
      id: product.id || uuidv4()
    }));
  }
  
  const updatedAd = await Advertisement.findByIdAndUpdate(
    existingAd._id,
    updateData,
    { new: true, runValidators: true }
  );
  
  console.log('Advertisement updated successfully:', updatedAd._id);
  
  return NextResponse.json({
    success: true,
    message: 'Advertisement updated successfully',
    data: updatedAd
  });
}

// DELETE - Delete advertisement
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Advertisement ID is required' },
        { status: 400 }
      );
    }
    
    // Find existing advertisement
    const existingAd = await Advertisement.findById(id);
    if (!existingAd) {
      return NextResponse.json(
        { success: false, error: 'Advertisement not found' },
        { status: 404 }
      );
    }
    
    // Delete associated files
    if (existingAd.companyLogo) {
      await deleteFileFromUploads(existingAd.companyLogo);
    }
    
    if (existingAd.banner) {
      await deleteFileFromUploads(existingAd.banner);
    }
    
    // Delete from database
    await Advertisement.findByIdAndDelete(id);
    
    console.log('Advertisement deleted successfully:', id);
    
    return NextResponse.json({
      success: true,
      message: 'Advertisement deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting ad:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete advertisement',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}