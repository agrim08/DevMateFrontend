import axiosInstance from "../../api/axiosInstance"
import { useDispatch, useSelector } from "react-redux"
import { removeUserFromFeed, setLimitReached } from "../../store/slices/feedSlice"
import { Heart, X, MapPin, Code, Terminal, ShieldCheck, Github, Lock } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// ─── Membership badge pill ───────────────────────────────────────────────────
const MemberBadge = ({ type }) => {
  if (!type || (type !== "emerald" && type !== "diamond")) return null
  const isDiamond = type === "diamond"
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xl border text-[9px] font-black uppercase tracking-widest flex-shrink-0
      ${isDiamond
        ? "bg-primary/10 border-primary/30 text-primary"
        : "bg-muted/40 border-border/50 text-muted-foreground/70"
      }`}
    >
      <ShieldCheck className={`w-2.5 h-2.5 ${isDiamond ? "text-primary animate-pulse" : "text-muted-foreground/50"}`} />
      {type}
    </span>
  )
}

// ─── Limit reached overlay ───────────────────────────────────────────────────
const LimitOverlay = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="mx-6 mb-6 mt-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-destructive/5 border border-destructive/20"
  >
    <div className="w-8 h-8 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center flex-shrink-0">
      <Lock className="w-4 h-4 text-destructive/60" />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-destructive/80">Daily limit reached</p>
      <p className="text-[9px] text-muted-foreground/50 mt-0.5">Interactions reset tomorrow</p>
    </div>
  </motion.div>
)

const SKILL_LIMIT = 4

const UserCard = ({ user, isPreview = false, limitReached = false }) => {
  const dispatch = useDispatch()
  const onlineUsers = useSelector((store) => store.chat.onlineUsers)
  const isOnline = onlineUsers.includes(user?._id)

  const [loadingAction, setLoadingAction] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  if (!user) return null
  const {
    _id, firstName, lastName, photoUrl,
    userAge, gender, city, state, country,
    bio, skills, membershipType, github
  } = user

  const locationString = [city, state, country].filter(Boolean).join(", ") || "Earth"

  const skillsArray = (Array.isArray(skills) ? skills : (skills ? [skills] : []))
    .flatMap(s => typeof s === "string" ? s.split(",").map(i => i.trim()) : s)
    .filter(Boolean)

  const displayedSkills = isExpanded ? skillsArray : skillsArray.slice(0, SKILL_LIMIT)
  const extraCount = skillsArray.length - SKILL_LIMIT

  const handleSendRequest = async (status, userId) => {
    if (loadingAction || isPreview || limitReached) return
    setLoadingAction(status)
    try {
      await axiosInstance.post(`/request/send/${status}/${userId}`)
      toast.success(
        status === "interested" ? `Connection request sent to ${firstName}` : "User ignored",
        {
          position: "bottom-center",
          className: "bg-card border border-border text-foreground text-sm font-medium rounded-xl px-6 py-3 shadow-lg"
        }
      )
      dispatch(removeUserFromFeed(userId))
    } catch (error) {
      if (error.response?.status === 403) {
        dispatch(setLimitReached(true))
        toast.error(error.response.data.message || "Daily interaction limit reached", {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isPreview ? { y: -4 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`w-full max-w-sm bg-card border rounded-2xl shadow-2xl overflow-hidden flex flex-col relative group
        ${isPreview ? "border-primary/20" : "border-border/50"}`}
    >

      {/* ── Banner ─────────────────────────────────────────────────────────── */}
      <div className="relative h-36 bg-muted/10 overflow-hidden flex-shrink-0">
        {/* Ambient layered gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.08),transparent_60%)]" />

        {/* Status pill — top left */}
        <div className="absolute top-4 left-5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-sm border border-border/40">
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300
            ${isPreview
              ? "bg-primary"
              : isOnline
                ? "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.7)] animate-pulse"
                : "bg-muted-foreground/30"
            }`}
          />
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
            {isPreview ? "Preview" : isOnline ? "Online" : "Offline"}
          </span>
        </div>

        {/* GitHub pill — top right, readable with username */}
        {github?.username && (
          <a
            href={github.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute top-4 right-5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-sm border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all group/gh"
          >
            <Github className="w-3 h-3 text-muted-foreground group-hover/gh:text-primary transition-colors" />
            <span className="text-[9px] font-bold text-muted-foreground group-hover/gh:text-primary transition-colors uppercase tracking-widest max-w-[80px] truncate">
              {github.username}
            </span>
          </a>
        )}

        {/* Avatar — anchored to bottom-left of banner, overlapping the body */}
        <div className="absolute -bottom-9 left-6">
          <div className="relative">
            {isOnline && !isPreview && (
              <div className="absolute inset-0 rounded-[1.6rem] border-2 border-green-500/30 animate-ping" />
            )}
            <div className="p-1 bg-card rounded-[1.8rem] shadow-xl border border-border/30 group-hover:scale-105 transition-transform duration-500">
              <Avatar className="w-20 h-20 border border-border/20 bg-muted rounded-[1.5rem]">
                <AvatarImage src={photoUrl} className="object-cover rounded-[1.5rem]" />
                <AvatarFallback className="text-2xl font-black bg-primary/10 text-primary rounded-[1.5rem]">
                  {firstName?.[0]}{lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="pt-12 px-6 pb-6 flex flex-col gap-5">

        {/* Name + meta ─────────────────────────────────────────────────────── */}
        <div className="space-y-2">
          {/* Name row with membership badge inline */}
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-foreground tracking-tight leading-tight">
              {firstName} {lastName}
            </h2>
            <MemberBadge type={membershipType} />
          </div>

          {/* Age · Gender · Location — small chips, clearly secondary */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {userAge && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 bg-muted/30 px-2 py-0.5 rounded-lg border border-border/30">
                {userAge}yr
              </span>
            )}
            {gender && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 bg-muted/30 px-2 py-0.5 rounded-lg border border-border/30">
                {gender}
              </span>
            )}
            <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground/50">
              <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
              <span className="truncate max-w-[140px]">{locationString}</span>
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/20" />

        {/* Bio ─────────────────────────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 flex items-center gap-1.5">
            <Terminal className="w-3 h-3" />
            Bio
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {bio || "This developer is optimizing their bio. They focus on delivering high-performance decentralized solutions."}
          </p>
        </div>

        {/* Tech Stack ──────────────────────────────────────────────────────── */}
        {skillsArray.length > 0 && (
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 flex items-center gap-1.5">
              <Code className="w-3 h-3" />
              Tech Stack
            </p>

            <div className="flex flex-wrap gap-1.5">
              <AnimatePresence>
                {displayedSkills.map((skill, idx) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ delay: idx * 0.03, type: "spring", stiffness: 400, damping: 20 }}
                    className="px-2.5 py-1 bg-secondary/40 border border-border/40 rounded-lg text-[10px] font-semibold text-foreground/80 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </AnimatePresence>

              {/* Show more — dashed border distinguishes it from skill tags */}
              {!isExpanded && extraCount > 0 && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="px-2.5 py-1 rounded-lg border border-dashed border-primary/30 text-[10px] font-black text-primary/70 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                >
                  +{extraCount} more
                </button>
              )}
              {isExpanded && skillsArray.length > SKILL_LIMIT && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="px-2.5 py-1 rounded-lg border border-dashed border-border/40 text-[10px] font-black text-muted-foreground/50 hover:border-border hover:text-muted-foreground transition-all"
                >
                  Show less
                </button>
              )}
            </div>
          </div>
        )}

        {/* Action buttons ──────────────────────────────────────────────────── */}
        {!isPreview && !limitReached && (
          <div className="flex items-center gap-2 pt-1">
            {/* Ignore — icon-only, compact square, clearly secondary */}
            <Button
              onClick={() => handleSendRequest("ignored", _id)}
              loading={loadingAction === "ignored"}
              disabled={!!loadingAction}
              variant="outline"
              className="w-12 h-12 p-0 rounded-2xl border-border/50 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all flex-shrink-0 disabled:opacity-40"
              aria-label="Ignore"
            >
              {loadingAction !== "ignored" && <X className="w-4 h-4" />}
            </Button>

            {/* Connect — full remaining width, primary, with shimmer effect */}
            <Button
              onClick={() => handleSendRequest("interested", _id)}
              loading={loadingAction === "interested"}
              disabled={!!loadingAction}
              className="flex-1 h-12 rounded-2xl bg-primary text-primary-foreground font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 relative overflow-hidden group/connect"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/connect:translate-x-full transition-transform duration-700" />
              {loadingAction !== "interested" && (
                <span className="flex items-center gap-2 relative z-10">
                  <Heart className="w-4 h-4 fill-current" />
                  Connect
                </span>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Limit reached — inline banner at card bottom, not a blocking overlay */}
      {!isPreview && limitReached && <LimitOverlay />}

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </motion.div>
  )
}

export default UserCard