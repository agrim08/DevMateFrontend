import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";
import { Loader2, User, UserPlus } from "lucide-react";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/feed`, {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (error) {
      console.error(error.message);
      return;
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (feed.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <User className="w-20 h-20 text-purple-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">
            No New users currently!
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Check Back after some time!
          </p>
          <div className="animate-bounce text-purple-400">
            <User className="w-6 h-6 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center">
          <UserCard user={feed[0]} />
        </div>
      </div>
    </div>
  );
};

export default Feed;
