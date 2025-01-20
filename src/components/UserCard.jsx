import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { UserCircle, Heart, X } from "lucide-react";
import toast from "react-hot-toast";

const UserCard = ({ user }) => {
  if (!user) return null;
  const { _id, firstName, lastName, photoUrl, userAge, gender, bio } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );

      dispatch(removeUserFromFeed(userId));

      toast.success(
        status === "interested"
          ? "Follow Request sent!"
          : "User ignored successfully"
      );
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl w-full transform transition-all hover:scale-[1.01]">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:shrink-0">
            {photoUrl ? (
              <img
                className="h-48 w-full object-cover md:h-full md:w-48"
                src={photoUrl}
                alt={`${firstName} ${lastName}`}
              />
            ) : (
              <div className="h-48 w-full md:h-full md:w-48 bg-gray-200 flex items-center justify-center">
                <UserCircle className="w-20 h-20 text-gray-400" />
              </div>
            )}
          </div>

          <div className="p-8 flex flex-col justify-between flex-grow">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {`${firstName || ""} ${lastName || ""}`}
                </h2>
                <div className="flex items-center space-x-2 text-gray-600">
                  {userAge && <span>{userAge}</span>}
                  {gender && <span>• {gender}</span>}
                </div>
              </div>

              {bio && (
                <p className="mt-4 text-gray-600 leading-relaxed">{bio}</p>
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
              <button
                onClick={() => handleSendRequest("ignored", _id)}
                className="flex items-center justify-center px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors duration-300"
              >
                <X className="w-4 h-4 mr-2" />
                Ignore
              </button>
              <button
                onClick={() => handleSendRequest("interested", _id)}
                className="flex items-center justify-center px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-300"
              >
                <Heart className="w-4 h-4 mr-2" />
                Follow
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
