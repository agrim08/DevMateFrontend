import { useState } from "react";
import UserCard from "./UserCard";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import {
  User,
  AtSign,
  Calendar,
  Users,
  Briefcase,
  Link,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [userAge, setUserAge] = useState(user?.userAge || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [skills, setSkills] = useState(user?.skills || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const previewUser = {
    firstName,
    lastName,
    userAge,
    bio,
    skills,
    photoUrl,
    gender,
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setShowToast(false);

      const res = await axios.put(
        `${BASE_URL}/profile/edit`,
        { userAge, bio, skills, photoUrl },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch(addUser(res?.data?.data));

      setToastMessage("Profile saved successfully!");
      setToastType("success");
      setShowToast(true);
    } catch (error) {
      setToastMessage(error.response?.data || "Failed to update profile!");
      setToastType("error");
      setShowToast(true);
    } finally {
      setTimeout(() => {
        setShowToast(false);
      }, 3000);

      setIsLoading(false);
    }
  };

  const InputField = ({
    icon: Icon,
    label,
    id,
    value,
    onChange,
    type = "text",
    placeholder,
  }) => (
    <div className="relative">
      <label
        htmlFor={id}
        className="block text-gray-300 text-sm font-medium mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type={type}
          id={id}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );

  const TextArea = ({
    icon: Icon,
    label,
    id,
    value,
    onChange,
    placeholder,
  }) => (
    <div className="relative">
      <label
        htmlFor={id}
        className="block text-gray-300 text-sm font-medium mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute top-3 left-3">
          <Icon className="h-5 w-5 text-gray-500" />
        </div>
        <textarea
          id={id}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows="3"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Form Section */}
          <div className="w-full lg:w-1/2 max-w-2xl">
            <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <User className="h-8 w-8 text-blue-500" />
                  Edit Profile
                </h2>

                <form onSubmit={updateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      icon={User}
                      label="First Name"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                    />
                    <InputField
                      icon={User}
                      label="Last Name"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>

                  <TextArea
                    icon={AtSign}
                    label="Bio"
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                  />

                  <TextArea
                    icon={Briefcase}
                    label="Skills"
                    id="skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="List your skills"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      icon={Calendar}
                      label="Age"
                      id="age"
                      type="number"
                      value={userAge}
                      onChange={(e) => setUserAge(e.target.value)}
                      placeholder="Enter your age"
                    />
                    <InputField
                      icon={Users}
                      label="Gender"
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      placeholder="Enter gender"
                    />
                  </div>

                  <InputField
                    icon={Link}
                    label="Photo URL"
                    id="photoUrl"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Enter photo URL"
                  />

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="w-[60%] bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                    <button
                      type="submit"
                      className="w-[40%] bg-white hover:bg-gray-400 text-black py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                      disabled={isLoading}
                      onClick={() => navigate("/")}
                    >
                      Back Home
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-8">
            <h3 className="text-3xl font-bold text-center text-white mb-6">
              Preview
            </h3>
            <UserCard user={previewUser} />
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg ${
            toastType === "success" ? "bg-green-500" : "bg-red-500"
          } text-white transform transition-all duration-300 flex items-center gap-2`}
        >
          {toastType === "success" ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default EditProfile;
