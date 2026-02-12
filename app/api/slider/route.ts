















// // import { NextRequest, NextResponse } from "next/server";
// // import connectDB from "@/app/lib/Db";
// // import Slider from "@/app/models/Slider";
// // import { writeFile } from "fs/promises";
// // import { join } from "path";
// // import fs from "fs";
// // import { v4 as uuidv4 } from "uuid";

// // // Helper function to upload image
// // async function uploadImage(file: File): Promise<string> {
// //   try {
// //     const bytes = await file.arrayBuffer();
// //     const buffer = Buffer.from(bytes);
    
// //     const fileExtension = file.name.split('.').pop();
// //     const uniqueName = `${uuidv4()}${fileExtension ? '.' + fileExtension : ''}`;
// //     const uploadPath = join(process.cwd(), 'public/uploads');
    
// //     if (!fs.existsSync(uploadPath)) {
// //       fs.mkdirSync(uploadPath, { recursive: true });
// //     }
    
// //     const filepath = join(uploadPath, uniqueName);
// //     await writeFile(filepath, buffer);
    
// //     return `/uploads/${uniqueName}`;
// //   } catch (error) {
// //     console.error("Upload error:", error);
// //     throw new Error("Failed to upload image");
// //   }
// // }

// // function deleteImage(imagePath: string): void {
// //   try {
// //     const fullPath = join(process.cwd(), 'public', imagePath);
// //     if (fs.existsSync(fullPath)) {
// //       fs.unlinkSync(fullPath);
// //     }
// //   } catch (error) {
// //     console.error("Delete image error:", error);
// //   }
// // }

// // // POST - Create new slider
// // export async function POST(req: NextRequest) {
// //   try {
// //     await connectDB();
    
// //     const formData = await req.formData();
// //     const name = formData.get('name') as string;
// //     const role = formData.get('role') as string;
// //     const imageFile = formData.get('image') as File;
    
// //     if (!name || !imageFile) {
// //       return NextResponse.json(
// //         { error: "Name and image are required" },
// //         { status: 400 }
// //       );
// //     }
    
// //     const allowedTypes = /jpeg|jpg|png|gif|webp/;
// //     const fileExtension = imageFile.name.split('.').pop()?.toLowerCase() || '';
// //     const mimeType = imageFile.type;
    
// //     if (!allowedTypes.test(fileExtension) || !allowedTypes.test(mimeType)) {
// //       return NextResponse.json(
// //         { error: "Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed" },
// //         { status: 400 }
// //       );
// //     }
    
// //     if (imageFile.size > 10 * 1024 * 1024) {
// //       return NextResponse.json(
// //         { error: "Image must be less than 10MB" },
// //         { status: 400 }
// //       );
// //     }
    
// //     const imagePath = await uploadImage(imageFile);
    
// //     // Create slider with role (use provided role or default)
// //     const slider = await Slider.create({
// //       name,
// //       role: role || "General", // Use provided role or default
// //       image: imagePath,
// //     });
    
// //     return NextResponse.json(slider, { status: 201 });
// //   } catch (error: any) {
// //     console.error("POST SLIDER ERROR:", error.message);
// //     return NextResponse.json(
// //       { error: error.message || "Failed to create slider" },
// //       { status: 500 }
// //     );
// //   }
// // }

// // // GET - Fetch all sliders
// // export async function GET() {
// //   try {
// //     await connectDB();
// //     const sliders = await Slider.find().sort({ createdAt: -1 });
// //     return NextResponse.json(sliders);
// //   } catch (error: any) {
// //     console.error("GET SLIDER ERROR:", error.message);
// //     return NextResponse.json({ error: error.message }, { status: 500 });
// //   }
// // }

// // // PUT - Update slider
// // export async function PUT(req: NextRequest) {
// //   try {
// //     await connectDB();
    
// //     const formData = await req.formData();
// //     const id = formData.get('id') as string;
// //     const name = formData.get('name') as string;
// //     const role = formData.get('role') as string;
// //     const imageFile = formData.get('image') as File;
    
// //     if (!id) {
// //       return NextResponse.json(
// //         { error: "Slider ID is required" },
// //         { status: 400 }
// //       );
// //     }
    
// //     const slider = await Slider.findById(id);
// //     if (!slider) {
// //       return NextResponse.json(
// //         { error: "Slider not found" },
// //         { status: 404 }
// //       );
// //     }
    
// //     // Update data with role (keep existing if not provided)
// //     const updateData: any = { 
// //       name,
// //       role: role || slider.role || "General" // Use new role, existing role, or default
// //     };
    
// //     if (imageFile && imageFile.size > 0) {
// //       const allowedTypes = /jpeg|jpg|png|gif|webp/;
// //       const fileExtension = imageFile.name.split('.').pop()?.toLowerCase() || '';
// //       const mimeType = imageFile.type;
      
// //       if (!allowedTypes.test(fileExtension) || !allowedTypes.test(mimeType)) {
// //         return NextResponse.json(
// //           { error: "Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed" },
// //           { status: 400 }
// //         );
// //       }
      
