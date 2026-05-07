import express from "express";
import cors from "cors";

import uploadRoutes from "./routes/uploadRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import {
  errorMiddleware,
} from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors());
app.use("/api/notifications", notificationRoutes);

app.use(express.json());
app.use(errorMiddleware);

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