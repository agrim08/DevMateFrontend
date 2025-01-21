import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import {
  Menu,
  X,
  Rocket,
  User,
  Users,
  Clock,
  Crown,
  LogOut,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      const logoutUser = await axios.post(
        `${BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      dispatch(removeUser());

      if (logoutUser.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error.message);
      return;
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const user = useSelector((store) => store.user);

  const menuItems = [
    { label: "Profile", icon: <User size={18} />, path: "/profile" },
    { label: "Connections", icon: <Users size={18} />, path: "/connections" },
    { label: "Pending Requests", icon: <Clock size={18} />, path: "/requests" },
    { label: "Upgrade", icon: <Crown size={18} />, path: "/premium" },
  ];

  return (
    <>
      <nav className="bg-gradient-to-r from-black to-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex-shrink-0 hidden md:block">
              <Link
                to="/"
                className="flex items-center space-x-2 text-white hover:text-indigo-400 transition-colors"
              >
                <Rocket className="h-8 w-8" />
                <span className="font-bold text-xl">Dev Mate</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            {user && (
              <div className="hidden md:flex items-center space-x-4">
                <p className="text-indigo-400 font-medium">
                  Welcome, {user.firstName}
                </p>
                <div
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                >
                  <button
                    className="flex items-center space-x-2"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-indigo-500 hover:ring-indigo-400 transition-all">
                      <img
                        alt="user photo"
                        src={user?.photoUrl}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>

                  {/* Desktop Dropdown */}
                  <div
                    className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 transition-all duration-200 ${
                      isDropdownOpen
                        ? "opacity-100 visible transform translate-y-0"
                        : "opacity-0 invisible transform -translate-y-2"
                    }`}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    {menuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile menu button */}
            {user && (
              <div className="md:hidden mr-0">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-300 hover:text-white focus:outline-none"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {user && (
          <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900">
              <div className="flex items-center space-x-3 px-3 py-2">
                <img
                  alt="user photo"
                  src={user?.photoUrl}
                  className="w-10 h-10 rounded-full ring-2 ring-indigo-500"
                />
                <p className="text-indigo-400 font-medium">{user.firstName}</p>
              </div>
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-2 text-gray-300 hover:bg-gray-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogoutClick}
                className="flex items-center space-x-2 text-red-400 hover:bg-gray-800 hover:text-red-300 w-full px-3 py-2 rounded-md text-base font-medium"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 transform transition-all">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to log out? You'll need to sign in again to
              access your account.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