// //       if (imageFile.size > 10 * 1024 * 1024) {
// //         return NextResponse.json(
// //           { error: "Image must be less than 10MB" },
// //           { status: 400 }
// //         );
// //       }
      
// //       if (slider.image && slider.image.startsWith('/uploads/')) {
// //         deleteImage(slider.image);
// //       }
      
// //       const imagePath = await uploadImage(imageFile);
// //       updateData.image = imagePath;
// //     }
    
// //     const updatedSlider = await Slider.findByIdAndUpdate(
// //       id,
// //       updateData,
// //       { new: true }
// //     );
    
// //     return NextResponse.json(updatedSlider);
// //   } catch (error: any) {
// //     console.error("PUT SLIDER ERROR:", error.message);
// //     return NextResponse.json(
// //       { error: error.message || "Failed to update slider" },
// //       { status: 500 }
// //     );
// //   }
// // }

// // // DELETE - Delete slider
// // export async function DELETE(req: NextRequest) {
// //   try {
// //     await connectDB();
    
// //     const { id } = await req.json();
    
// //     if (!id) {
// //       return NextResponse.json(
// //         { error: "Slider ID is required" },
// //         { status: 400 }
// //       );
// //     }
    
// //     const slider = await Slider.findById(id);
// //     if (!slider) {
// //       return NextResponse.json(
// //         { error: "Slider not found" },
// //         { status: 404 }
// //       );
// //     }
    
// //     if (slider.image && slider.image.startsWith('/uploads/')) {
// //       deleteImage(slider.image);
// //     }
    
// //     await Slider.findByIdAndDelete(id);
    
// //     return NextResponse.json(
// //       { message: "Slider deleted successfully" },
// //       { status: 200 }
// //     );
// //   } catch (error: any) {
// //     console.error("DELETE SLIDER ERROR:", error.message);
// //     return NextResponse.json(
// //       { error: error.message || "Failed to delete slider" },
// //       { status: 500 }
// //     );
// //   }
// // }

















// // // app/api/slider/route.ts
// // import { NextRequest, NextResponse } from "next/server";
// // import connectDB from "@/app/lib/Db";
// // import Slider from "@/app/models/Slider";
// // import { writeFile } from "fs/promises";
// // import { join } from "path";
// // import fs from "fs";
// // import { v4 as uuidv4 } from "uuid";

// // // Helper function to upload image
// // async function uploadImage(file: File): Promise<string> {
// //   try {
// //     console.log("Uploading image:", {
// //       name: file.name,
// //       type: file.type,
// //       size: file.size
// //     });

// //     const bytes = await file.arrayBuffer();
// //     const buffer = Buffer.from(bytes);
    
// //     // Get file extension properly
// //     const originalName = file.name;
// //     const fileExtension = originalName.includes('.') 
// //       ? originalName.substring(originalName.lastIndexOf('.')) 
// //       : '';
    
// //     // Generate unique filename
// //     const uniqueName = `${uuidv4()}${fileExtension}`;
// //     const uploadPath = join(process.cwd(), 'public/uploads');
    
// //     console.log("Upload path:", uploadPath);
// //     console.log("Unique filename:", uniqueName);
    
// //     // Ensure upload directory exists
// //     if (!fs.existsSync(uploadPath)) {
// //       fs.mkdirSync(uploadPath, { recursive: true });
// //       console.log("Created upload directory");
// //     }
    
// //     // Save the file
// //     const filepath = join(uploadPath, uniqueName);
// //     await writeFile(filepath, buffer);
// //     console.log("File saved to:", filepath);
    
// //     const imagePath = `/uploads/${uniqueName}`;
// //     console.log("Returning image path:", imagePath);
    
// //     return imagePath;
// //   } catch (error: any) {
// //     console.error("Upload error details:", error);
// //     throw new Error(`Failed to upload image: ${error.message}`);
// //   }
// // }

// // function deleteImage(imagePath: string): void {
// //   try {
// //     // Remove leading slash if present for path joining
// //     const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
// //     const fullPath = join(process.cwd(), 'public', cleanPath);
    
// //     console.log("Attempting to delete image:", fullPath);
    
// //     if (fs.existsSync(fullPath)) {
// //       fs.unlinkSync(fullPath);
// //       console.log("Image deleted successfully:", fullPath);
// //     } else {
// //       console.warn("Image file not found:", fullPath);
// //     }
// //   } catch (error: any) {
// //     console.error("Delete image error:", error.message);
// //   }
// // }

// // // POST - Create new slider
// // export async function POST(req: NextRequest) {
// //   console.log("=== POST SLIDER REQUEST STARTED ===");
  
// //   try {
// //     await connectDB();
// //     console.log("Database connected");
    
// //     const formData = await req.formData();
// //     console.log("FormData received");
    
