import axiosInstance from "../../api/axiosInstance"
import { useDispatch, useSelector } from "react-redux"
import { removeUserFromFeed } from "../../store/slices/feedSlice"
import { Heart, X, MapPin, Briefcase, Code, Terminal, ExternalLink, ShieldCheck, Zap } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const UserCard = ({ user, isPreview = false }) => {
  const dispatch = useDispatch()
  const onlineUsers = useSelector((store) => store.chat.onlineUsers)
  const isOnline = onlineUsers.includes(user?._id)

  if (!user) return null
  const { _id, firstName, lastName, photoUrl, userAge, gender, bio, skills, membershipType } = user

  const getBadge = () => {
    if (membershipType === "emerald") {
      return (
        <div className="group/badge relative">
          <ShieldCheck className="w-6 h-6 text-primary/60 fill-primary/5 drop-shadow-md" /> 
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-foreground text-background text-[10px] font-bold rounded opacity-0 group-hover/badge:opacity-100 transition-opacity whitespace-nowrap">EMERALD Member</span>
        </div>
      )
    }
    if (membershipType === "diamond") {
      return (
        <div className="group/badge relative">
          <ShieldCheck className="w-6 h-6 text-primary fill-primary/10 drop-shadow-md animate-pulse" />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded opacity-0 group-hover/badge:opacity-100 transition-opacity whitespace-nowrap">DIAMOND Member</span>
        </div>
      )
    }
    return null
  }

  const [loadingAction, setLoadingAction] = useState(null) // 'ignored' or 'interested'

  const handleSendRequest = async (status, userId) => {
    if (loadingAction || isPreview) return
    setLoadingAction(status)

    try {
      await axiosInstance.post(`/request/send/${status}/${userId}`)
      
      toast.success(status === "interested" ? `Connection request sent to ${firstName}` : "User ignored", {
        position: "bottom-center",
        className: "bg-card border border-border text-foreground text-sm font-medium rounded-xl px-6 py-3 shadow-lg"
      })

      dispatch(removeUserFromFeed(userId))
    } catch (error) {
      if (error.response && error.response.status === 403) {
         toast.error(error.response.data.message || "Limit Reached", {
            position: "bottom-center",
            className: "bg-destructive/10 border border-destructive/20 text-destructive text-xs font-black uppercase tracking-widest rounded-2xl px-8 py-4 shadow-2xl"
         })
      } else {
         toast.error("Network synchronization failed")
      }
    } finally {
      setLoadingAction(null)
    }
  }

  const skillsArray = typeof skills === "string" ? skills.split(",").map((s) => s.trim()) : skills || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isPreview ? { y: -5 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`w-full max-w-sm bg-card border border-border/50 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative group ${isPreview ? 'border-primary/20' : ''}`}
    >
      {/* Background Banner */}
      <div className="relative h-32 overflow-hidden bg-muted/10">
         <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
         
         {/* Status Indicator */}
         <div className="absolute top-4 right-4 flex items-center gap-2 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/50">
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isOnline ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]" : "bg-muted-foreground/30"}`} />
            <span className="text-[10px] font-semibold text-muted-foreground">
                {isPreview ? 'Preview Mode' : isOnline ? 'Online' : 'Offline'}
            </span>
         </div>
      </div>

      <div className="px-8 pb-8 relative">
        {/* Avatar with Ring Effect */}
        <div className="absolute -top-16 left-8">
            <div className="relative p-1.5 bg-background rounded-[2rem] shadow-2xl group-hover:scale-105 transition-transform duration-500">
                <Avatar className="w-28 h-28 border-2 border-border/50 bg-muted">
                    <AvatarImage src={photoUrl} className="object-cover" />
                    <AvatarFallback className="text-3xl font-black bg-primary/10 text-primary">
                        {firstName?.[0]}{lastName?.[0]}
                    </AvatarFallback>
                </Avatar>
            </div>
        </div>

        {/* Profile Info */}
        <div className="mt-16 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                    {firstName} {lastName}
                </h2>
                {getBadge()}
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Software Engineer</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{gender || 'Location'}</span>
                </div>
            </div>
          </div>

          {/* Bio block with custom styling */}
          <div className="relative group/bio">
            <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-primary/20 group-hover/bio:bg-primary transition-colors" />
            <p className="text-sm text-muted-foreground leading-relaxed font-medium line-clamp-3">
                {bio || "This developer is optimizing their bio. They focus on delivering high-performance decentralized solutions."}
            </p>
          </div>

          {/* Tech Stack */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Tech Stack</span>
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsArray.slice(0, 5).map((skill, idx) => (
                <div key={idx} className="bg-secondary/50 px-2.5 py-1 rounded-md text-[11px] font-medium text-foreground border border-border/50 transition-colors cursor-default">
                   {skill}
                </div>
              ))}
              {skillsArray.length > 5 && (
                <div className="bg-primary/10 px-2.5 py-1 rounded-md text-[11px] font-semibold text-primary border border-primary/20">
                   +{skillsArray.length - 5} more
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {!isPreview && (
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => handleSendRequest("ignored", _id)}
                loading={loadingAction === "ignored"}
                variant="outline"
                className="flex-1 h-12 rounded-xl font-semibold text-sm border-border/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all"
              >
                {!loadingAction && <X className="w-4 h-4 mr-2" />}
                Ignore
              </Button>
              <Button
                onClick={() => handleSendRequest("interested", _id)}
                loading={loadingAction === "interested"}
                className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:shadow-primary/20 transition-all"
              >
                {!loadingAction && <Heart className="w-4 h-4 mr-2 fill-current" />}
                Connect
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative Progress Blur */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 opacity-50" />
    </motion.div>
  )
}

export default UserCard
