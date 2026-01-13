


// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Slider from "@/app/models/Slider";
// import { writeFile } from "fs/promises";
// import { join } from "path";
// import fs from "fs";
// import { v4 as uuidv4 } from "uuid";

// // Helper function to upload image (using your multer-like approach)
// async function uploadImage(file: File): Promise<string> {
//   try {
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);
    
//     // Generate unique filename
//     const fileExtension = file.name.split('.').pop();
//     const uniqueName = `${uuidv4()}${fileExtension ? '.' + fileExtension : ''}`;
//     const uploadPath = join(process.cwd(), 'public/uploads/ads');
    
//     // Ensure directory exists
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
    
//     const filepath = join(uploadPath, uniqueName);
    
//     // Write file
//     await writeFile(filepath, buffer);
    
//     // Return relative path for web access
//     return `/uploads/ads/${uniqueName}`;
//   } catch (error) {
//     console.error("Upload error:", error);
//     throw new Error("Failed to upload image");
//   }
// }

// // Helper function to delete image
// function deleteImage(imagePath: string): void {
//   try {
//     const fullPath = join(process.cwd(), 'public', imagePath);
//     if (fs.existsSync(fullPath)) {
//       fs.unlinkSync(fullPath);
//     }
//   } catch (error) {
//     console.error("Delete image error:", error);
//   }
// }

// // POST - Create new slider with image upload
// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
    
//     const formData = await req.formData();
//     const name = formData.get('name') as string;
//     const imageFile = formData.get('image') as File;
    
//     if (!name || !imageFile) {
//       return NextResponse.json(
//         { error: "Name and image are required" },
//         { status: 400 }
//       );
//     }
    
//     // Validate file type
//     const allowedTypes = /jpeg|jpg|png|gif|webp/;
//     const fileExtension = imageFile.name.split('.').pop()?.toLowerCase() || '';
//     const mimeType = imageFile.type;
    
//     if (!allowedTypes.test(fileExtension) || !allowedTypes.test(mimeType)) {
//       return NextResponse.json(
//         { error: "Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed" },
//         { status: 400 }
//       );
//     }
    
//     // Validate file size (10MB limit)
//     if (imageFile.size > 10 * 1024 * 1024) {
//       return NextResponse.json(
//         { error: "Image must be less than 10MB" },
//         { status: 400 }
//       );
//     }
    
//     // Upload image
//     const imagePath = await uploadImage(imageFile);
    
//     // Create slider in database
//     const slider = await Slider.create({
//       name,
//       image: imagePath,
//     });
    
//     return NextResponse.json(slider, { status: 201 });
//   } catch (error: any) {
//     console.error("POST SLIDER ERROR:", error.message);
//     return NextResponse.json(
//       { error: error.message || "Failed to create slider" },
//       { status: 500 }
//     );
//   }
// }

// // GET - Fetch all sliders
// export async function GET() {
//   try {
//     await connectDB();
//     const sliders = await Slider.find().sort({ createdAt: -1 });
//     return NextResponse.json(sliders);
//   } catch (error: any) {
//     console.error("GET SLIDER ERROR:", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// // PUT - Update slider
// export async function PUT(req: NextRequest) {
//   try {
//     await connectDB();
    
//     const formData = await req.formData();
//     const id = formData.get('id') as string;
//     const name = formData.get('name') as string;
//     const imageFile = formData.get('image') as File;
    
//     if (!id) {
//       return NextResponse.json(
//         { error: "Slider ID is required" },
//         { status: 400 }
//       );
//     }
    
//     const slider = await Slider.findById(id);
//     if (!slider) {
//       return NextResponse.json(
//         { error: "Slider not found" },
//         { status: 404 }
//       );
//     }
    
//     const updateData: any = { name };
    
//     // If new image is provided, upload it and delete old one
//     if (imageFile && imageFile.size > 0) {
//       // Validate file type
//       const allowedTypes = /jpeg|jpg|png|gif|webp/;
//       const fileExtension = imageFile.name.split('.').pop()?.toLowerCase() || '';
//       const mimeType = imageFile.type;
      
//       if (!allowedTypes.test(fileExtension) || !allowedTypes.test(mimeType)) {
//         return NextResponse.json(
//           { error: "Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed" },
//           { status: 400 }
//         );
//       }
      
//       // Validate file size (10MB limit)
//       if (imageFile.size > 10 * 1024 * 1024) {
//         return NextResponse.json(
//           { error: "Image must be less than 10MB" },
//           { status: 400 }
//         );
//       }
      
//       // Delete old image
//       if (slider.image && slider.image.startsWith('/uploads/ads/')) {
//         deleteImage(slider.image);
//       }
      
//       // Upload new image
//       const imagePath = await uploadImage(imageFile);
//       updateData.image = imagePath;
//     }
    
//     const updatedSlider = await Slider.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true }
//     );
    
//     return NextResponse.json(updatedSlider);
//   } catch (error: any) {
//     console.error("PUT SLIDER ERROR:", error.message);
//     return NextResponse.json(
//       { error: error.message || "Failed to update slider" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Delete slider
// export async function DELETE(req: NextRequest) {
//   try {
//     await connectDB();
    
