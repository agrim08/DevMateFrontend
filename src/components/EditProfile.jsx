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
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Upload } from "lucide-react"

const EditProfile = () => {
  const dispatch = useDispatch()
  const { data: user } = useSelector((store) => store.user)

  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "")
  const [age, setAge] = useState(user?.userAge || "")
  const [gender, setGender] = useState(user?.gender || "")
  const [bio, setBio] = useState(user?.bio || "")
  
  // Fix: split comma-separated skills if they were saved incorrectly
  const [skills, setSkills] = useState(() => {
    if (!user?.skills) return []
    return user.skills.flatMap(s => s.split(',').map(i => i.trim())).filter(Boolean)
  })

  const [isSaving, setIsSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Packet size exceeds 2MB limit.")
      return
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid media format. Supported: JPEG, PNG, WebP.")
      return
    }

    setUploadingImage(true)

    try {
      const { data: { data: { uploadUrl, fileKey } } } = await axios.get(
        `${BASE_URL}/upload/presigned-url?fileType=${file.type}`,
        { withCredentials: true }
      )

      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type }
      })

      const res = await axios.post(
        `${BASE_URL}/upload/save-profile-picture`,
        { fileKey },
        { withCredentials: true }
      )

      if (res.data && res.data.data) {
        setPhotoUrl(res.data.data.photoUrl)
        toast.success("Avatar updated successfully")
      }
    } catch (error) {
      console.error("Transmission error:", error)
      toast.error("Media synchronization failed.")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const res = await axios.put(
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
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

            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="h-12 mb-6 px-8 rounded-xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Syncing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>COMMIT CHANGES</span>
                </div>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-foreground">Personnel Data</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Profile Avatar</Label>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="relative group shrink-0">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-dashed border-border/50 bg-muted/20 flex items-center justify-center relative">
                        {photoUrl ? (
                          <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                        )}
                        {uploadingImage && (
                          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                       <label className="cursor-pointer inline-block">
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploadingImage} />
                        <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border border-border/50 rounded-xl hover:bg-muted/50 transition-all">
                            <Upload className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Upload New</span>
                        </div>
                      </label>
                      <p className="mt-2 text-[9px] text-muted-foreground/50 uppercase tracking-wider font-bold">Max 2MB • JPG/PNG</p>
                    </div>
                  </div>
                </div>
                <ProfileInputField icon={UserCircle} label="First Name" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter first name" />
                <ProfileInputField icon={User} label="Last Name" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter last name" />
                <ProfileInputField icon={Hash} label="Age" id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter age" />
                
                {/* Image Upload Replacement */}
                
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-foreground">Professional Info</span>
                </div>
                <SkillsInput label="Core Tech Stack" id="skills" skills={skills} setSkills={setSkills} />
                <ProfileTextAreaField icon={FileText} label="Direct Bio" id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Briefly describe your focus..." maxLength={200} />
                <ProfileInputField icon={ShieldCheck} label="Specialization / Title" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="e.g. Senior Frontend Engineer" />
            </div>
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
        </div>
      </div>
    </div>
  )
}

export default EditProfile