// //     // Log all form data entries
// //     const entries: Record<string, any> = {};
// //     for (const [key, value] of formData.entries()) {
// //       if (value instanceof File) {
// //         entries[key] = {
// //           name: value.name,
// //           type: value.type,
// //           size: value.size
// //         };
// //       } else {
// //         entries[key] = value;
// //       }
// //     }
// //     console.log("FormData entries:", entries);
    
// //     const name = formData.get('name') as string;
// //     const role = formData.get('role') as string;
// //     const imageFile = formData.get('image') as File;
    
// //     console.log("Parsed data:", { name, role, hasImage: !!imageFile });
    
// //     // Validation
// //     if (!name || !name.trim()) {
// //       console.error("Validation failed: Name is required");
// //       return NextResponse.json(
// //         { error: "Slider name is required" },
// //         { status: 400 }
// //       );
// //     }
    
// //     if (!imageFile || imageFile.size === 0) {
// //       console.error("Validation failed: Image is required");
// //       return NextResponse.json(
// //         { error: "Image is required" },
// //         { status: 400 }
// //       );
// //     }
    
// //     // Validate image file
// //     if (!imageFile.type.startsWith('image/')) {
// //       console.error("Validation failed: File is not an image");
// //       return NextResponse.json(
// //         { error: "File must be an image (JPEG, PNG, GIF, WebP, etc.)" },
// //         { status: 400 }
// //       );
// //     }
    
// //     // Check file size (10MB limit)
// //     const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// //     if (imageFile.size > MAX_FILE_SIZE) {
// //       console.error("Validation failed: Image too large");
// //       return NextResponse.json(
// //         { error: "Image must be less than 10MB" },
// //         { status: 400 }
// //       );
// //     }
    
// //     // Upload image
// //     console.log("Starting image upload...");
// //     let imagePath: string;
// //     try {
// //       imagePath = await uploadImage(imageFile);
// //       console.log("Image uploaded successfully:", imagePath);
// //     } catch (uploadError: any) {
// //       console.error("Image upload failed:", uploadError);
// //       return NextResponse.json(
// //         { error: `Failed to upload image: ${uploadError.message}` },
// //         { status: 500 }
// //       );
// //     }
    
// //     // Create slider in database
// //     console.log("Creating slider in database...");
// //     const sliderData = {
// //       name: name.trim(),
// //       role: (role || "General").trim(),
// //       image: imagePath,
// //     };
    
// //     console.log("Slider data to save:", sliderData);
    
// //     const slider = await Slider.create(sliderData);
// //     console.log("Slider created successfully:", slider._id);
    
// //     // Return success response
// //     const response = NextResponse.json({
// //       success: true,
// //       message: "Slider created successfully",
// //       slider: slider
// //     }, { status: 201 });
    
// //     console.log("=== POST SLIDER REQUEST COMPLETED SUCCESSFULLY ===");
// //     return response;
    
// //   } catch (error: any) {
// //     console.error("POST SLIDER ERROR DETAILS:");
// //     console.error("Error name:", error.name);
// //     console.error("Error message:", error.message);
// //     console.error("Error stack:", error.stack);
    
// //     return NextResponse.json(
// //       { 
// //         error: "Failed to create slider", 
// //         details: error.message,
// //         suggestion: "Check server logs for more details"
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }

// // // GET - Fetch all sliders
// // export async function GET() {
// //   console.log("=== GET SLIDERS REQUEST STARTED ===");
  
// //   try {
// //     await connectDB();
// //     console.log("Database connected");
    
// //     const sliders = await Slider.find().sort({ createdAt: -1 });
// //     console.log(`Found ${sliders.length} sliders`);
    
// //     // Return as array
// //     const response = NextResponse.json(sliders);
    
// //     console.log("=== GET SLIDERS REQUEST COMPLETED SUCCESSFULLY ===");
// //     return response;
    
// //   } catch (error: any) {
// //     console.error("GET SLIDERS ERROR:", error.message);
// //     return NextResponse.json(
// //       { error: "Failed to fetch sliders" },
// //       { status: 500 }
// //     );
// //   }
// // }

// // // PUT - Update slider
// // export async function PUT(req: NextRequest) {
// //   console.log("=== PUT SLIDER REQUEST STARTED ===");
  
// //   try {
// //     await connectDB();
// //     console.log("Database connected");
    
// //     const formData = await req.formData();
// //     const id = formData.get('id') as string;
// //     const name = formData.get('name') as string;
// //     const role = formData.get('role') as string;
// //     const imageFile = formData.get('image') as File;
    
// //     console.log("Update data:", { id, name, role, hasImage: !!imageFile });
    
// //     if (!id) {
// //       console.error("Validation failed: ID is required");
// //       return NextResponse.json(
// //         { error: "Slider ID is required" },
// //         { status: 400 }
// //       );
// //     }
    
// //     const slider = await Slider.findById(id);
// //     if (!slider) {
// //       console.error("Slider not found:", id);
// //       return NextResponse.json(
// //         { error: "Slider not found" },
// //         { status: 404 }
// //       );
// //     }
    
