import multer from "multer";
import path from "path";
import fs from "fs";

// CREATE UPLOAD FOLDER
const uploadPath = "uploads";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

// FILE FILTER
const fileFilter = (req, file, cb) => {

  // PDF VALIDATION
  if (file.mimetype !== "application/pdf") {
    return cb(
      new Error("Only PDF files are allowed"),
      false
    );
  }

  cb(null, true);
};

// MULTER CONFIG
const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10,
  },
});

// SINGLE FILE
export const singleUpload =
  upload.single("file");

// MULTIPLE FILES
export const multipleUpload =
  upload.array("files", 10);

export default upload;