import express from "express";

import {
  uploadSingleFile,
  uploadMultipleFiles,
} from "../controllers/uploadController.js";

import {
  singleUpload,
  multipleUpload,
} from "../middleware/uploadMiddleware.js";

const router = express.Router();


// SINGLE FILE UPLOAD
router.post(
  "/single",
  singleUpload,
  uploadSingleFile
);


// MULTIPLE FILE UPLOAD
router.post(
  "/multiple",
  multipleUpload,
  uploadMultipleFiles
);


export default router;