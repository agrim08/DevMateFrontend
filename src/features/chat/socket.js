import { SOCKET_URL } from "@/utils/constants";
import { io } from "socket.io-client";


let socket = null;

export const getSocket = (userId) => {
  if (socket) return socket;
  
  const socketUrl = SOCKET_URL;
  socket = io(socketUrl, {
    path: "/socket.io", 
    query: { userId },
    transports: ["websocket", "polling"],
    withCredentials: true, 
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000, 
  });
  
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};