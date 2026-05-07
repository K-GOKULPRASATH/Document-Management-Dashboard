import express from "express";

import {
  getNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

// GET NOTIFICATIONS
router.get(
  "/",
  getNotifications
);

export default router;