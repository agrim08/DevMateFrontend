"use client"

import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { addFeed } from "../utils/feedSlice"
import { useEffect } from "react"
import UserCard from "./UserCard"
import { Loader2, Users, UserPlus, Sparkles } from "lucide-react"
import { Card, CardContent } from "./ui/card"

const Feed = () => {
  const dispatch = useDispatch()
  const feed = useSelector((store) => store.feed)

  const getFeed = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/feed`, {
        withCredentials: true,
      })
      dispatch(addFeed(res?.data?.data))
    } catch (error) {
      console.error(error.message)
      return
    }
  }

  useEffect(() => {
    getFeed()
  }, [])

  if (!feed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Discovering amazing developers...</p>
        </div>
      </div>
    )
  }

  if (feed.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full shadow-lg">
          <CardContent className="text-center p-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No New Connections</h1>
            <p className="text-gray-600 mb-6">
              You've seen all available profiles for now. Check back later for new developers to connect with!
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">More profiles coming soon</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Developers</h1>
          <p className="text-gray-600">Connect with amazing developers from around the world</p>
        </div>

        {/* User Card */}
        <div className="flex justify-center">
          <UserCard user={feed[0]} />
        </div>

        {/* Stats */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border">
            <UserPlus className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">
              {feed.length} profile{feed.length !== 1 ? "s" : ""} remaining
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feed
