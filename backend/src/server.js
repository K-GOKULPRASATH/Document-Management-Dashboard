import dotenv from "dotenv";
import http from "http";
import { createDocumentsTable }
from "./models/documentModel.js";

import { Server } from "socket.io";

import app from "./app.js";

import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// SOCKET IO
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket Disconnected");
  });
});

// START SERVER
const startServer = async () => {
  try {

    await connectDB();
    await createDocumentsTable();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {

    console.log(error);

  }
};

startServer();