// //     // Update data
// //     const updateData: any = {
// //       name: name ? name.trim() : slider.name,
// //       role: role ? role.trim() : slider.role || "General",
// //     };
    
// //     // Handle image update if provided
// //     if (imageFile && imageFile.size > 0) {
// //       console.log("Processing new image upload...");
      
// //       // Validate image file
// //       if (!imageFile.type.startsWith('image/')) {
// //         console.error("Validation failed: File is not an image");
// //         return NextResponse.json(
// //           { error: "File must be an image" },
// //           { status: 400 }
// //         );
// //       }
      
// //       // Check file size
// //       if (imageFile.size > 10 * 1024 * 1024) {
// //         console.error("Validation failed: Image too large");
// //         return NextResponse.json(
// //           { error: "Image must be less than 10MB" },
// //           { status: 400 }
// //         );
// //       }
      
// //       // Delete old image if exists
// //       if (slider.image) {
// //         console.log("Deleting old image:", slider.image);
// //         deleteImage(slider.image);
// //       }
      
// //       // Upload new image
// //       try {
// //         const imagePath = await uploadImage(imageFile);
// //         updateData.image = imagePath;
// //         console.log("New image uploaded:", imagePath);
// //       } catch (uploadError: any) {
// //         console.error("Image upload failed:", uploadError);
// //         return NextResponse.json(
// //           { error: `Failed to upload image: ${uploadError.message}` },
// //           { status: 500 }
// //         );
// //       }
// //     }
    
// //     console.log("Update data to save:", updateData);
    
// //     const updatedSlider = await Slider.findByIdAndUpdate(
// //       id,
// //       updateData,
// //       { new: true, runValidators: true }
// //     );
    
// //     console.log("Slider updated successfully:", updatedSlider._id);
    
// //     return NextResponse.json({
// //       success: true,
// //       message: "Slider updated successfully",
// //       slider: updatedSlider
// //     });
    
// //   } catch (error: any) {
// //     console.error("PUT SLIDER ERROR:", error.message);
// //     return NextResponse.json(
// //       { error: "Failed to update slider" },
// //       { status: 500 }
// //     );
// //   }
// // }

// // // DELETE - Delete slider
// // export async function DELETE(req: NextRequest) {
// //   console.log("=== DELETE SLIDER REQUEST STARTED ===");
  
// //   try {
// //     await connectDB();
// //     console.log("Database connected");
    
// //     const { id } = await req.json();
// //     console.log("Delete slider ID:", id);
    
// //     if (!id) {
// //       console.error("Validation failed: ID is required");
// //       return NextResponse.json(
// //         { error: "Slider ID is required" },
// //         { status: 400 }
// //       );
// //     }
    
// //     const slider = await Slider.findById(id);
// //     if (!slider) {
// //       console.error("Slider not found:", id);
// //       return NextResponse.json(
// //         { error: "Slider not found" },
// //         { status: 404 }
// //       );
// //     }
    
// //     console.log("Found slider to delete:", slider.name);
    
// //     // Delete associated image file
// //     if (slider.image) {
// //       console.log("Deleting image file:", slider.image);
// //       deleteImage(slider.image);
// //     }
    
// //     await Slider.findByIdAndDelete(id);
// //     console.log("Slider deleted from database");
    
// //     return NextResponse.json({
// //       success: true,
// //       message: "Slider deleted successfully"
// //     }, { status: 200 });
    
// //   } catch (error: any) {
// //     console.error("DELETE SLIDER ERROR:", error.message);
// //     return NextResponse.json(
// //       { error: "Failed to delete slider" },
// //       { status: 500 }
// //     );
// //   }
// // }








// // app/api/slider/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/app/lib/Db";
// import Slider from "@/app/models/Slider";
// import { writeFile } from "fs/promises";
// import { join } from "path";
// import fs from "fs";
// import { v4 as uuidv4 } from "uuid";

// // Helper function to upload image
// async function uploadImage(file: File): Promise<string> {
//   try {
//     console.log("Uploading image:", {
//       name: file.name,
//       type: file.type,
//       size: file.size
//     });

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);
    
//     // Get file extension properly
//     const originalName = file.name;
//     const fileExtension = originalName.includes('.') 
//       ? originalName.substring(originalName.lastIndexOf('.')) 
//       : '.jpg'; // Default extension
    
//     // Generate unique filename
//     const uniqueName = `${uuidv4()}${fileExtension}`;
    
//     // Define proper upload directory
//     const uploadDir = join(process.cwd(), 'public', 'uploads');
    
//     console.log("Upload directory:", uploadDir);
//     console.log("Unique filename:", uniqueName);
    
//     // Ensure upload directory exists
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//       console.log("Created upload directory:", uploadDir);
//     }
    
//     // Save the file
//     const filepath = join(uploadDir, uniqueName);
//     await writeFile(filepath, buffer);
//     console.log("File saved successfully to:", filepath);
    
//     // Return correct path that browser can access
//     const imagePath = `/uploads/${uniqueName}`;
//     console.log("Returning image path for browser:", imagePath);
    
