import axiosInstance from "../../api/axiosInstance"
import { useDispatch, useSelector } from "react-redux"
import { addFeed } from "../../store/slices/feedSlice"
import { useEffect } from "react"
import UserCard from "./UserCard"
import { Users, Search, RefreshCw } from "lucide-react"
import FullScreenLoader from "../../components/common/FullScreenLoader"
import EmptyState from "../../components/common/EmptyState"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/button"

const Feed = () => {
  const dispatch = useDispatch()
  const feedData = useSelector((store) => store.feed)
  const feed = feedData?.items 
  const limitReached = feedData?.limitReached

  const getFeed = async () => {
    try {
      const res = await axiosInstance.get("/feed")
      dispatch(addFeed(res?.data?.data))
    } catch (error) {
      console.error("Feed error:", error.message)
    }
  }

  useEffect(() => {
    getFeed()
  }, [])

  if (!feed) {
    return <FullScreenLoader message="Scanning for top developers..." />
  }

  if (feed.length === 0 && !limitReached) {
    return (
      <EmptyState
        icon={Search}
        title="No developers found"
        description="We've swept through the network but couldn't find any more developers in your area for now."
      >
        <Button 
          variant="outline" 
          onClick={getFeed}
          className="mt-4 gap-2 rounded-full px-6"
        >
          <RefreshCw className="w-4 h-4" />
          Refetch Pipeline
        </Button>
      </EmptyState>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background flex flex-col items-center">
      {/* Search Header */}
      <div className="w-full max-w-2xl px-4 pt-12 text-center space-y-4">
        <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-2"
        >
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            Discover People
          </h1>
          <p className="text-muted-foreground font-medium max-w-sm mx-auto">
            Connect with technical founders and software engineers building the next big thing.
          </p>
        </motion.div>
      </div>

      {/* Main Discover Card */}
      <div className="flex-1 flex flex-col items-center justify-center w-full p-4">
        {limitReached && (
           <div className="mb-6 px-6 py-3 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
              <Zap className="w-4 h-4 text-destructive animate-pulse" />
              <span className="text-xs font-bold text-destructive uppercase tracking-widest">Daily Limit Reached</span>
           </div>
        )}

        {feed.length > 0 ? (
          <div className="relative w-full max-w-md">
             <UserCard user={feed[0]} limitReached={limitReached} />
             
             {/* Card count indicator - very subtle */}
             <div className="mt-8 text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  {feed.length} profiles available in queue
                </span>
             </div>
          </div>
        ) : (
          <EmptyState
            icon={Zap}
            title="Daily Limit Reached"
            description="You've reached your daily interaction limit. Upgrade to Premium for unlimited connections or come back tomorrow."
          >
             <Button 
                variant="outline" 
                onClick={() => window.location.href='/premium'}
                className="mt-4 gap-2 rounded-full px-6 border-primary/20 text-primary hover:bg-primary/5"
             >
                <Zap className="w-4 h-4" />
                Upgrade Membership
             </Button>
          </EmptyState>
        )}
      </div>
    </div>
  )
}

export default Feed
