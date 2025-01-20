import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";
import {
  UserCircle,
  Loader2,
  UserPlus,
  Check,
  X,
  Briefcase,
  Mail,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);

  const handleRequest = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/pending`, {
        withCredentials: true,
      });
      dispatch(addRequest(res?.data?.data));
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to load requests");
    }
  };

  useEffect(() => {
    handleRequest();
  }, []);

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
      toast.success(
        status === "accepted" ? "🎉 New connection added!" : "Request declined"
      );
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to process request");
    }
  };

  if (!requests) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400 animate-pulse">
            Loading connection requests...
          </p>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <UserPlus className="w-20 h-20 text-purple-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">All Caught Up!</h1>
          <p className="text-gray-400 text-lg mb-6">
            You have no pending connection requests at the moment
          </p>
          <div className="animate-bounce text-purple-400">
            <UserPlus className="w-6 h-6 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Animated Header */}
        <div className="relative text-center mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 blur-3xl" />
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
                Connection Requests
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              {requests.length} Pending Request
              {requests.length !== 1 ? "s" : ""} to Review
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
          </div>
        </div>

        {/* Requests Grid with Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {requests.map((request, index) => {
            const {
              firstName,
              lastName,
              photoUrl,
              bio,
              skills,
              userAge,
              gender,
            } = request?.fromUserId;

            return (
              <div
                key={request?._id}
                className="group relative bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.5s ease-out forwards",
                }}
              >
                {/* Animated gradient border */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ padding: "1px" }}
                >
                  <div className="h-full w-full bg-gray-900 rounded-2xl" />
                </div>

                <div className="relative p-6">
                  {/* Profile Image with Glow */}
                  <div className="relative flex justify-center mb-6">
                    <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={`${firstName} ${lastName}`}
                        className="w-32 h-32 rounded-full object-cover ring-4 ring-purple-500/30 group-hover:ring-purple-500/50 transition-all duration-500"
                      />
                    ) : (
                      <UserCircle className="w-32 h-32 text-gray-400" />
                    )}
                  </div>

                  {/* User Info with Enhanced Layout */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
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

                  {/* Bio & Skills with Hover Effects */}
                  <div className="space-y-4 mb-6">
                    {bio && (
                      <div className="bg-white/5 rounded-lg p-4 transform hover:scale-[1.02] transition-transform duration-300">
                        <p className="text-sm font-medium text-purple-400 mb-2">
                          About
                        </p>
                        <p className="text-gray-300 text-sm line-clamp-3">
                          {bio}
                        </p>
                      </div>
                    )}
                    {skills && (
                      <div className="bg-white/5 rounded-lg p-4 transform hover:scale-[1.02] transition-transform duration-300">
                        <p className="text-sm font-medium text-pink-400 mb-2 flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          Skills
                        </p>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {Array.isArray(skills) ? skills.join(", ") : skills}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Interactive Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => reviewRequest("rejected", request?._id)}
                      className="flex-1 bg-gradient-to-r from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 text-red-500 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 group"
                    >
                      <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                      Decline
                    </button>
                    <button
                      onClick={() => reviewRequest("accepted", request?._id)}
                      className="flex-1 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 hover:from-emerald-500/20 hover:to-emerald-600/20 text-emerald-500 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 group"
                    >
                      <Check className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      Accept
                    </button>
                  </div>
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

export default Requests;