//     // Verify file exists
//     if (fs.existsSync(filepath)) {
//       const stats = fs.statSync(filepath);
//       console.log("File verification - Size:", stats.size, "bytes");
//     } else {
//       console.error("ERROR: File was not created at path:", filepath);
//     }
    
//     return imagePath;
//   } catch (error: any) {
//     console.error("Upload error details:", {
//       message: error.message,
//       stack: error.stack,
//       code: error.code
//     });
//     throw new Error(`Failed to upload image: ${error.message}`);
//   }
// }

// function deleteImage(imagePath: string): void {
//   try {
//     // Remove leading slash if present
//     const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
//     const fullPath = join(process.cwd(), 'public', cleanPath);
    
//     console.log("Attempting to delete image:", fullPath);
    
//     if (fs.existsSync(fullPath)) {
//       fs.unlinkSync(fullPath);
//       console.log("Image deleted successfully:", fullPath);
//     } else {
//       console.warn("Image file not found:", fullPath);
//     }
//   } catch (error: any) {
//     console.error("Delete image error:", error.message);
//   }
// }

// // POST - Create new slider
// export async function POST(req: NextRequest) {
//   console.log("=== POST SLIDER REQUEST STARTED ===");
  
//   let imagePath = "";
  
//   try {
//     await connectDB();
//     console.log("Database connected");
    
//     const formData = await req.formData();
//     console.log("FormData received");
    
//     const name = formData.get('name') as string;
//     const role = formData.get('role') as string;
//     const imageFile = formData.get('image') as File;
    
//     console.log("Parsed data:", { name, role, hasImage: !!imageFile });
    
//     // Validation
//     if (!name || !name.trim()) {
//       console.error("Validation failed: Name is required");
//       return NextResponse.json(
//         { error: "Slider name is required" },
//         { status: 400 }
//       );
//     }
    
//     if (!imageFile || imageFile.size === 0) {
//       console.error("Validation failed: Image is required");
//       return NextResponse.json(
//         { error: "Image is required" },
//         { status: 400 }
//       );
//     }
    
//     // Validate image file
//     if (!imageFile.type.startsWith('image/')) {
//       console.error("Validation failed: File is not an image");
//       return NextResponse.json(
//         { error: "File must be an image (JPEG, PNG, GIF, WebP, etc.)" },
//         { status: 400 }
//       );
//     }
    
//     // Check file size (10MB limit)
//     const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
//     if (imageFile.size > MAX_FILE_SIZE) {
//       console.error("Validation failed: Image too large");
//       return NextResponse.json(
//         { error: "Image must be less than 10MB" },
//         { status: 400 }
//       );
//     }
    
//     // Upload image FIRST before database operation
//     console.log("Starting image upload...");
//     try {
//       imagePath = await uploadImage(imageFile);
//       console.log("Image uploaded successfully to path:", imagePath);
//     } catch (uploadError: any) {
//       console.error("Image upload failed:", uploadError);
//       return NextResponse.json(
//         { error: `Failed to upload image: ${uploadError.message}` },
//         { status: 500 }
//       );
//     }
    
//     // Create slider in database with image path
//     console.log("Creating slider in database...");
//     const sliderData = {
//       name: name.trim(),
//       role: (role || "General").trim(),
//       image: imagePath,
//     };
    
//     console.log("Slider data to save:", sliderData);
    
//     const slider = await Slider.create(sliderData);
//     console.log("Slider created successfully:", {
//       id: slider._id,
//       name: slider.name,
//       imagePath: slider.image
//     });
    
//     // Return success response
//     const response = NextResponse.json({
//       success: true,
//       message: "Slider created successfully",
//       slider: slider
//     }, { status: 201 });
    
//     console.log("=== POST SLIDER REQUEST COMPLETED SUCCESSFULLY ===");
//     return response;
    
//   } catch (error: any) {
//     console.error("POST SLIDER ERROR DETAILS:");
//     console.error("Error name:", error.name);
//     console.error("Error message:", error.message);
//     console.error("Error stack:", error.stack);
    
//     // Clean up file if database operation fails
//     if (imagePath) {
//       console.log("Cleaning up uploaded image due to error:", imagePath);
//       deleteImage(imagePath);
//     }
    
//     return NextResponse.json(
//       { 
//         error: "Failed to create slider", 
//         details: error.message
//       },
//       { status: 500 }
//     );
//   }
// }

// // GET - Fetch all sliders
// export async function GET() {
//   console.log("=== GET SLIDERS REQUEST STARTED ===");
  
//   try {
//     await connectDB();
//     console.log("Database connected");
    
//     const sliders = await Slider.find().sort({ createdAt: -1 });
//     console.log(`Found ${sliders.length} sliders`);
    
//     // Log first slider image path for debugging
//     if (sliders.length > 0) {
//       console.log("First slider image path:", sliders[0].image);
//     }
    
//     return NextResponse.json(sliders);
    
