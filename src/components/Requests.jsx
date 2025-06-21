import { useEffect } from "react"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { addRequest, removeRequest } from "../utils/requestSlice"
import { Loader2, UserPlus, Check, X, Briefcase, Calendar, MapPin } from "lucide-react"
import toast from "react-hot-toast"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"

const Requests = () => {
  const dispatch = useDispatch()
  const requests = useSelector((store) => store.request)

  const handleRequest = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/pending`, {
        withCredentials: true,
      })
      dispatch(addRequest(res?.data?.data))
    } catch (error) {
      console.error(error.message)
      toast.error("Failed to load requests")
    }
  }

  useEffect(() => {
    handleRequest()
  }, [])

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(`${BASE_URL}/request/review/${status}/${_id}`, {}, { withCredentials: true })
      dispatch(removeRequest(_id))
      toast.success(status === "accepted" ? "🎉 New connection added!" : "Request declined")
    } catch (error) {
      console.error(error.message)
      toast.error("Failed to process request")
    }
  }

  if (!requests) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading connection requests...</p>
        </div>
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full shadow-lg">
          <CardContent className="text-center p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserPlus className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">All Caught Up!</h1>
            <p className="text-gray-600 mb-6">You have no pending connection requests at the moment</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <a href="/">Discover More Developers</a>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Connection Requests</h1>
          <p className="text-xl text-gray-600 mb-4">
            {requests.length} Pending Request{requests.length !== 1 ? "s" : ""} to Review
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full" />
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => {
            const { firstName, lastName, photoUrl, bio, skills, userAge, gender } = request?.fromUserId
            const skillsArray = typeof skills === "string" ? skills.split(",").map((s) => s.trim()) : skills || []

            return (
              <Card
                key={request?._id}
                className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white"
              >
                <CardHeader className="text-center pb-4">
                  <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-blue-100">
                    <AvatarImage src={photoUrl || "/placeholder.svg"} alt={`${firstName} ${lastName}`} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xl font-bold">
                      {firstName?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
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

                <CardContent className="space-y-4">
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

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => reviewRequest("rejected", request?._id)}
                      variant="outline"
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                    <Button
                      onClick={() => reviewRequest("accepted", request?._id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Requests
