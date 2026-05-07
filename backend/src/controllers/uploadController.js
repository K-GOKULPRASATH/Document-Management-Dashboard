import {
  singleFileUploadService,
  multipleFileUploadService,
} from "../services/uploadService.js";


// SINGLE FILE UPLOAD
export const uploadSingleFile = async (
  req,
  res
) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result =
      await singleFileUploadService(
        req.file
      );

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: result,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// MULTIPLE FILE UPLOAD
export const uploadMultipleFiles = async (
  req,
  res
) => {
  try {

    if (
      !req.files ||
      req.files.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const result =
      await multipleFileUploadService(
        req.files
      );

    res.status(200).json({
      success: true,
      message:
        "Files uploaded successfully",
      data: result,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};