//   } catch (error: any) {
//     console.error("GET SLIDERS ERROR:", error.message);
//     return NextResponse.json(
//       { error: "Failed to fetch sliders" },
//       { status: 500 }
//     );
//   }
// }

// // PUT - Update slider
// export async function PUT(req: NextRequest) {
//   console.log("=== PUT SLIDER REQUEST STARTED ===");
  
//   let newImagePath = "";
  
//   try {
//     await connectDB();
//     console.log("Database connected");
    
//     const formData = await req.formData();
//     const id = formData.get('id') as string;
//     const name = formData.get('name') as string;
//     const role = formData.get('role') as string;
//     const imageFile = formData.get('image') as File;
    
//     console.log("Update data:", { id, name, role, hasImage: !!imageFile });
    
//     if (!id) {
//       console.error("Validation failed: ID is required");
//       return NextResponse.json(
//         { error: "Slider ID is required" },
//         { status: 400 }
//       );
//     }
    
//     const slider = await Slider.findById(id);
//     if (!slider) {
//       console.error("Slider not found:", id);
//       return NextResponse.json(
//         { error: "Slider not found" },
//         { status: 404 }
//       );
//     }
    
//     // Update data
//     const updateData: any = {
//       name: name ? name.trim() : slider.name,
//       role: role ? role.trim() : slider.role || "General",
//     };
    
//     // Handle image update if provided
//     if (imageFile && imageFile.size > 0) {
//       console.log("Processing new image upload...");
      
//       // Validate image file
//       if (!imageFile.type.startsWith('image/')) {
//         console.error("Validation failed: File is not an image");
//         return NextResponse.json(
//           { error: "File must be an image" },
//           { status: 400 }
//         );
//       }
      
//       // Check file size
//       if (imageFile.size > 10 * 1024 * 1024) {
//         console.error("Validation failed: Image too large");
//         return NextResponse.json(
//           { error: "Image must be less than 10MB" },
//           { status: 400 }
//         );
//       }
      
//       // Upload new image first
//       try {
//         newImagePath = await uploadImage(imageFile);
//         updateData.image = newImagePath;
//         console.log("New image uploaded:", newImagePath);
//       } catch (uploadError: any) {
//         console.error("Image upload failed:", uploadError);
//         return NextResponse.json(
//           { error: `Failed to upload image: ${uploadError.message}` },
//           { status: 500 }
//         );
//       }
//     }
    
//     console.log("Update data to save:", updateData);
    
//     const updatedSlider = await Slider.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true, runValidators: true }
//     );
    
//     console.log("Slider updated successfully:", updatedSlider._id);
    
//     // Delete old image after successful update
//     if (imageFile && imageFile.size > 0 && slider.image) {
//       console.log("Deleting old image:", slider.image);
//       deleteImage(slider.image);
//     }
    
//     return NextResponse.json({
//       success: true,
//       message: "Slider updated successfully",
//       slider: updatedSlider
//     });
    
//   } catch (error: any) {
//     console.error("PUT SLIDER ERROR:", error.message);
    
//     // Clean up new image if update fails
//     if (newImagePath) {
//       console.log("Cleaning up uploaded image due to error:", newImagePath);
//       deleteImage(newImagePath);
//     }
    
//     return NextResponse.json(
//       { error: "Failed to update slider" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Delete slider
// export async function DELETE(req: NextRequest) {
//   console.log("=== DELETE SLIDER REQUEST STARTED ===");
  
//   try {
//     await connectDB();
//     console.log("Database connected");
    
//     const { id } = await req.json();
//     console.log("Delete slider ID:", id);
    
//     if (!id) {
//       console.error("Validation failed: ID is required");
//       return NextResponse.json(
//         { error: "Slider ID is required" },
//         { status: 400 }
//       );
//     }
    
//     const slider = await Slider.findById(id);
//     if (!slider) {
//       console.error("Slider not found:", id);
//       return NextResponse.json(
//         { error: "Slider not found" },
//         { status: 404 }
//       );
//     }
    
//     console.log("Found slider to delete:", slider.name);
    
//     // Delete associated image file
//     if (slider.image) {
//       console.log("Deleting image file:", slider.image);
//       deleteImage(slider.image);
//     }
    
//     await Slider.findByIdAndDelete(id);
//     console.log("Slider deleted from database");
    
//     return NextResponse.json({
//       success: true,
//       message: "Slider deleted successfully"
//     }, { status: 200 });
    
//   } catch (error: any) {
//     console.error("DELETE SLIDER ERROR:", error.message);
//     return NextResponse.json(
//       { error: "Failed to delete slider" },
//       { status: 500 }
//     );
//   }
// }









import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/Db";
import Slider from "@/app/models/Slider";
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from "uuid";

