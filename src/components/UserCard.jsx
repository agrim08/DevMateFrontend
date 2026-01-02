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
          font-size: 32px;
          animation: heartFloat 2s ease-out forwards;
          pointer-events: none;
          z-index: 1000;
        }

        .floating-x {
          position: absolute;
          font-size: 32px;
          animation: xFloat 2s ease-out forwards;
          pointer-events: none;
          z-index: 1000;
        }
      `}</style>


      <div className="flex justify-center flex-1 items-center p-4 font-sans h-[calc(100vh-200px)] min-h-[500px]">
        <div className={`relative w-full max-w-sm h-full transition-all duration-500 ease-out ${isLoading ? "card-loading" : ""}`}>
          
          {/* Main Card Container */}
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-gray-900 group">
            
            {/* Background Image or Fallback */}
            <div className="absolute inset-0 w-full h-full">
              {photoUrl ? (
                <img 
                  src={photoUrl} 
                  alt={`${firstName} ${lastName}`}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                   <span className="text-9xl font-bold text-white/20 select-none">
                     {firstName?.charAt(0)?.toUpperCase()}
                   </span>
                </div>
              )}
              
              {/* Dark Gradient Overlay - Deeper gradient for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/90" />
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 w-[80%] p-6 text-white text-left z-10 flex flex-col gap-2">
              
              {/* Name & Age */}
              <div className="flex items-baseline gap-3">
                <h2 className="text-3xl font-bold tracking-tight drop-shadow-md">
                  {firstName} {lastName}
                </h2>
                {userAge && (
                  <span className="text-xl font-medium opacity-90 drop-shadow-sm">
                    {userAge}
                  </span>
                )}
              </div>

              {/* Gender & Skills Summary */}
              <div className="flex flex-wrap items-center gap-2 text-sm font-medium opacity-90 mb-1">
                {gender && (
                  <span className="capitalize px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full shadow-sm">
                    {gender}
                  </span>
                )}
                {skillsArray.slice(0, 3).map((skill, idx) => (
                   <span key={idx} className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full truncate max-w-[100px] shadow-sm">
                     {skill}
                   </span>
                ))}
              </div>

              {/* Bio */}
              {bio && (
                 <p className="text-sm text-gray-200 line-clamp-2 drop-shadow-sm leading-relaxed">
                   {bio}
                 </p>
              )}
            </div>

            {/* Right Side Action Buttons */}
            <div className="absolute bottom-6 right-4 flex flex-col items-center gap-4 z-20">
              
              {/* Connect Button */}
               <Button
                ref={connectButtonRef}
                onClick={() => handleSendRequest("interested", _id)}
                disabled={isLoading}
                className={`w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-none flex items-center justify-center ${
                    showHearts ? "scale-110 brightness-110" : ""
                }`}
              >
                <Heart className="w-7 h-7 fill-current" strokeWidth={2.5} />
              </Button>

              {/* Pass Button */}
              <Button
                ref={passButtonRef}
                onClick={() => handleSendRequest("ignored", _id)}
                disabled={isLoading}
                className={`w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm text-red-500 shadow-lg hover:bg-white hover:scale-110 active:scale-95 transition-all duration-300 border border-gray-100 flex items-center justify-center ${
                    showXMarks ? "scale-110 bg-red-50" : ""
                }`}
              >
                <X className="w-7 h-7" strokeWidth={2.5} />
              </Button>

            </div>
          </div>
        </div>

        {/* Loading State Overlay */}
        {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
        )}
      </div>
    </>
  )
}

export default UserCard
