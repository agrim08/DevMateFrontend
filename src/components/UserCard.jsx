"use client"

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

const UserCard = ({ user }) => {
  const dispatch = useDispatch()

  if (!user) return null
  const { _id, firstName, lastName, photoUrl, userAge, gender, bio, skills } = user

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(`${BASE_URL}/request/send/${status}/${userId}`, {}, { withCredentials: true })

      dispatch(removeUserFromFeed(userId))

      toast.success(status === "interested" ? "Follow Request sent!" : "User ignored successfully")
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      console.error(error)
    }
  }

  const skillsArray = typeof skills === "string" ? skills.split(",").map((s) => s.trim()) : skills || []

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white">
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
              onClick={() => handleSendRequest("ignored", _id)}
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Pass
            </Button>
            <Button
              onClick={() => handleSendRequest("interested", _id)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Heart className="w-4 h-4 mr-2" />
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserCard
