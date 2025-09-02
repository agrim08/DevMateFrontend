import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  const socketUrl = location.hostname === "localhost" ? BASE_URL : `${window.location.origin}/api`;
  return io(socketUrl, {
    path: "/socket.io", 
    transports: ["websocket", "polling"],
    withCredentials: true, 
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000, 
  });
};