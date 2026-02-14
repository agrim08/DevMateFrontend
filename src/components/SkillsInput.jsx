import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Label } from "./ui/label"
import { Code2, X, Plus, Terminal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const SkillsInput = ({ skills, setSkills, label, id }) => {
  const [currentSkill, setCurrentSkill] = useState("")

  const addSkill = () => {
    if (!currentSkill.trim()) return

    // Allow adding multiple skills separated by commas
    const newSkills = currentSkill
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill !== "" && !skills.includes(skill))

    if (newSkills.length > 0) {
      setSkills([...skills, ...newSkills])
      setCurrentSkill("")
    }
  }

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <Label htmlFor={id} className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
            {label}
        </Label>
        <span className="text-[10px] font-bold text-muted-foreground/30 tabular-nums">
            {skills.length} ADDED
        </span>
      </div>
      
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
          <Terminal className="w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-all duration-300" />
        </div>
        <Input
          id={id}
          name={id}
          placeholder="Type skill + Enter (comma separated works)..."
          value={currentSkill}
          onChange={(e) => setCurrentSkill(e.target.value)}
          onKeyDown={handleSkillKeyPress}
          className="h-12 pl-12 pr-14 rounded-2xl bg-muted/20 border-border/40 focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-medium placeholder:text-muted-foreground/20 text-sm"
        />
        <Button
          type="button"
          onClick={addSkill}
          disabled={!currentSkill.trim()}
          size="icon"
          className="absolute right-1.5 top-1.5 h-9 w-9 rounded-xl bg-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        {skills.length > 0 && (
          <motion.div 
            layout
            className="flex flex-wrap gap-2 pt-2 px-1"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={`${skill}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Badge 
                  className="bg-card hover:bg-muted border-border/50 hover:border-primary/30 text-foreground transition-all flex items-center gap-2 pl-4 pr-1.5 h-9 rounded-xl font-bold text-xs shadow-sm hover:shadow-md group"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-white transition-all"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SkillsInput