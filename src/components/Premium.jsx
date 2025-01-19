import React, { useState, useEffect } from "react";
import {
  Crown,
  Users,
  Check,
  X,
  Clock,
  MessageCircleIcon,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Link, useNavigate } from "react-router-dom";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  useEffect(() => {
    // Dynamically load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log("Razorpay script loaded successfully.");
    };

    script.onerror = () => {
      console.error("Failed to load Razorpay script.");
    };
  }, []);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });

      if (res.data.isPremium) {
        setIsUserPremium(true);
      }
    } catch (error) {
      console.error("Error verifying premium status:", error);
    }
  };

  const handleMembership = async (membershipType) => {
    if (isUserPremium) {
      setShowCelebration(true);
      // Auto-hide celebration after 5 seconds
      setTimeout(() => setShowCelebration(false), 5000);
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/payment/create-order`,
        { membershipType },
        { withCredentials: true }
      );

      const { amount, currency, keyId, orderId, notes } = response.data;

      // Ensure Razorpay is loaded
      if (typeof window.Razorpay !== "undefined") {
        const options = {
          key: keyId,
          amount,
          currency,
          name: "DevMate",
          description: "Connect to like-minded developers",
          order_id: orderId,
          prefill: {
            name: `${notes?.firstName} ${notes?.lastName}`,
            email: notes?.emailId,
            contact: "9999999999", // You may replace this with dynamic contact
          },
          theme: {
            color: membershipType === "diamond" ? "#6366F1" : "#10B981",
          },
          handler: () => {
            verifyPremiumUser();
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 5000);
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        console.error("Razorpay SDK not loaded.");
      }
    } catch (error) {
      console.error("Error during membership handling:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-[bounce_1s_ease-in-out]">
            <div className="text-center">
              <div className="flex justify-center gap-4 mb-6">
                <PartyPopper className="w-10 h-10 text-yellow-500 animate-[bounce_2s_infinite]" />
                <Crown className="w-10 h-10 text-purple-500 animate-[bounce_2s_infinite_0.2s]" />
                <PartyPopper className="w-10 h-10 text-yellow-500 animate-[bounce_2s_infinite_0.4s]" />
              </div>
              <Link to="/">
                <button className="text-3xl font-bold text-gray-800 mb-4">
                  You're Already Premium! 🎉
                </button>
              </Link>
              <div className="relative">
                <p className="text-gray-600 mb-6">
                  You're already enjoying all the exclusive benefits of our
                  premium membership. Thank you for being an amazing premium
                  member!
                </p>
                <Sparkles className="absolute -right-4 -top-4 text-yellow-400 animate-pulse" />
                <Sparkles className="absolute -left-4 -bottom-4 text-yellow-400 animate-pulse" />
              </div>
              <button
                onClick={() => setShowCelebration(false)}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Continue Enjoying Premium
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-100">
            Unlock premium features and connect with more friends
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Emerald</h2>
              <span className="text-2xl font-bold text-gray-900">₹300</span>
            </div>
            <p className="text-gray-600 mb-6">Perfect for getting started</p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-600 mr-3" />
                <span className="text-gray-700">
                  Follow up to 50 users per day
                </span>
              </div>
              <div className="flex items-center">
                <MessageCircleIcon className="h-5 w-5 text-gray-600 mr-3" />
                <span className="text-gray-700">
                  Chat with other developers
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-600 mr-3" />
                <span className="text-gray-700">3 months Validity</span>
              </div>
              <div className="flex items-center">
                <X className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-gray-700">Premium badge</span>
              </div>
              <div className="flex items-center">
                <X className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-gray-700">Priority support</span>
              </div>
            </div>
            <button
              className="w-full py-3 px-6 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors duration-200"
              onClick={() => handleMembership("emerald")}
              type="button"
            >
              {isUserPremium ? "Already Premium" : "Buy Emerald"}
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8 border-2 border-indigo-500 relative">
            <div className="absolute -top-4 right-4 bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Popular
            </div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Diamond</h2>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">₹1200</span>
              </div>
            </div>
            <p className="text-gray-600 mb-6">Unlock all premium features</p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-indigo-500 mr-3" />
                <span className="text-gray-700">
                  Follow up to 100 users per day
                </span>
              </div>
              <div className="flex items-center">
                <MessageCircleIcon className="h-5 w-5 text-indigo-500 mr-3" />
                <span className="text-gray-700">
                  Chat with other developers
                </span>
              </div>
              <div className="flex items-center">
                <Crown className="h-5 w-5 text-indigo-500 mr-3" />
                <span className="text-gray-700">Premium badge</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 text-indigo-500 mr-3" />
                <span className="text-gray-700">Priority support</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-indigo-500 mr-3" />
                <span className="text-gray-700">6 months Validity</span>
              </div>
            </div>
            <button
              className="w-full py-3 px-6 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors duration-200 flex items-center justify-center"
              onClick={() => handleMembership("diamond")}
            >
              <Crown className="h-5 w-5 mr-2" />
              {isUserPremium ? "Already Premium" : "Buy Diamond"}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 mt-8 text-sm">
          All plans include basic features like profile customization and
          messaging
        </p>
      </div>
    </div>
  );
};

export default Premium;
