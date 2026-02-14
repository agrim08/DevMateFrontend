import { BASE_URL } from "../utils/constants"
import axios from "axios"
import { useDispatch } from "react-redux"
import { removeUserFromFeed } from "../utils/feedSlice"
import { Heart, X, MapPin, Briefcase, Code, Terminal, ExternalLink, ShieldCheck, Zap } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const UserCard = ({ user }) => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)

  if (!user) return null
  const { _id, firstName, lastName, photoUrl, userAge, gender, bio, skills } = user

  const handleSendRequest = async (status, userId) => {
    if (isLoading) return
    setIsLoading(true)

    try {
      await axios.post(`${BASE_URL}/request/send/${status}/${userId}`, {}, { withCredentials: true })
      
      toast.success(status === "interested" ? `Neural link requested with ${firstName}` : "Signal ignored", {
        position: "bottom-center",
        className: "bg-card border border-primary/20 text-foreground text-xs font-black uppercase tracking-widest rounded-2xl px-8 py-4 shadow-2xl"
      })

      dispatch(removeUserFromFeed(userId))
    } catch (error) {
      toast.error("Network synchronization failed")
    } finally {
      setIsLoading(false)
    }
  }

  const skillsArray = typeof skills === "string" ? skills.split(",").map((s) => s.trim()) : skills || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full max-w-sm bg-card border border-border/50 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative group"
    >
      {/* Dynamic Background Banner */}
      <div className="relative h-40 overflow-hidden bg-muted/20">
         <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent animate-gradient-slow" />
         <div className="absolute inset-0 opacity-[0.03] bg-[size:20px_20px] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]" />
         
         {/* Live Status Indicator */}
         <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-md border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-foreground/70">Online</span>
         </div>
      </div>

      <div className="px-8 pb-8 relative">
        {/* Avatar with Ring Effect */}
        <div className="absolute -top-16 left-8">
            <div className="relative p-1.5 bg-background rounded-[2rem] shadow-2xl group-hover:scale-105 transition-transform duration-500">
                <Avatar className="w-28 h-28 border-2 border-border/50 bg-muted">
                    <AvatarImage src={photoUrl} className="object-cover" />
                    <AvatarFallback className="text-3xl font-black bg-primary/10 text-primary">
                        {firstName[0]}{lastName[0]}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 p-2 bg-primary text-primary-foreground rounded-xl shadow-xl">
                    <Zap className="w-4 h-4 fill-current" />
                </div>
            </div>
        </div>

        {/* Profile Info */}
        <div className="mt-16 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
                <h2 className="text-3xl font-black text-foreground tracking-tighter">
                    {firstName} <span className="text-primary italic">{lastName}</span>
                </h2>
                <ShieldCheck className="w-5 h-5 text-primary opacity-60" />
            </div>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3 h-3 text-primary" />
                    <span>L4 Developer</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span>{gender || 'Remote'}</span>
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

          {/* Tech Stack refined */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Tech Stack</span>
                </div>
                <span className="text-[9px] font-bold text-primary/40 uppercase">Verified Modules</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsArray.slice(0, 5).map((skill, idx) => (
                <div key={idx} className="bg-muted/30 px-3 py-1.5 rounded-xl text-[10px] font-black text-foreground border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all cursor-default uppercase tracking-tight">
                   {skill}
                </div>
              ))}
              {skillsArray.length > 5 && (
                <div className="bg-primary/5 px-3 py-1.5 rounded-xl text-[10px] font-black text-primary border border-primary/20">
                   +{skillsArray.length - 5} MORE
                </div>
              )}
            </div>
          </div>

          {/* High-Fidelity Actions */}
          <div className="flex gap-4 pt-6">
            <Button
              onClick={() => handleSendRequest("ignored", _id)}
              disabled={isLoading}
              variant="outline"
              className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-muted/20 border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 hover:scale-[1.02] transition-all"
            >
              <X className="w-4 h-4 mr-2" /> 
              Skip Signal
            </Button>
            <Button
              onClick={() => handleSendRequest("interested", _id)}
              disabled={isLoading}
              className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Heart className="w-4 h-4 mr-2 fill-current" />
              Sync Node
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative Progress Blur */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 opacity-50" />
    </motion.div>
  )
}

export default UserCard
