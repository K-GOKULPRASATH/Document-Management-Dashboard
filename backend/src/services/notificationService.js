import pool from "../config/db.js";

// GET ALL NOTIFICATIONS
export const getNotificationsService =
  async () => {

    try {

      const query = `
        SELECT *
        FROM notifications
        ORDER BY id DESC
      `;

      const result =
        await pool.query(query);

      return result.rows;

    } catch (error) {

      throw error;

    }
};