import { X, Menu } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [socket, setSocket] = useState(null);

  const connectionData = useSelector((store) => store.connection);
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const navigate = useNavigate();

  const targetConnection = connectionData?.find(
    (connection) => connection?._id === targetUserId
  );

  const fetchChat = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Error fetching chat:", error.message);
    }
  };

  useEffect(() => {
    if (!userId) return;

    const newSocket = createSocketConnection();
    setSocket(newSocket);

    newSocket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    newSocket.on("messageReceived", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId, targetUserId]);

  useEffect(() => {
    fetchChat();
  }, [targetUserId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("messageReceived", (message) => {
      setMessages((prevMessages) => {
        if (
          prevMessages.some(
            (msg) =>
              msg.content === message.content && msg.senderId === message.senderId
          )
        ) {
          return prevMessages;
        }
        return [...prevMessages, message];
      });
    });

    return () => socket.off("messageReceived");
  }, [socket]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      firstName: user.firstName,
      userId,
      targetUserId,
      content: newMessage,
    };

    socket.emit("sendMessage", message);
    setNewMessage("");
  };

  if (!targetConnection) {
    return <div className="text-center">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <div className="md:hidden absolute top-4 left-4 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white focus:outline-none"
        >
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      <div
        className={`fixed inset-y-0 left-0 bg-gray-800 p-4 overflow-y-auto transform md:relative md:translate-x-0 md:w-1/5 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Connections</h2>
        <ul className="space-y-4">
          {connectionData.map((connection) => (
            <li key={connection._id} className="border-b border-gray-500 pb-2">
              <Link
                to={`/chat/${connection._id}`}
                className={`flex items-center p-2 rounded-lg transition duration-300 ${
                  connection._id === targetUserId
                    ? "bg-indigo-900"
                    : "hover:bg-gray-700"
                }`}
              >
                <img
                  src={connection.photoUrl || "/default-avatar.png"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full mr-4"
                />
                <span className="text-white text-lg">{connection.firstName}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full md:w-4/5 flex flex-col">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-500 to-blue-600 shadow-lg">
          <button
            className="flex items-center space-x-2 text-red-500"
            onClick={() => navigate("/connections")}
          >
            <X className="h-6 w-6" />
            <span>Close Chat</span>
          </button>
          <div className="flex items-center space-x-4">
            <img
              src={targetConnection.photoUrl || "/default-avatar.png"}
              alt="avatar"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <span className="text-xl">{targetConnection.firstName}</span>
          </div>
        </div>

        <div className="flex-grow p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col gap-2 mb-4 ${
                msg.senderId === userId ? "items-end" : "items-start"
              }`}
            >
              <div className="flex gap-2 items-center">
                <span className="text-xs opacity-50">
                  {msg.senderId === userId ? "You" : targetConnection.firstName}
                </span>
                <time className="text-xs opacity-50">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </time>
              </div>
              <div
                className={`chat-bubble ${
                  msg.senderId === userId
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-800 text-white"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-800">
          <div className="flex items-center space-x-4">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              type="text"
              placeholder="Type your message..."
              className="w-full p-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;