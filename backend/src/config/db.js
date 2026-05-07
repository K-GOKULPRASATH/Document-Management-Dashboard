import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();

    console.log("PostgreSQL Connected Successfully");

    // Release client back to pool
    client.release();

  } catch (error) {
    console.log("Database Connection Error");

    console.log(error.message);

    process.exit(1);
  }
};

export default pool;