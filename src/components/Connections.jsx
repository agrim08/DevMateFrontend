"use client"

import { useEffect } from "react"
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { addConnection } from "../utils/connectionSlice"
import axios from "axios"
import { MessageCircle, Loader2, Users, Briefcase, Calendar, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"

const Connections = () => {
  const dispatch = useDispatch()
  const connectionData = useSelector((store) => store?.connection)

  const handleConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      })
      dispatch(addConnection(res?.data?.data))
    } catch (error) {
      console.error(error.response?.data)
    }
  }

  useEffect(() => {
    handleConnections()
  }, [])

  if (!connectionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your connections...</p>
        </div>
      </div>
    )
  }

  if (connectionData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full shadow-lg">
          <CardContent className="text-center p-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Connections Yet</h1>
            <p className="text-gray-600 mb-6">
              Start connecting with other developers to build your professional network!
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/app">Discover Developers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Network</h1>
          <p className="text-xl text-gray-600 mb-4">
            Connected with {connectionData.length} professional{connectionData.length !== 1 ? "s" : ""}
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full" />
        </div>

        {/* Connections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connectionData.map((connection) => {
            const { _id, photoUrl, skills, userAge, firstName, lastName, bio, gender } = connection
            const skillsArray = typeof skills === "string" ? skills.split(",").map((s) => s.trim()) : skills || []

            return (
              <Card key={_id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white flex flex-col h-full">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center">
                    <Avatar className="w-24 h-24 mb-4 ring-4 ring-blue-100">
                      <AvatarImage src={photoUrl || "/placeholder.svg"} alt={`${firstName} ${lastName}`} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-4xl font-bold flex items-center justify-center">
                        {firstName?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{`${firstName || ""} ${lastName || ""}`}</h3>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                    {userAge && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{userAge} years</span>
                      </div>
                    )}
                    {gender && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="capitalize">{gender}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col">
                  {/* Bio */}
                  {bio && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">About</p>
                      <p className="text-gray-600 text-sm line-clamp-3">{bio}</p>
                    </div>
                  )}

                  {/* Skills */}
                  {skillsArray.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-1 mb-2">
                        <Briefcase className="w-4 h-4 text-gray-600" />
                        <p className="text-sm font-medium text-gray-700">Skills</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {skillsArray.slice(0, 4).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                            {skill}
                          </Badge>
                        ))}
                        {skillsArray.length > 4 && (
                          <Badge variant="outline" className="text-xs text-gray-500">
                            +{skillsArray.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Spacer to push button to the bottom */}
                  <div className="flex-1" />

                  {/* Chat Button */}
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2">
                    <Link to={`/app/chat/${_id}`} className="flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Start Conversation</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Connections