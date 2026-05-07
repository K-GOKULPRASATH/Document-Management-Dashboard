import dotenv from "dotenv";
import http from "http";
import { createDocumentsTable }
from "./models/documentModel.js";
import {
  initializeSocket,
} from "./sockets/socket.js";
import {
  createNotificationsTable,
} from "./models/notificationModel.js";

import { Server } from "socket.io";

import app from "./app.js";

import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// INITIALIZE SOCKET
initializeSocket(server);

// START SERVER
const startServer = async () => {
  try {

    await connectDB();
    await createDocumentsTable();
    await createNotificationsTable();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {

    console.log(error);

  }
};

startServer();