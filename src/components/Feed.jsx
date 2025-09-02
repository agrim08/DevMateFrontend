import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { addFeed } from "../utils/feedSlice"
import { useEffect } from "react"
import UserCard from "./UserCard"
import { Users, UserPlus, Sparkles } from "lucide-react"
import FullScreenLoader from "./FullScreenLoader"
import EmptyState from "./EmptyState"

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
    return <FullScreenLoader message="Discovering amazing developers..." />
  }

  if (feed.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No New Connections"
        description="You've seen all available profiles for now. Check back later for new developers to connect with!"
      >
        <div className="flex items-center justify-center gap-2 text-blue-600">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium">More profiles coming soon</span>
        </div>
      </EmptyState>
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
