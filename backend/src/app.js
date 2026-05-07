import express from "express";
import cors from "cors";

import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server Running",
  });
});

// UPLOAD ROUTES
app.use("/api/upload", uploadRoutes);

export default app;