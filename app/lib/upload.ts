// import multer from 'multer';
// import { NextApiRequest } from 'next';
// import { v4 as uuidv4 } from 'uuid';
// import path from 'path';

// // Local storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/uploads/ads');
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   }
// });

// // File filter
// const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//   const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb(new Error('Only image and video files are allowed'));
//   }
// };

// // Multer upload instance
// export const upload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
//   fileFilter: fileFilter
// });

// // Helper to handle file uploads in Next.js API
// export const handleFileUpload = (req: NextApiRequest, fieldName: string) => {
//   return new Promise<string[]>((resolve, reject) => {
//     upload.array(fieldName)(req as any, {} as any, (err: any) => {
//       if (err) {
//         reject(err);
//       } else {
//         const files = (req as any).files;
//         const fileUrls = files.map((file: Express.Multer.File) => 
//           `/uploads/ads/${file.filename}`
//         );
//         resolve(fileUrls);
//       }
//     });
//   });
// };

// // Cloudinary upload (optional - if using Cloudinary)
// export const uploadToCloudinary = async (file: Express.Multer.File) => {
//   // Implement Cloudinary upload logic here
//   // Return the URL
//   return `https://res.cloudinary.com/your-cloud-name/image/upload/${file.filename}`;
// };










import multer from 'multer';
import { NextApiRequest } from 'next';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

// Define upload directory path
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
const ADS_UPLOAD_DIR = path.join(UPLOADS_DIR, 'ads');

// Ensure upload directories exist
const ensureDirectories = () => {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(ADS_UPLOAD_DIR)) {
    fs.mkdirSync(ADS_UPLOAD_DIR, { recursive: true });
  }
};

// Call this to create directories
ensureDirectories();

// Local storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, ADS_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter - allow only images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Multer upload instance
export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// Helper to handle single file upload
export const handleFileUpload = (req: NextApiRequest): Promise<{ url: string; filename: string }> => {
  return new Promise((resolve, reject) => {
    upload.single('file')(req as any, {} as any, (err: any) => {
      if (err) {
        reject(err);
      } else {
        const file = (req as any).file;
        if (!file) {
          reject(new Error('No file uploaded'));
          return;
        }
        resolve({
          url: `/uploads/ads/${file.filename}`,
          filename: file.filename
        });
      }
    });
  });
};

// Helper to handle multiple file uploads
export const handleMultipleFileUpload = (req: NextApiRequest, fieldName: string = 'files'): Promise<Array<{ url: string; filename: string }>> => {
  return new Promise((resolve, reject) => {
    upload.array(fieldName)(req as any, {} as any, (err: any) => {
      if (err) {
        reject(err);
      } else {
        const files = (req as any).files;
        if (!files || files.length === 0) {
          reject(new Error('No files uploaded'));
          return;
        }
        const fileUrls = files.map((file: Express.Multer.File) => ({
          url: `/uploads/ads/${file.filename}`,
          filename: file.filename
        }));
        resolve(fileUrls);
      }
    });
  });
};

// Delete file from server
export const deleteFile = (filename: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const filePath = path.join(ADS_UPLOAD_DIR, filename);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    } else {
      resolve(false);
    }
  });
};

// Get absolute file path from URL
export const getAbsolutePath = (url: string): string => {
  const filename = path.basename(url);
  return path.join(ADS_UPLOAD_DIR, filename);
};

// Check if file exists
export const fileExists = (filename: string): boolean => {
  const filePath = path.join(ADS_UPLOAD_DIR, filename);
  return fs.existsSync(filePath);
};