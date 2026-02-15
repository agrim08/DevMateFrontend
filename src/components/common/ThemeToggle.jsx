import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "./ThemeProvider"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative w-10 h-10 rounded-xl bg-muted/20 hover:bg-primary/10 group transition-all duration-300 overflow-hidden"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ y: 20, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="relative z-10"
        >
          {theme === "light" ? (
            <Sun className="h-[1.2rem] w-[1.2rem] text-primary transition-all" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem] text-primary transition-all" />
          )}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
      
      {/* Decorative background glow */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Button>
  )
}
