import { X, Menu } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const connectionData = useSelector((store) => store.connection);
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  // Find the connection with the matching _id
  const targetConnection = connectionData?.find(
    (connection) => connection?._id === targetUserId
  );

  useEffect(() => {
    if (!userId) {
      return;
    }
    const socket = createSocketConnection();
    socket.emit("joinChat", { userId, targetUserId });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  // Handle case if targetConnection is not found
  if (!targetConnection) {
    return <div className="text-center text-white mt-10">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Hamburger Menu */}
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

      {/* Left sidebar with list of connections */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-800 p-4 overflow-y-auto transform md:relative md:translate-x-0 md:w-1/5 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-xl font-bold mb-4">Connections</h2>
        <ul className="space-y-4 ">
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
                <span className="text-white text-lg  ">
                  {connection.firstName}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat area */}
      <div className="w-full md:w-4/5 flex flex-col">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-500 to-blue-600 shadow-lg">
          <div className="flex space-x-3 ml-4">
            <X className="text-red-500 h-7 w-7" />
            <button
              className="text-xl"
              onClick={() => navigate("/connections")}
            >
              Close Chat
            </button>
          </div>
          <div className="flex items-center space-x-4 mr-4">
            <img
              src={targetConnection.photoUrl || "/default-avatar.png"}
              alt="avatar"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <span className="text-xl">{targetConnection.firstName}</span>
          </div>
        </div>

        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {/* Chat messages will go here */}
          <div className="chat chat-start flex flex-col gap-2">
            <time className="text-xs opacity-50">12:46</time>
            <div className="chat-bubble bg-gray-800 text-white">
              Hello! How can I help you today?
            </div>
          </div>
          <div className="chat chat-end flex flex-col gap-2">
            <time className="text-xs opacity-50">12:46</time>
            <div className="chat-bubble bg-indigo-500 text-white">
              I need some information about our project.
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-800">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-2/3 flex-grow p-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="w-1/3 px-4 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition duration-300">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
