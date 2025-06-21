import { BASE_URL } from "../utils/constants"
import axios from "axios"
import { useDispatch } from "react-redux"
import { removeUserFromFeed } from "../utils/feedSlice"
import { User, Heart, X, Calendar, Briefcase } from "lucide-react"
import toast from "react-hot-toast"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { useState, useRef } from "react"

const UserCard = ({ user }) => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [showHearts, setShowHearts] = useState(false)
  const [showXMarks, setShowXMarks] = useState(false)
  const connectButtonRef = useRef(null)
  const passButtonRef = useRef(null)

  if (!user) return null
  const { _id, firstName, lastName, photoUrl, userAge, gender, bio, skills } = user

  const createFloatingElements = (type, buttonRef) => {
    if (!buttonRef.current) return

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const buttonCenterX = buttonRect.left + buttonRect.width / 2
    const buttonCenterY = buttonRect.top + buttonRect.height / 2

    const container = document.createElement("div")
    container.className = `fixed inset-0 pointer-events-none z-50 ${type === "hearts" ? "hearts-container" : "x-marks-container"}`
    document.body.appendChild(container)

    for (let i = 0; i < 8; i++) {
      const element = document.createElement("div")
      element.className = `floating-${type === "hearts" ? "heart" : "x"}`
      element.innerHTML = type === "hearts" ? "❤️" : "❌"

      // Position elements at button center initially
      element.style.left = buttonCenterX + "px"
      element.style.top = buttonCenterY + "px"
      element.style.transform = "translate(-50%, -50%)"
      element.style.animationDelay = Math.random() * 0.3 + "s"

      // Add random spread direction
      const angle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.5
      element.style.setProperty("--spread-x", Math.cos(angle) * (50 + Math.random() * 30) + "px")
      element.style.setProperty("--spread-y", Math.sin(angle) * (50 + Math.random() * 30) + "px")

      container.appendChild(element)
    }

    setTimeout(() => {
      document.body.removeChild(container)
    }, 2000)
  }

  const handleSendRequest = async (status, userId) => {
    if (isLoading) return

    setIsLoading(true)

    // Show animations from respective buttons
    if (status === "interested") {
      setShowHearts(true)
      createFloatingElements("hearts", connectButtonRef)
      setTimeout(() => setShowHearts(false), 1000)
    } else {
      setShowXMarks(true)
      createFloatingElements("x", passButtonRef)
      setTimeout(() => setShowXMarks(false), 1000)
    }

    try {
      await axios.post(`${BASE_URL}/request/send/${status}/${userId}`, {}, { withCredentials: true })

      // Show toast notification
      if (status === "interested") {
        toast.success("💝 Connection request sent!", {
          position: "bottom-right",
          duration: 3000,
          style: {
            background: "#10B981",
            color: "white",
            fontWeight: "500",
          },
        })
      } else {
        toast.success("👋 Profile skipped", {
          position: "bottom-right",
          duration: 2000,
          style: {
            background: "#6B7280",
            color: "white",
            fontWeight: "500",
          },
        })
      }

      // Add delay before removing user for better UX
      setTimeout(() => {
        dispatch(removeUserFromFeed(userId))
        setIsLoading(false)
      }, 800)
    } catch (error) {
      setIsLoading(false)
      toast.error("Something went wrong. Please try again.", {
        position: "bottom-right",
        duration: 3000,
      })
      console.error(error)
    }
  }

  const skillsArray = typeof skills === "string" ? skills.split(",").map((s) => s.trim()) : skills || []

  return (
    <>
      <style jsx>{`
        @keyframes heartFloat {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          15% {
            transform: translate(calc(-50% + var(--spread-x, 0px)), calc(-50% + var(--spread-y, -20px))) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--spread-x, 0px) * 2), calc(-50% + var(--spread-y, -20px) * 3 - 100px)) scale(0.3);
            opacity: 0;
          }
        }

        @keyframes xFloat {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            transform: translate(calc(-50% + var(--spread-x, 0px)), calc(-50% + var(--spread-y, -20px))) scale(1.2) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--spread-x, 0px) * 2), calc(-50% + var(--spread-y, -20px) * 3 - 100px)) scale(0.3) rotate(360deg);
            opacity: 0;
          }
        }

        .floating-heart {
          position: absolute;
          font-size: 24px;
          animation: heartFloat 2s ease-out forwards;
          pointer-events: none;
          z-index: 1000;
        }

        .floating-x {
          position: absolute;
          font-size: 24px;
          animation: xFloat 2s ease-out forwards;
          pointer-events: none;
          z-index: 1000;
        }

        .card-loading {
          opacity: 0.7;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
      `}</style>

      <div className={`w-full max-w-2xl mx-auto transition-all duration-300 ${isLoading ? "card-loading" : ""}`}>
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white relative overflow-hidden">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600 font-medium">Loading next profile...</p>
              </div>
            </div>
          )}

          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <Avatar className="w-32 h-32 ring-4 ring-blue-100">
                  <AvatarImage src={photoUrl || "/placeholder.svg"} alt={`${firstName} ${lastName}`} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl font-bold">
                    {firstName?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{`${firstName || ""} ${lastName || ""}`}</h2>

                {/* User Details */}
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start mb-4">
                  {userAge && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">{userAge} years</span>
                    </div>
                  )}
                  {gender && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium capitalize">{gender}</span>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {bio && (
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed text-sm">{bio}</p>
                  </div>
                )}

                {/* Skills */}
                {skillsArray.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-700">Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillsArray.slice(0, 6).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                          {skill}
                        </Badge>
                      ))}
                      {skillsArray.length > 6 && (
                        <Badge variant="outline" className="text-gray-500">
                          +{skillsArray.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                ref={passButtonRef}
                onClick={() => handleSendRequest("ignored", _id)}
                variant="outline"
                disabled={isLoading}
                className={`flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 ${
                  showXMarks ? "animate-pulse bg-red-50" : ""
                }`}
              >
                <X className="w-4 h-4 mr-2" />
                Pass
              </Button>
              <Button
                ref={connectButtonRef}
                onClick={() => handleSendRequest("interested", _id)}
                disabled={isLoading}
                className={`flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200 ${
                  showHearts ? "animate-pulse from-pink-500 to-red-500" : ""
                }`}
              >
                <Heart className="w-4 h-4 mr-2" />
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default UserCard
