import { Server } from "socket.io";

let io;

export const initializeSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {

    console.log(
      "Socket Connected:",
      socket.id
    );

    socket.on("disconnect", () => {

      console.log(
        "Socket Disconnected"
      );

    });
  });
};

// GET SOCKET INSTANCE
export const getIO = () => {

  if (!io) {
    throw new Error(
      "Socket.IO not initialized"
    );
  }

  return io;
};