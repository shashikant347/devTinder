const { Server } = require("socket.io");
const roomMessages = {};

const intitiliseSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connect", (socket) => {
    console.log("socket connected");

    socket.on("joinChat", ({ userid, id }) => {
      if (!userid || !id) return;
      const roomId = [userid, id].sort().join("_");
      socket.join(roomId);
      const history = roomMessages[roomId] || [];
      socket.emit("chatHistory", history);
    });

    socket.on("sendMessage", ({ roomId, sender, text, timestamp }) => {
      if (!roomId || !sender || !text) return;
      const message = { from: sender, text, timestamp };
      roomMessages[roomId] = roomMessages[roomId] || [];
      roomMessages[roomId].push(message);
      socket.to(roomId).emit("receiveMessage", message);
    });
  });
};

module.exports = intitiliseSocket;