//     const { id } = await req.json();
    
//     if (!id) {
//       return NextResponse.json(
//         { error: "Slider ID is required" },
//         { status: 400 }
//       );
//     }
    
//     const slider = await Slider.findById(id);
//     if (!slider) {
//       return NextResponse.json(
//         { error: "Slider not found" },
//         { status: 404 }
//       );
//     }
    
//     // Delete image file
//     if (slider.image && slider.image.startsWith('/uploads/ads/')) {
//       deleteImage(slider.image);
//     }
    
//     // Delete from database
//     await Slider.findByIdAndDelete(id);
    
//     return NextResponse.json(
//       { message: "Slider deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("DELETE SLIDER ERROR:", error.message);
//     return NextResponse.json(
//       { error: error.message || "Failed to delete slider" },
//       { status: 500 }
//     );
//   }
// }






import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Slider from "@/app/models/Slider";
import { writeFile } from "fs/promises";
import { join } from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Helper function to upload image
async function uploadImage(file: File): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileExtension = file.name.split('.').pop();
    const uniqueName = `${uuidv4()}${fileExtension ? '.' + fileExtension : ''}`;
    const uploadPath = join(process.cwd(), 'public/uploads/ads');
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    const filepath = join(uploadPath, uniqueName);
    await writeFile(filepath, buffer);
    
    return `/uploads/ads/${uniqueName}`;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload image");
  }
}

function deleteImage(imagePath: string): void {
  try {
    const fullPath = join(process.cwd(), 'public', imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error("Delete image error:", error);
  }
}

// POST - Create new slider
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const imageFile = formData.get('image') as File;
    
    if (!name || !imageFile) {
      return NextResponse.json(
        { error: "Name and image are required" },
        { status: 400 }
      );
    }
    
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const fileExtension = imageFile.name.split('.').pop()?.toLowerCase() || '';
    const mimeType = imageFile.type;
    
    if (!allowedTypes.test(fileExtension) || !allowedTypes.test(mimeType)) {
      return NextResponse.json(
        { error: "Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed" },
        { status: 400 }
      );
    }
    
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be less than 10MB" },
        { status: 400 }
      );
    }
    
    const imagePath = await uploadImage(imageFile);
    
    // Create slider with role (use provided role or default)
    const slider = await Slider.create({
      name,
      role: role || "General", // Use provided role or default
      image: imagePath,
    });
    
    return NextResponse.json(slider, { status: 201 });
  } catch (error: any) {
    console.error("POST SLIDER ERROR:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to create slider" },
      { status: 500 }
    );
  }
}

// GET - Fetch all sliders
export async function GET() {
  try {
    await connectDB();
    const sliders = await Slider.find().sort({ createdAt: -1 });
    return NextResponse.json(sliders);
  } catch (error: any) {
    console.error("GET SLIDER ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update slider
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    
    const formData = await req.formData();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const imageFile = formData.get('image') as File;
    
    if (!id) {
      return NextResponse.json(
        { error: "Slider ID is required" },
        { status: 400 }
      );
    }
    
    const slider = await Slider.findById(id);
    if (!slider) {
      return NextResponse.json(
        { error: "Slider not found" },
        { status: 404 }
      );
    }
    
    // Update data with role (keep existing if not provided)
    const updateData: any = { 
      name,
      role: role || slider.role || "General" // Use new role, existing role, or default
    };
    
    if (imageFile && imageFile.size > 0) {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const fileExtension = imageFile.name.split('.').pop()?.toLowerCase() || '';
      const mimeType = imageFile.type;
      
      if (!allowedTypes.test(fileExtension) || !allowedTypes.test(mimeType)) {
        return NextResponse.json(
          { error: "Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed" },
          { status: 400 }
        );
      }
      
      if (imageFile.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Image must be less than 10MB" },
          { status: 400 }
        );
      }
      
      if (slider.image && slider.image.startsWith('/uploads/ads/')) {
        deleteImage(slider.image);
      }
      
      const imagePath = await uploadImage(imageFile);
      updateData.image = imagePath;
    }
    
    const updatedSlider = await Slider.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    return NextResponse.json(updatedSlider);
  } catch (error: any) {
    console.error("PUT SLIDER ERROR:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to update slider" },
      { status: 500 }
    );
  }
}

// DELETE - Delete slider
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    
    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json(
        { error: "Slider ID is required" },
        { status: 400 }
      );
    }
    
    const slider = await Slider.findById(id);
    if (!slider) {
      return NextResponse.json(
        { error: "Slider not found" },
        { status: 404 }
      );
    }
    
    if (slider.image && slider.image.startsWith('/uploads/ads/')) {
      deleteImage(slider.image);
    }
    
    await Slider.findByIdAndDelete(id);
    
    return NextResponse.json(
      { message: "Slider deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE SLIDER ERROR:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to delete slider" },
      { status: 500 }
    );
  }
}