// Define uploads directory (outside public folder)
const UPLOADS_BASE_DIR = path.join(process.cwd(), 'uploads');
const SLIDERS_UPLOADS_DIR = path.join(UPLOADS_BASE_DIR, 'sliders');

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
    
    // Create sliders subdirectory if it doesn't exist
    if (!fs.existsSync(SLIDERS_UPLOADS_DIR)) {
      fs.mkdirSync(SLIDERS_UPLOADS_DIR, { recursive: true });
      console.log('Sliders uploads directory created:', SLIDERS_UPLOADS_DIR);
    }
    
  } catch (error) {
    console.error('Error creating uploads directory:', error);
    throw error;
  }
}

/**
 * Save image to uploads directory
 */
async function saveImageFile(file: File): Promise<string> {
  try {
    // Ensure directory exists
    ensureUploadsDirectory();
    
    console.log("Uploading image:", {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    // Get file extension
    const originalName = file.name;
    const fileExtension = originalName.includes('.') 
      ? originalName.substring(originalName.lastIndexOf('.')) 
      : '';
    
    // Generate unique filename
    const uniqueName = `${uuidv4()}${fileExtension}`;
    console.log("Unique filename:", uniqueName);
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save file
    const filePath = path.join(SLIDERS_UPLOADS_DIR, uniqueName);
    fs.writeFileSync(filePath, buffer);
    console.log("File saved to:", filePath);
    
    // Return the URL path that will be used to access the file
    const imagePath = `/api/uploads/sliders/${uniqueName}`;
    console.log("Returning image path:", imagePath);
    
    return imagePath;
  } catch (error: any) {
    console.error("Upload error details:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

/**
 * Delete file from uploads directory
 */
async function deleteImageFromUploads(imageUrl: string): Promise<boolean> {
  try {
    if (!imageUrl) return false;
    
    // Extract filename from URL
    let filename = '';
    
    if (imageUrl.includes('/api/uploads/sliders/')) {
      filename = imageUrl.split('/api/uploads/sliders/')[1];
    } else if (imageUrl.includes('/uploads/sliders/')) {
      filename = imageUrl.split('/uploads/sliders/')[1];
    } else if (imageUrl.includes('/uploads/')) {
      // For backward compatibility with old paths
      const parts = imageUrl.split('/');
      filename = parts[parts.length - 1];
    } else {
      // Assume it's just the filename
      filename = imageUrl;
    }
    
    if (!filename) return false;
    
    const filePath = path.join(SLIDERS_UPLOADS_DIR, filename);
    console.log("Attempting to delete image:", filePath);
    
    // Check if file exists and delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Image deleted successfully:", filePath);
      return true;
    } else {
      console.warn("Image file not found:", filePath);
      return false;
    }
  } catch (error: any) {
    console.error("Delete image error:", error.message);
    return false;
  }
}

// Initialize uploads directory on import
ensureUploadsDirectory();

// POST - Create new slider
export async function POST(req: NextRequest) {
  console.log("=== POST SLIDER REQUEST STARTED ===");
  
  try {
    await connectDB();
    console.log("Database connected");
    
    const formData = await req.formData();
    console.log("FormData received");
    
    // Log all form data entries
    const entries: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        entries[key] = {
          name: value.name,
          type: value.type,
          size: value.size
        };
      } else {
        entries[key] = value;
      }
    }
    console.log("FormData entries:", entries);
    
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const imageFile = formData.get('image') as File;
    
    console.log("Parsed data:", { name, role, hasImage: !!imageFile });
    
    // Validation
    if (!name || !name.trim()) {
      console.error("Validation failed: Name is required");
      return NextResponse.json(
        { error: "Slider name is required" },
        { status: 400 }
      );
    }
    
    if (!imageFile || imageFile.size === 0) {
      console.error("Validation failed: Image is required");
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }
    
    // Validate image file
    if (!imageFile.type.startsWith('image/')) {
      console.error("Validation failed: File is not an image");
      return NextResponse.json(
        { error: "File must be an image (JPEG, PNG, GIF, WebP, etc.)" },
        { status: 400 }
      );
    }
    
    // Check file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > MAX_FILE_SIZE) {
      console.error("Validation failed: Image too large");
      return NextResponse.json(
        { error: "Image must be less than 10MB" },
        { status: 400 }
      );
    }
    
    // Upload image
    console.log("Starting image upload...");
    let imagePath: string;
    try {
      imagePath = await saveImageFile(imageFile);
      console.log("Image uploaded successfully:", imagePath);
    } catch (uploadError: any) {
      console.error("Image upload failed:", uploadError);
      return NextResponse.json(
        { error: `Failed to upload image: ${uploadError.message}` },
        { status: 500 }
      );
    }
    
    // Create slider in database
    console.log("Creating slider in database...");
    const sliderData = {
      name: name.trim(),
      role: (role || "General").trim(),
      image: imagePath,
    };
    
    console.log("Slider data to save:", sliderData);
    
    const slider = await Slider.create(sliderData);
    console.log("Slider created successfully:", slider._id);
    
    // Return success response
    const response = NextResponse.json({
      success: true,
      message: "Slider created successfully",
      slider: slider
    }, { status: 201 });
    
    console.log("=== POST SLIDER REQUEST COMPLETED SUCCESSFULLY ===");
    return response;
    
  } catch (error: any) {
    console.error("POST SLIDER ERROR DETAILS:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          error: "Slider with this name already exists",
          details: error.message
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Failed to create slider", 
        details: error.message,
        suggestion: "Check server logs for more details"
      },
      { status: 500 }
    );
  }
}

