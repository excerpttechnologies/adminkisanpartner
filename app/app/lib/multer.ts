import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Define upload directory path
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
const CROP_CARE_DIR = path.join(UPLOADS_DIR, 'cropcare');

// Ensure upload directories exist
const ensureDirectories = () => {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(CROP_CARE_DIR)) {
    fs.mkdirSync(CROP_CARE_DIR, { recursive: true });
  }
};

// Call this to create directories
ensureDirectories();

// Local storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, CROP_CARE_DIR);
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
export const handleFileUpload = (req: any, fieldName: string = 'image'): Promise<{ url: string; filename: string }> => {
  return new Promise((resolve, reject) => {
    const uploadSingle = upload.single(fieldName);
    
    uploadSingle(req, {} as any, (err: any) => {
      if (err) {
        reject(err);
      } else {
        const file = req.file;
        if (!file) {
          resolve({ url: '', filename: '' });
          return;
        }
        resolve({
          url: `/uploads/cropcare/${file.filename}`,
          filename: file.filename
        });
      }
    });
  });
};

// Helper to handle multiple file uploads
export const handleMultipleFileUpload = (req: any, fieldName: string = 'files'): Promise<Array<{ url: string; filename: string }>> => {
  return new Promise((resolve, reject) => {
    upload.array(fieldName)(req, {} as any, (err: any) => {
      if (err) {
        reject(err);
      } else {
        const files = req.files;
        if (!files || files.length === 0) {
          resolve([]);
          return;
        }
        const fileUrls = files.map((file: Express.Multer.File) => ({
          url: `/uploads/cropcare/${file.filename}`,
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
    if (!filename) {
      resolve(false);
      return;
    }
    
    const filePath = path.join(CROP_CARE_DIR, filename);
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
  return path.join(CROP_CARE_DIR, filename);
};

// Check if file exists
export const fileExists = (filename: string): boolean => {
  const filePath = path.join(CROP_CARE_DIR, filename);
  return fs.existsSync(filePath);
};