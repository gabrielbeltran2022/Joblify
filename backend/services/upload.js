import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";


export const createUploader = (folder = "general") => {
  return multer({
    storage: multer.diskStorage({
      destination: path.join(process.cwd(), "public","uploads",folder),
      filename: (req,file,cb) => cb(null,uuidv4() + path.extname(file.originalname))
    }),
    limits: { fileSize: 5 * 1024 * 1024},
    fileFilter: (req,file,cb) => {
      file.mimetype.startsWith('image/') ? cb(null,true) : cb(new Error("Only image files are allowed"))
    }
  })
}


export const uploadProfileImage = createUploader("profiles");
export const uploadCertificationImage = createUploader("certifications");