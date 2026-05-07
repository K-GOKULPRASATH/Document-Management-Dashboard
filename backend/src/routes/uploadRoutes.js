import express from "express";
import {
  singleUpload,
  multipleUpload,
} from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Single Upload
router.post(
  "/single",
  singleUpload,
  (req, res) => {
    res.json({
      success: true,
      file: req.file,
    });
  }
);

// Multiple Upload
router.post(
  "/multiple",
  multipleUpload,
  (req, res) => {
    res.json({
      success: true,
      files: req.files,
    });
  }
);

export default router;