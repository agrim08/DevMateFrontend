import { useEffect } from "react"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { addRequest, removeRequest } from "../utils/requestSlice"
import { toast } from "sonner"
import { UserPlus, Check, X, MapPin, Inbox } from "lucide-react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import FullScreenLoader from "./FullScreenLoader"
import EmptyState from "./EmptyState"
import { motion, AnimatePresence } from "framer-motion"

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
      toast.success(status === "accepted" ? "🎉 Connection established!" : "Request dismissed", {
        position: "bottom-right",
      })
    } catch (error) {
      console.error(error.message)
      toast.error("Failed to process request")
    }
  }

  if (!requests) {
    return <FullScreenLoader message="Scanning incoming signals..." />
  }

  if (requests.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Inbox Zero"
        description="You've processed all incoming connection requests. Great job staying organized!"
        buttonText="Find More Developers"
        buttonLink="/app"
      />
    )
  }

  return (
    <div className="min-h-screen bg-background pt-12 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 border-b border-border pb-8">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                    <UserPlus className="w-4 h-4" />
                    <span>Inbound Requests</span>
                </div>
                <h1 className="text-4xl font-black text-foreground tracking-tight">
                    Review Queue
                </h1>
            </div>
            <div className="hidden md:block text-right">
                <span className="text-3xl font-black text-primary/20">{requests.length}</span>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pending Review</p>
            </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          <AnimatePresence>
            {requests.map((request, idx) => {
                const { firstName, lastName, photoUrl, bio, skills, gender } = request?.fromUserId
                const skillsArray = typeof skills === "string" ? skills.split(",").map((s) => s.trim()) : skills || []

                return (
                <motion.div
                    key={request?._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.05 }}
                    className="premium-card bg-card p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-6 group"
                >
                    <div className="flex items-center gap-4 flex-1">
                        <Avatar className="w-16 h-16 border border-border shadow-sm">
                            <AvatarImage src={photoUrl} className="object-cover" />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                {firstName[0]}{lastName[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-foreground leading-none">{`${firstName} ${lastName}`}</h3>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                <MapPin className="w-3 h-3" />
                                <span className="capitalize">{gender || 'Developer'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 md:max-w-xs">
                        <p className="text-sm text-muted-foreground font-medium line-clamp-2 italic">
                            {bio || "Looking to connect for potential collaborations."}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={() => reviewRequest("rejected", request?._id)}
                            variant="ghost"
                            className="h-11 w-11 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                        <Button
                            onClick={() => reviewRequest("accepted", request?._id)}
                            className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            <span className="hidden sm:inline">Accept</span>
                        </Button>
                    </div>
                </motion.div>
                )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Requests
