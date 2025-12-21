import multer from 'multer';
import { NextApiRequest } from 'next';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Local storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/ads');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'));
  }
};

// Multer upload instance
export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// Helper to handle file uploads in Next.js API
export const handleFileUpload = (req: NextApiRequest, fieldName: string) => {
  return new Promise<string[]>((resolve, reject) => {
    upload.array(fieldName)(req as any, {} as any, (err: any) => {
      if (err) {
        reject(err);
      } else {
        const files = (req as any).files;
        const fileUrls = files.map((file: Express.Multer.File) => 
          `/uploads/ads/${file.filename}`
        );
        resolve(fileUrls);
      }
    });
  });
};

// Cloudinary upload (optional - if using Cloudinary)
export const uploadToCloudinary = async (file: Express.Multer.File) => {
  // Implement Cloudinary upload logic here
  // Return the URL
  return `https://res.cloudinary.com/your-cloud-name/image/upload/${file.filename}`;
};