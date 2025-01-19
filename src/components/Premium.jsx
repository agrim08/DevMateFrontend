import React from "react";
import {
  Crown,
  Users,
  Check,
  X,
  Clock,
  Instagram,
  MessageCircleIcon,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Premium = () => {
  const handleMembership = async (membershipType) => {
    const order = await axios.post(
      `${BASE_URL}/payment/create-order`,
      { membershipType: membershipType },
      { withCredentials: true }
    );

    const { amount, currency, keyId, orderId, notes } = order.data;

    const options = {
      key: rzp_test_cJzPpPnLBEuYEy, // Replace with your Razorpay key_id
      amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: currency,
      name: "DevMate",
      description: "Connect to like-minded developers",
      order_id: orderId, // This is the order_id created in the backend
      prefill: {
        name: `${notes?.firstName} ${notes?.lastName}`,
        email: notes?.emailId,
        contact: "9999999999",
      },
      theme: {
        color: membershipType === "diamond" ? "#6366F1" : "#10B981",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 to-gray-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600">
            Unlock premium features and connect with more friends
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-8 border border-gray-100">
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
              type="click"
            >
              Buy Emerald
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8 border-2 border-indigo-500 relative">
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
              Buy Diamond
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
