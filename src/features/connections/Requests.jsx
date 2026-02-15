import { useEffect, useState } from "react"
import axiosInstance from "../../api/axiosInstance"
import { useDispatch, useSelector } from "react-redux"
import { addRequest, removeRequest } from "../../store/slices/requestSlice"
import { toast } from "sonner"
import { UserPlus, Check, X, MapPin, Inbox, ShieldCheck } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import FullScreenLoader from "../../components/common/FullScreenLoader"
import EmptyState from "../../components/common/EmptyState"
import { motion, AnimatePresence } from "framer-motion"

const Requests = () => {
  const dispatch = useDispatch()
  const requests = useSelector((store) => store.request)

  const [reviewLoading, setReviewLoading] = useState(null) // { id: string, status: 'accepted' | 'rejected' }

  const handleRequest = async () => {
    try {
      const res = await axiosInstance.get("/user/requests/pending")
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
      setReviewLoading({ id: _id, status })
      await axiosInstance.post(`/request/review/${status}/${_id}`)
      dispatch(removeRequest(_id))
      toast.success(status === "accepted" ? "🎉 Connection established!" : "Request dismissed", {
        position: "bottom-right",
      })
    } catch (error) {
      console.error(error.message)
      toast.error("Failed to process request")
    } finally {
      setReviewLoading(null)
    }
  }

  if (!requests) {
    return <FullScreenLoader message="Loading requests..." />
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
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wide">
                    <UserPlus className="w-4 h-4" />
                    <span>Connection Requests</span>
                </div>
                <h1 className="text-4xl font-bold text-foreground tracking-tight">
                    Requests
                </h1>
            </div>
            <div className="hidden md:block text-right">
                <span className="text-3xl font-bold text-primary/20">{requests.length}</span>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Pending Review</p>
            </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          <AnimatePresence>
            {requests.map((request, idx) => {
                const { firstName, lastName, photoUrl, bio, skills, gender, membershipType } = request?.fromUserId
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
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold text-foreground leading-none">{`${firstName} ${lastName}`}</h3>
                                {membershipType === "emerald" && (
                                    <div className="group/badge relative">
                                        <div className="p-0.5 rounded-full">
                                            <ShieldCheck className="w-4 h-4 text-primary/60 fill-primary/5" />
                                        </div>
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-foreground text-background text-[10px] font-bold rounded opacity-0 group-hover/badge:opacity-100 transition-opacity whitespace-nowrap uppercase">Emerald</span>
                                    </div>
                                )}
                                {membershipType === "diamond" && (
                                    <div className="group/badge relative">
                                        <div className="p-0.5 rounded-full">
                                            <ShieldCheck className="w-4 h-4 text-primary fill-primary/10 animate-pulse" />
                                        </div>
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded opacity-0 group-hover/badge:opacity-100 transition-opacity whitespace-nowrap uppercase">Diamond</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                <MapPin className="w-3 h-3" />
                                <span className="capitalize">{gender || 'Developer'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 md:max-w-xs">
                        <p className="text-sm text-muted-foreground font-medium line-clamp-2">
                            {bio || "Looking to connect for potential collaborations."}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={() => reviewRequest("rejected", request?._id)}
                            loading={reviewLoading?.id === request?._id && reviewLoading?.status === "rejected"}
                            variant="ghost"
                            className="h-11 w-11 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                        <Button
                            onClick={() => reviewRequest("accepted", request?._id)}
                            loading={reviewLoading?.id === request?._id && reviewLoading?.status === "accepted"}
                            className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                        >
                            {!(reviewLoading?.id === request?._id && reviewLoading?.status === "accepted") && <Check className="w-5 h-5" />}
                            <span className="hidden sm:inline">Accept Request</span>
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
