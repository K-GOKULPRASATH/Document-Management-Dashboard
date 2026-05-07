import pool from "../config/db.js";

export const createNotificationsTable =
  async () => {

    try {

      const query = `
        CREATE TABLE IF NOT EXISTS notifications (

          id SERIAL PRIMARY KEY,

          title VARCHAR(255),

          message TEXT,

          created_at TIMESTAMP
          DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await pool.query(query);

      console.log(
        "Notifications Table Ready"
      );

    } catch (error) {

      console.log(error.message);

    }
};