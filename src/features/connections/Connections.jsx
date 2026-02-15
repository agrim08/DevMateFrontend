import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addConnection } from "../../store/slices/connectionSlice"
import axiosInstance from "../../api/axiosInstance"
import { MessageSquare, Users, MapPin, Search, ShieldCheck } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import FullScreenLoader from "../../components/common/FullScreenLoader"
import EmptyState from "../../components/common/EmptyState"
import { motion } from "framer-motion"

const Connections = () => {
  const dispatch = useDispatch()
  const connectionData = useSelector((store) => store?.connection)

  const handleConnections = async () => {
    try {
      const res = await axiosInstance.get("/user/connections")
      dispatch(addConnection(res?.data?.data))
    } catch (error) {
      console.error(error.response?.data)
    }
  }

  useEffect(() => {
    handleConnections()
  }, [])

  if (!connectionData) {
    return <FullScreenLoader message="Loading connections..." />
  }

  if (connectionData.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Your circle is empty"
        description="Connect with other developers to start building your professional circle."
        buttonText="Browse Developers"
        buttonLink="/app"
      />
    )
  }

  return (
    <div className="min-h-screen bg-background pt-12 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wide">
                    <Users className="w-4 h-4" />
                    <span>Network</span>
                </div>
                <h1 className="text-4xl font-bold text-foreground tracking-tight underline decoration-primary/10 decoration-4 underline-offset-8">
                    My Connections
                </h1>
            </div>
            
            <p className="text-muted-foreground font-medium md:text-right">
                You have <span className="text-foreground font-semibold">{connectionData.length}</span> active connections.
            </p>
        </div>

        {/* Connections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {connectionData.map((connection, idx) => {
            const { _id, photoUrl, skills, firstName, lastName, bio, gender } = connection
            const skillsArray = typeof skills === "string" ? skills.split(",").map((s) => s.trim()) : skills || []

            return (
              <motion.div 
                key={_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="premium-card bg-card p-6 flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                    <Avatar className="w-16 h-16 border border-border shadow-sm">
                      <AvatarImage src={photoUrl} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {firstName[0]}{lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-foreground truncate">{`${firstName} ${lastName}`}</h3>
                            {connection.membershipType === "emerald" && (
                                <div className="group/badge relative">
                                    <div className="p-0.5 rounded-full">
                                        <ShieldCheck className="w-4 h-4 text-primary/60 fill-primary/5" />
                                    </div>
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-foreground text-background text-[10px] font-bold rounded opacity-0 group-hover/badge:opacity-100 transition-opacity whitespace-nowrap">EMERALD</span>
                                </div>
                            )}
                            {connection.membershipType === "diamond" && (
                                <div className="group/badge relative">
                                    <div className="p-0.5 rounded-full">
                                        <ShieldCheck className="w-4 h-4 text-primary fill-primary/10 animate-pulse" />
                                    </div>
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded opacity-0 group-hover/badge:opacity-100 transition-opacity whitespace-nowrap">DIAMOND</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                            <MapPin className="w-3 h-3" />
                            <span className="capitalize">{gender || 'Developer'}</span>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground line-clamp-2 font-medium mb-6">
                    {bio || "Technically minded individual focused on building high-performance systems."}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-8">
                    {skillsArray.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-0.5 text-[10px] font-semibold">
                        {skill}
                    </Badge>
                    ))}
                    {skillsArray.length > 3 && (
                    <span className="text-[10px] text-muted-foreground flex items-center px-1 font-medium">
                        +{skillsArray.length - 3} more
                    </span>
                    )}
                </div>

                <div className="mt-auto">
                    <Button asChild className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold group">
                        <Link to={`/app/chat/${_id}`} className="flex items-center justify-center gap-2">
                            <MessageSquare className="w-4 h-4 transition-transform group-hover:scale-110" />
                            <span>Message</span>
                        </Link>
                    </Button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Connections