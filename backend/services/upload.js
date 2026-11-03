import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

/**
 * Creates a dynamic Multer upload middleware targeting a specific folder.
 * @param {string} folderName - Subfolder inside 'public/uploads/' (e.g., 'profiles', 'certifications')
 */
export const createUploader = (folderName = "general") => {
  const uploadPath = path.join("public", "uploads", folderName);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Ensure the target directory exists before saving
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      // Clean, unique UUID filename
      cb(null, `${uuidv4()}${ext}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are allowed!"), false);
      }
    },
  });
};

export const uploadProfileImage = createUploader("profiles");
export const uploadCertificationImage = createUploader("certifications");