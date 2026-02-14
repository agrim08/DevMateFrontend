import { Terminal, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

const FullScreenLoader = ({ message = "Loading content..." }) => {
  return (
    <div className="fixed inset-0 bg-background z-[100] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
        </div>
        <p className="text-muted-foreground font-medium text-sm tracking-tight">{message}</p>
      </div>
    </div>
  )
}

export default FullScreenLoader