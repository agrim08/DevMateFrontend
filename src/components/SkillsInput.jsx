import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Label } from "./ui/label"
import { Briefcase, X } from "lucide-react"

const SkillsInput = ({ skills, setSkills, label, id }) => {
  const [currentSkill, setCurrentSkill] = useState("")

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()])
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
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label} <span className="text-red-500">*</span>
        <span className="text-xs text-gray-500 ml-2">({skills.length} skills)</span>
      </Label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          placeholder="Type a skill and press Enter"
          value={currentSkill}
          onChange={(e) => setCurrentSkill(e.target.value)}
          onKeyPress={handleSkillKeyPress}
          className="h-11 pl-11 pr-20 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        />
        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Button
          type="button"
          onClick={addSkill}
          disabled={!currentSkill.trim()}
          className="absolute right-1 top-1 h-9 px-3 text-xs"
        >
          Add
        </Button>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 p-3 bg-gray-50 rounded-lg">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 pr-1">
              {skill}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1 hover:bg-blue-300 rounded-full"
                onClick={() => removeSkill(skill)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

export default SkillsInput