import { useState, useEffect } from "react"
import { Crown, Users, Check, X, Clock, MessageCircle, PartyPopper, Sparkles, Star, Zap } from "lucide-react"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Alert, AlertDescription } from "./ui/alert"

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    verifyPremiumUser()
  }, [])

  useEffect(() => {
    // Dynamically load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      console.log("Razorpay script loaded successfully.")
    }

    script.onerror = () => {
      console.error("Failed to load Razorpay script.")
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      })

      if (res.data.isPremium) {
        setIsUserPremium(true)
      }
    } catch (error) {
      console.error("Error verifying premium status:", error)
    }
  }

  const handleMembership = async (membershipType) => {
    if (isUserPremium) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 5000)
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post(
        `${BASE_URL}/payment/create-order`,
        { membershipType },
        { withCredentials: true },
      )

      const { amount, currency, keyId, orderId, notes } = response.data

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
            contact: "9999999999",
          },
          theme: {
            color: membershipType === "diamond" ? "#3B82F6" : "#10B981",
          },
          handler: () => {
            verifyPremiumUser()
            setShowCelebration(true)
            setTimeout(() => setShowCelebration(false), 5000)
          },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        console.error("Razorpay SDK not loaded.")
      }
    } catch (error) {
      console.error("Error during membership handling:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const plans = [
    {
      name: "Emerald",
      price: "₹300",
      duration: "3 months",
      color: "emerald",
      popular: false,
      features: [
        { icon: Users, text: "Follow up to 50 users per day", included: true },
        { icon: MessageCircle, text: "Chat with other developers", included: true },
        { icon: Clock, text: "3 months validity", included: true },
        { icon: Crown, text: "Premium badge", included: false },
        { icon: Zap, text: "Priority support", included: false },
      ],
    },
    {
      name: "Diamond",
      price: "₹1200",
      duration: "6 months",
      color: "blue",
      popular: true,
      features: [
        { icon: Users, text: "Follow up to 100 users per day", included: true },
        { icon: MessageCircle, text: "Chat with other developers", included: true },
        { icon: Crown, text: "Premium badge", included: true },
        { icon: Zap, text: "Priority support", included: true },
        { icon: Clock, text: "6 months validity", included: true },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center">
              <div className="flex justify-center gap-4 mb-6">
                <PartyPopper className="w-12 h-12 text-yellow-500 animate-bounce" />
                <Crown className="w-12 h-12 text-blue-500 animate-bounce [animation-delay:0.2s]" />
                <PartyPopper className="w-12 h-12 text-yellow-500 animate-bounce [animation-delay:0.4s]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">You're Already Premium! 🎉</h2>
              <div className="relative mb-6">
                <p className="text-gray-600 leading-relaxed">
                  You're already enjoying all the exclusive benefits of our premium membership. Thank you for being an
                  amazing premium member!
                </p>
                <Sparkles className="absolute -right-2 -top-2 text-yellow-400 animate-pulse w-6 h-6" />
                <Sparkles className="absolute -left-2 -bottom-2 text-yellow-400 animate-pulse w-6 h-6" />
              </div>
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold"
                >
                  <Link to="/app">Continue to Dashboard</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCelebration(false)}
                  className="w-full h-12 border-gray-200 hover:bg-gray-50 font-semibold"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock premium features and supercharge your developer networking experience
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative shadow-lg hover:shadow-xl transition-all duration-300 border-0 ${
                plan.popular ? "ring-2 ring-blue-500 scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 hover:bg-blue-500 text-white px-4 py-1 text-sm font-semibold">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md ${
                      plan.color === "emerald"
                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                        : "bg-gradient-to-br from-blue-500 to-blue-600"
                    }`}
                  >
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">/ {plan.duration}</span>
                </div>
                <p className="text-gray-600">
                  Perfect for {plan.name === "Emerald" ? "getting started" : "power users"}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      {feature.included ? (
                        <Check
                          className={`h-5 w-5 mr-3 ${plan.color === "emerald" ? "text-emerald-500" : "text-blue-500"}`}
                        />
                      ) : (
                        <X className="h-5 w-5 mr-3 text-gray-400" />
                      )}
                      <feature.icon
                        className={`h-4 w-4 mr-2 ${feature.included ? "text-gray-700" : "text-gray-400"}`}
                      />
                      <span className={feature.included ? "text-gray-700" : "text-gray-400"}>{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleMembership(plan.name.toLowerCase())}
                  disabled={isLoading}
                  className={`w-full h-12 font-semibold text-white shadow-md hover:shadow-lg transition-all ${
                    plan.color === "emerald"
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : isUserPremium ? (
                    "Already Premium"
                  ) : (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Get {plan.name}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <Alert className="bg-blue-50 border-blue-200">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            All plans include basic features like profile customization, messaging, and access to our developer
            community. Upgrade anytime to unlock more powerful networking tools.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

export default Premium
