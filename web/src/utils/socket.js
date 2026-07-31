import io from "socket.io-client";

const socketURL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export const createSocketConnection = () => {
  return io(socketURL, {
    withCredentials: true,
    transports: ["websocket"],
  });
};

