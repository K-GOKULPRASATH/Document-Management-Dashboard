import pool from "../config/db.js";

import {
  getIO,
} from "../sockets/socket.js";


 const delay = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

// SINGLE FILE SERVICE
export const singleFileUploadService = async (
  file
) => {

  const io = getIO();

  try {

    const query = `
      INSERT INTO documents (
        filename,
        originalname,
        mimetype,
        filesize,
        filepath
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      file.filename,
      file.originalname,
      file.mimetype,
      file.size,
      file.path,
    ];

    const result = await pool.query(
      query,
      values
    );

    // REALTIME EVENT
    io.emit("singleUploadCompleted", {
      success: true,
      fileName: file.originalname,
    });

    return result.rows[0];

  } catch (error) {

    io.emit("uploadError", {
      success: false,
      message: error.message,
    });

    throw error;
  }
};


// MULTIPLE FILE SERVICE
export const multipleFileUploadService = async (
  files
) => {
  const io = getIO();
  try {

    const uploadedFiles = [];

    const totalFiles = files.length;

    for (let i = 0; i < totalFiles; i++) {

      const file = files[i];

      // INSERT QUERY
      const query = `
        INSERT INTO documents (
          filename,
          originalname,
          mimetype,
          filesize,
          filepath
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const values = [
        file.filename,
        file.originalname,
        file.mimetype,
        file.size,
        file.path,
      ];

      const result = await pool.query(
        query,
        values
      );

      uploadedFiles.push(result.rows[0]);
       await delay(1000);
     

      // REALTIME PROGRESS EVENT
      io.emit("uploadProgress", {
        uploaded: i + 1,
        total: totalFiles,
        progress: `${i + 1}/${totalFiles}`,
        fileName: file.originalname,
      });
    }

    // FINAL EVENT
    io.emit("uploadCompleted", {
      success: true,
      totalUploaded: totalFiles,
    });

    return uploadedFiles;

  } catch (error) {

    io.emit("uploadError", {
      success: false,
      message: error.message,
    });

    throw error;
  }
};