// GET - Fetch all sliders
export async function GET() {
  console.log("=== GET SLIDERS REQUEST STARTED ===");
  
  try {
    await connectDB();
    console.log("Database connected");
    
    const sliders = await Slider.find().sort({ createdAt: -1 });
    console.log(`Found ${sliders.length} sliders`);
    
    // Return as array
    const response = NextResponse.json(sliders);
    
    console.log("=== GET SLIDERS REQUEST COMPLETED SUCCESSFULLY ===");
    return response;
    
  } catch (error: any) {
    console.error("GET SLIDERS ERROR:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch sliders" },
      { status: 500 }
    );
  }
}

// PUT - Update slider
export async function PUT(req: NextRequest) {
  console.log("=== PUT SLIDER REQUEST STARTED ===");
  
  try {
    await connectDB();
    console.log("Database connected");
    
    const formData = await req.formData();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const imageFile = formData.get('image') as File;
    const existingImage = formData.get('existingImage') as string;
    
    console.log("Update data:", { 
      id, 
      name, 
      role, 
      hasImage: !!imageFile,
      existingImage 
    });
    
    if (!id) {
      console.error("Validation failed: ID is required");
      return NextResponse.json(
        { error: "Slider ID is required" },
        { status: 400 }
      );
    }
    
    const slider = await Slider.findById(id);
    if (!slider) {
      console.error("Slider not found:", id);
      return NextResponse.json(
        { error: "Slider not found" },
        { status: 404 }
      );
    }
    
    // Update data
    const updateData: any = {
      name: name ? name.trim() : slider.name,
      role: role ? role.trim() : slider.role || "General",
    };
    
    // Handle image update if provided
    if (imageFile && imageFile.size > 0) {
      console.log("Processing new image upload...");
      
      // Validate image file
      if (!imageFile.type.startsWith('image/')) {
        console.error("Validation failed: File is not an image");
        return NextResponse.json(
          { error: "File must be an image" },
          { status: 400 }
        );
      }
      
      // Check file size
      if (imageFile.size > 10 * 1024 * 1024) {
        console.error("Validation failed: Image too large");
        return NextResponse.json(
          { error: "Image must be less than 10MB" },
          { status: 400 }
        );
      }
      
      // Delete old image if exists (use provided existingImage or slider.image)
      const imageToDelete = existingImage || slider.image;
      if (imageToDelete) {
        console.log("Deleting old image:", imageToDelete);
        await deleteImageFromUploads(imageToDelete);
      }
      
      // Upload new image
      try {
        const imagePath = await saveImageFile(imageFile);
        updateData.image = imagePath;
        console.log("New image uploaded:", imagePath);
      } catch (uploadError: any) {
        console.error("Image upload failed:", uploadError);
        return NextResponse.json(
          { error: `Failed to upload image: ${uploadError.message}` },
          { status: 500 }
        );
      }
    } else if (existingImage) {
      // Keep existing image
      updateData.image = existingImage;
    } else {
      // Keep current image
      updateData.image = slider.image;
    }
    
    console.log("Update data to save:", updateData);
    
    const updatedSlider = await Slider.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    console.log("Slider updated successfully:", updatedSlider?._id);
    
    return NextResponse.json({
      success: true,
      message: "Slider updated successfully",
      slider: updatedSlider
    });
    
  } catch (error: any) {
    console.error("PUT SLIDER ERROR:", error.message);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          error: "Slider with this name already exists",
          details: error.message
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update slider" },
      { status: 500 }
    );
  }
}

// DELETE - Delete slider
export async function DELETE(req: NextRequest) {
  console.log("=== DELETE SLIDER REQUEST STARTED ===");
  
  try {
    await connectDB();
    console.log("Database connected");
    
    const { id } = await req.json();
    console.log("Delete slider ID:", id);
    
    if (!id) {
      console.error("Validation failed: ID is required");
      return NextResponse.json(
        { error: "Slider ID is required" },
        { status: 400 }
      );
    }
    
    const slider = await Slider.findById(id);
    if (!slider) {
      console.error("Slider not found:", id);
      return NextResponse.json(
        { error: "Slider not found" },
        { status: 404 }
      );
    }
    
    console.log("Found slider to delete:", slider.name);
    
    // Delete associated image file
    if (slider.image) {
      console.log("Deleting image file:", slider.image);
      await deleteImageFromUploads(slider.image);
    }
    
    await Slider.findByIdAndDelete(id);
    console.log("Slider deleted from database");
    
    return NextResponse.json({
      success: true,
      message: "Slider deleted successfully"
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("DELETE SLIDER ERROR:", error.message);
    return NextResponse.json(
      { error: "Failed to delete slider" },
      { status: 500 }
    );
  }
}