import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import axios from "axios";
import {
  UserCircle,
  MessageCircle,
  Loader2,
  Users,
  Briefcase,
  Mail,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connectionData = useSelector((store) => store.connection);

  const handleConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      dispatch(addConnection(res?.data?.data));
    } catch (error) {
      console.error(error.response?.data);
    }
  };

  useEffect(() => {
    handleConnections();
  }, []);

  if (!connectionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400 animate-pulse">
            Loading your connections...
          </p>
        </div>
      </div>
    );
  }

  if (connectionData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <Users className="w-20 h-20 text-blue-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">
            No Connections Yet
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Start connecting with other users to build your professional
            network!
          </p>
          <div className="animate-bounce text-blue-400">
            <Users className="w-6 h-6 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with animated background */}
        <div className="relative text-center mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900  to-black blur-3xl" />
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-indigo-500 bg-clip-text ">
                Your Network
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Connected with {connectionData.length} Professional
              {connectionData.length !== 1 ? "s" : ""}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto rounded-full" />
          </div>
        </div>

        {/* Connections Grid with Masonry-like layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {connectionData.map((connection, index) => {
            const {
              _id,
              photoUrl,
              skills,
              userAge,
              firstName,
              lastName,
              bio,
              gender,
            } = connection;
            return (
              <div
                key={_id}
                className="group relative bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.5s ease-out forwards",
                }}
              >
                {/* Animated gradient border */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ padding: "1px" }}
                >
                  <div className="h-full w-full bg-gray-900 rounded-2xl" />
                </div>

                <div className="relative p-6">
                  {/* Profile Image with Glow Effect */}
                  <div className="relative flex justify-center mb-6">
                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={`${firstName} ${lastName}`}
                        className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-500/30 group-hover:ring-blue-500/50 transition-all duration-500"
                      />
                    ) : (
                      <UserCircle className="w-32 h-32 text-gray-400" />
                    )}
                  </div>

                  {/* User Info with Hover Effects */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                      {`${firstName || ""} ${lastName || ""}`}
                    </h2>
                    <div className="flex items-center justify-center space-x-3 text-gray-400">
                      {userAge && (
                        <span className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {userAge} years
                        </span>
                      )}
                      {gender && (
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {gender}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bio & Skills with Improved Layout */}
                  <div className="space-y-4 mb-6">
                    {bio && (
                      <div className="bg-white/5 rounded-lg p-4 transform hover:scale-[1.02] transition-transform duration-300">
                        <p className="text-sm font-medium text-blue-400 mb-2">
                          About
                        </p>
                        <p className="text-gray-300 text-sm line-clamp-3">
                          {bio}
                        </p>
                      </div>
                    )}
                    {skills && (
                      <div className="bg-white/5 rounded-lg p-4 transform hover:scale-[1.02] transition-transform duration-300">
                        <p className="text-sm font-medium text-purple-400 mb-2 flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          Skills
                        </p>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {skills}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Interactive Chat Button */}
                  <Link to={`/chat/` + _id}>
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 group">
                      <MessageCircle className="w-5 h-5 group-hover:animate-bounce" />
                      <span>Start Conversation</span>
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Connections;
