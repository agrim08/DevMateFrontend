import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import { createSocketConnection } from "../utils/socket";
import { BASE_URL } from "../utils/constants";
import { addConnection } from "../utils/connectionSlice";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { AlertCircle, ChevronLeft } from "lucide-react";

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
  const { data: user } = useSelector((store) => store.user);
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
  }, [messages]);

  // ===== Fetch Connections if missing =====
  const fetchConnections = async () => {
    if (connectionData) return;
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, { withCredentials: true });
      dispatch(addConnection(res?.data?.data));
    } catch (error) {
      console.error("Failed to load nodes:", error.message);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  // ===== Fetch chat history =====
  const fetchChat = async () => {
    if (!targetUserId) return;
    try {
      setMessages([]); // Clear messages while loading new chat
      const response = await axios.get(`${BASE_URL}/chat/${targetUserId}`, { withCredentials: true });
      
      const chatData = response?.data?.data;
      if (chatData?.messages) {
        const chatMessages = chatData.messages.map((msg) => ({
          senderId: typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId,
          firstName: typeof msg.senderId === 'object' ? msg.senderId.firstName : msg.firstName,
          lastName: typeof msg.senderId === 'object' ? msg.senderId.lastName : msg.lastName,
          content: msg.content,
          createdAt: msg.createdAt,
        }));
        setMessages(chatMessages);
      }
      setError(null);
    } catch (err) {
      setError("Cloud synchronization failed. Retrying...");
      console.error("Error fetching chat:", err?.message);
    }
  };

  useEffect(() => { fetchChat(); }, [targetUserId]);

  // ===== Socket lifecycle =====
  useEffect(() => {
    if (!userId || !targetUserId) return;
    
    const newSocket = createSocketConnection();

    newSocket.on("connect", () => {
      setConnectionStatus("connected");
      setError(null);
      newSocket.emit("joinChat", { firstName: user.firstName, userId, targetUserId });
    });

    newSocket.on("connect_error", (err) => {
      setConnectionStatus("disconnected");
      console.error("Socket connection error:", err?.message);
    });

    newSocket.on("reconnect", () => {
      setConnectionStatus("connected");
      setError(null);
      newSocket.emit("joinChat", { firstName: user.firstName, userId, targetUserId });
    });

    newSocket.on("messageReceived", (message) => {
      // SECURITY: Only process messages relevant to this specific chat node
      const isFromTarget = message.senderId === targetUserId;
      const isFromMe = message.senderId === userId;
      
      if (!isFromTarget && !isFromMe) {
          console.warn("Filtered out non-relevant message node");
          return;
      }

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

    setMessages((prev) => [...prev, message]);

    try {
      socket.emit("sendMessage", { firstName: user.firstName, userId, targetUserId, content: newMessage.trim() });
      setNewMessage("");
      inputRef.current?.focus();
    } catch (err) {
      console.error("Send message error:", err?.message);
    }
  };

  const handleTyping = () => {
    if (socket && targetUserId) socket.emit("typing", { userId, targetUserId });
  };

  if (!targetUserId) {
    return (
      <div className="h-[calc(100vh-64px)] bg-background flex overflow-hidden">
        <ChatSidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredConnections={filteredConnections}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          targetUserId={targetUserId}
          isMobileFullScreen={true}
        />
        <div className="hidden md:flex flex-3">
          <EmptyChat 
            onGoConnections={() => navigate("/app/connections")} 
            hasConnections={connectionData && connectionData.length > 0}
          />
        </div>
      </div>
    );
  }

  if (!targetConnection) {
    return (
      <div className="h-[calc(100vh-64px)] bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center border-border/50 bg-card rounded-[2rem] shadow-2xl">
          <CardContent className="space-y-6">
            <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-black text-foreground">Node Connection Lost</h2>
                <p className="text-muted-foreground font-medium">
                  The developer you're trying to reach is currently unreachable or the connection link is invalid.
                </p>
            </div>
            <Button asChild className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-primary/90">
              <Link to="/app/chat" className="flex items-center justify-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                <span>Return to Network</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="h-[calc(100vh-64px)] bg-background flex overflow-hidden">
      <ChatSidebar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredConnections={filteredConnections}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        targetUserId={targetUserId}
      />

      <div className="flex-1 flex flex-col bg-background/20 backdrop-blur-md min-h-0 border-l border-border/40 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={targetUserId}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex-1 flex flex-col min-h-0"
          >
            <ChatHeader
              targetConnection={targetConnection}
              navigate={navigate}
              setSidebarOpen={setSidebarOpen}
            />

            <ChatMessages
              messageGroups={messageGroups}
              userId={userId}
              targetConnection={targetConnection}
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Chat;
