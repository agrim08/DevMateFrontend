import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

import { createSocketConnection } from "../utils/socket";
import { BASE_URL } from "../utils/constants";
import { addConnection } from "../utils/connectionSlice";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

// Subcomponents
import ChatSidebar from "./chat/ChatSidebar";
import ChatHeader from "./chat/ChatHeader";
import ChatMessages from "./chat/ChatMessages";
import ChatInput from "./chat/ChatInput";
import EmptyChat from "./chat/EmptyChat";

const Chat = () => {
  const { targetUserId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ===== State =====
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connecting");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const connectionData = useSelector((store) => store.connection);
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const targetConnection = connectionData?.find((c) => c?._id === targetUserId);

  const filteredConnections =
    connectionData?.filter((c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // ===== Utils =====
  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString();
  };

  const groupMessagesByDate = (msgs) => {
    const groups = {};
    msgs.forEach((m) => {
      const date = formatDate(m.createdAt);
      if (!groups[date]) groups[date] = [];
      groups[date].push(m);
    });
    return groups;
  };

  // ===== Effects: initial scroll =====
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // ===== Fetch chat history =====
  const fetchChat = async () => {
    if (!targetUserId) return;
    try {
      const response = await axios.get(`${BASE_URL}/chat/${targetUserId}`, { withCredentials: true });
      const chatMessages = response?.data?.messages.map((msg) => ({
        senderId: msg.senderId._id,
        firstName: msg.senderId.firstName,
        lastName: msg.senderId.lastName,
        content: msg.content,
        createdAt: msg.createdAt,
      }));
      setMessages(chatMessages || []);
      setError(null);
    } catch (err) {
      setError("Failed to load chat history. Please try again.");
      console.error("Error fetching chat:", err?.message);
    }
  };

  useEffect(() => { fetchChat(); }, [targetUserId]);

  // ===== Socket lifecycle =====
  useEffect(() => {
    if (!userId) return;
    const newSocket = createSocketConnection();

    newSocket.on("connect", () => {
      setConnectionStatus("connected");
      setError(null);
      if (targetUserId) {
        newSocket.emit("joinChat", { firstName: user.firstName, userId, targetUserId });
      }
    });

    newSocket.on("connect_error", (err) => {
      setConnectionStatus("disconnected");
      setError("Connection failed. Please check your network.");
      console.error("Socket connection error:", err?.message);
    });

    newSocket.on("reconnect", () => {
      setConnectionStatus("connected");
      setError(null);
      if (targetUserId) {
        newSocket.emit("joinChat", { firstName: user.firstName, userId, targetUserId });
      }
    });

    newSocket.on("error", ({ message }) => {
      setError(message);
      console.error("Socket error from server:", message);
    });

    newSocket.on("messageReceived", (message) => {
      const newMessageObj = {
        senderId: message.senderId,
        firstName: message.firstName,
        content: message.content,
        createdAt: message.createdAt,
      };
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (m) =>
            m.senderId === newMessageObj.senderId &&
            m.content === newMessageObj.content &&
            Math.abs(new Date(m.createdAt) - new Date(newMessageObj.createdAt)) < 1000
        );
        if (isDuplicate) return prev;
        return [...prev, newMessageObj];
      });
      setError(null);
    });

    setSocket(newSocket);
    return () => {
      newSocket.off("connect");
      newSocket.off("connect_error");
      newSocket.off("reconnect");
      newSocket.off("error");
      newSocket.off("messageReceived");
      newSocket.disconnect();
    };
  }, [userId, targetUserId]);

  // ===== Load connections if empty =====
  useEffect(() => {
    const handleConnections = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/connections`, { withCredentials: true });
        dispatch(addConnection(res?.data?.data));
        setError(null);
      } catch (err) {
        setError("Failed to load connections. Please try again.");
        console.error("Error fetching connections:", err?.response?.data);
      }
    };
    if (!connectionData || connectionData?.length === 0) handleConnections();
  }, [dispatch, connectionData]);

  // ===== Actions =====
  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !targetUserId) return;

    const message = {
      senderId: userId,
      firstName: user.firstName,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, message]); // optimistic

    try {
      socket.emit("sendMessage", { firstName: user.firstName, userId, targetUserId, content: newMessage.trim() });
      setNewMessage("");
      inputRef.current?.focus();
      setError(null);
    } catch (err) {
      setError("Failed to send message. Please try again.");
      setMessages((prev) =>
        prev.map((m) =>
          m.createdAt === message.createdAt && m.status === "sending"
            ? { ...m, status: "failed" }
            : m
        )
      );
      console.error("Send message error:", err?.message);
    }
  };

  const retryMessage = (failedMessage) => {
    setMessages((prev) =>
      prev.map((m) => (m.createdAt === failedMessage.createdAt ? { ...m, status: "sending" } : m))
    );
    socket.emit("sendMessage", { firstName: user.firstName, userId, targetUserId, content: failedMessage.content });
  };

  const handleTyping = () => {
    if (socket && targetUserId) socket.emit("typing", { userId, targetUserId });
  };

  // ===== Conditional branches =====
  if (!targetUserId) {
    return (
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        <ChatSidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredConnections={filteredConnections}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          targetUserId={targetUserId}
        />
        <EmptyChat onGoConnections={() => navigate("/app/connections")} />
      </div>
    );
  }

  if (!targetConnection) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">User not found</h2>
            <p className="text-gray-600 mb-4">
              The user you're trying to chat with doesn't exist or isn't connected.
            </p>
            <Button asChild>
              <Link to="/app/chat">Back to Messages</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <ChatSidebar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredConnections={filteredConnections}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        targetUserId={targetUserId}
      />

      <div className="flex-1 flex flex-col bg-white min-h-0">
        <ChatHeader
          targetConnection={targetConnection}
          navigate={navigate}
          setSidebarOpen={setSidebarOpen}
        />

        {error && (
          <div className="p-4 bg-red-100 text-red-700 text-sm text-center">
            {error}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 text-red-700 underline"
              onClick={() => { setError(null); fetchChat(); }}
            >
              Retry
            </Button>
          </div>
        )}

        <ChatMessages
          messageGroups={messageGroups}
          userId={userId}
          targetConnection={targetConnection}
          retryMessage={retryMessage}
          isTyping={isTyping}
          messagesEndRef={messagesEndRef}
          formatTime={formatTime}
        />

        <ChatInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessage={sendMessage}
          handleTyping={handleTyping}
          inputRef={inputRef}
          connectionStatus={connectionStatus}
        />
      </div>
    </div>
  );
};

export default Chat;
