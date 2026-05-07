import pool from "../config/db.js";

// CREATE DOCUMENTS TABLE
export const createDocumentsTable = async () => {
  try {

    const query = `
      CREATE TABLE IF NOT EXISTS documents (

        id SERIAL PRIMARY KEY,

        filename VARCHAR(255),

        originalname VARCHAR(255),

        mimetype VARCHAR(100),

        filesize BIGINT,

        filepath TEXT,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await pool.query(query);

    console.log("Documents Table Ready");

  } catch (error) {

    console.log(
      "Documents Table Creation Error"
    );

    console.log(error.message);
  }
};