import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  const socketUrl = BASE_URL;
  return io(socketUrl, {
    path: "/socket.io", 
    transports: ["websocket", "polling"],
    withCredentials: true, 
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000, 
  });
};