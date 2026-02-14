import { Button } from "./ui/button"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const EmptyState = ({ icon: Icon, title, description, buttonText, buttonLink, children }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-6"
      >
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
          <Icon className="w-10 h-10 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-3 items-center">
            {buttonText && buttonLink && (
              <Button asChild className="rounded-full px-8">
                <Link to={buttonLink}>{buttonText}</Link>
              </Button>
            )}
            {children}
        </div>
      </motion.div>
    </div>
  )
}

export default EmptyState