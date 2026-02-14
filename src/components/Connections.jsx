import { useEffect } from "react"
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { addConnection } from "../utils/connectionSlice"
import axios from "axios"
import { MessageSquare, Users, MapPin, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import FullScreenLoader from "./FullScreenLoader"
import EmptyState from "./EmptyState"
import { motion } from "framer-motion"

const Connections = () => {
  const dispatch = useDispatch()
  const connectionData = useSelector((store) => store?.connection)

  const handleConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      })
      dispatch(addConnection(res?.data?.data))
    } catch (error) {
      console.error(error.response?.data)
    }
  }

  useEffect(() => {
    handleConnections()
  }, [])

  if (!connectionData) {
    return <FullScreenLoader message="Retrieving connection data..." />
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
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                    <Users className="w-4 h-4" />
                    <span>Developer Network</span>
                </div>
                <h1 className="text-4xl font-black text-foreground tracking-tight underline decoration-primary/20 decoration-4 underline-offset-8">
                    My Circle
                </h1>
            </div>
            
            <p className="text-muted-foreground font-medium max-w-xs md:text-right">
                Currently connected with <span className="text-foreground font-bold">{connectionData.length}</span> top-tier professionals.
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
                        <h3 className="text-lg font-bold text-foreground truncate">{`${firstName} ${lastName}`}</h3>
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
                    <Badge key={index} variant="secondary" className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight">
                        {skill}
                    </Badge>
                    ))}
                    {skillsArray.length > 3 && (
                    <span className="text-[10px] text-muted-foreground flex items-center px-1 font-bold">
                        +{skillsArray.length - 3}
                    </span>
                    )}
                </div>

                <div className="mt-auto">
                    <Button asChild className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold group">
                        <Link to={`/app/chat/${_id}`} className="flex items-center justify-center gap-3">
                            <MessageSquare className="w-4 h-4 transition-transform group-hover:scale-110" />
                            <span>Send Message</span>
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