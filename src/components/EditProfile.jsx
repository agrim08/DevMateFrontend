import { useState, useEffect } from "react"
import { BASE_URL } from "../utils/constants"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { addUser } from "../utils/userSlice"
import {  
  Save, 
  User, 
  FileText, 
  ExternalLink,
  ShieldCheck,
  Globe,
  Camera,
  Loader2,
  Terminal,
  Zap,
  Hash,
  Image as ImageIcon,
  UserCircle
} from "lucide-react"
import ProfileInputField from "./ProfileInputField"
import ProfileTextAreaField from "./ProfileTextAreaField"
import SkillsInput from "./SkillsInput"
import UserCard from "./UserCard"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

const EditProfile = () => {
  const dispatch = useDispatch()
  const { data: user } = useSelector((store) => store.user)

  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "")
  const [age, setAge] = useState(user?.userAge || "")
  const [gender, setGender] = useState(user?.gender || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [skills, setSkills] = useState(user?.skills || [])
  const [isSaving, setIsSaving] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, photoUrl, userAge: age, gender, bio, skills },
        { withCredentials: true },
      )
      dispatch(addUser(res.data.data))
      toast.success("Identity Synchronization Complete")
    } catch (err) {
      toast.error(err?.response?.data || "Network error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  // Live preview user object
  const previewUser = {
    ...user,
    firstName,
    lastName,
    photoUrl,
    userAge: age,
    gender,
    bio,
    skills,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        
        {/* Configuration Panel */}
        <div className="flex-1 space-y-12 w-full">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full text-primary font-black text-[10px] uppercase tracking-widest"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Configuration Mode</span>
            </motion.div>
            <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
              Identity <span className="text-primary italic">Profile</span>
            </h1>
            <p className="text-muted-foreground font-bold tracking-tight text-sm uppercase opacity-60">
                Update your professional visibility parameters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-foreground">Personnel Data</span>
                </div>
                <ProfileInputField icon={UserCircle} label="First Name" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter first name" />
                <ProfileInputField icon={User} label="Last Name" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter last name" />
                <ProfileInputField icon={Hash} label="Age" id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter age" />
                <ProfileInputField icon={ImageIcon} label="Photo URL" id="photoUrl" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="Paste image address" />
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-foreground">Professional Info</span>
                </div>
                <ProfileInputField icon={ShieldCheck} label="Specialization / Title" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="e.g. Senior Frontend Engineer" />
                <ProfileTextAreaField icon={FileText} label="Direct Bio" id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Briefly describe your focus..." maxLength={200} />
                <SkillsInput label="Core Tech Stack" id="skills" skills={skills} setSkills={setSkills} />
            </div>
          </div>

          <div className="pt-8 border-t border-border/50">
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="h-14 px-12 rounded-2xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all w-full md:w-auto"
            >
              {isSaving ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synchronizing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 font-bold">
                  <Save className="w-4 h-4" />
                  <span>COMMIT CHANGES</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Live Preview Side (Minimal Card) */}
        <div className="w-full lg:w-[400px] lg:sticky lg:top-32 space-y-6">
          <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">Live Signal Preview</span>
              </div>
          </div>
          
          <div className="scale-90 lg:scale-100 origin-top">
            <UserCard user={previewUser} isPreview={true} />
          </div>

          <div className="p-6 rounded-3xl bg-muted/30 border border-border/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:rotate-12 transition-transform">
                  <Zap className="w-8 h-8 text-primary" />
              </div>
              <p className="text-[9px] font-black text-muted-foreground uppercase leading-relaxed tracking-widest">
                  Preview reflects real-time changes to your node's appearance in the ecosystem.
              </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
