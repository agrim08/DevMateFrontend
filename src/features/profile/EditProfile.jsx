import { useState, useEffect } from "react"
import axiosInstance from "../../api/axiosInstance"
import { useDispatch, useSelector } from "react-redux"
import { addUser } from "../../store/slices/userSlice"
import {  
  Save, 
  User, 
  FileText, 
  ShieldCheck,
  Camera,
  Loader2,
  Terminal,
  Hash,
  Image as ImageIcon,
  UserCircle,
  Upload,
  Trash2,
  LayoutDashboard,
  BrainCircuit,
  Settings2,
  Users
} from "lucide-react"
import ProfileInputField from "./ProfileInputField"
import ProfileTextAreaField from "./ProfileTextAreaField"
import SkillsInput from "./SkillsInput"
import UserCard from "../feed/UserCard"
import GitHubStats from "./GitHubStats"
import ContributionGraph from "./ContributionGraph"
import { Github } from "lucide-react"
import { Button } from "../../components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Label } from "../../components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"

const EditProfile = () => {
  const dispatch = useDispatch()
  const { data: user } = useSelector((store) => store.user)

  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "")
  const [age, setAge] = useState(user?.userAge || "")
  const [gender, setGender] = useState(user?.gender?.toLowerCase() || "")
  const [bio, setBio] = useState(user?.bio || "")
  
  const [skills, setSkills] = useState(() => {
    if (!user?.skills) return []
    return user.skills.flatMap(s => s.split(',').map(i => i.trim())).filter(Boolean)
  })

  useEffect(() => {
    if (user?.skills) {
      const parsedSkills = user.skills.flatMap(s => s.split(',').map(i => i.trim())).filter(Boolean);
      // Only update if different to avoid infinite loops or typing interference
      setSkills(prev => {
        const isSame = prev.length === parsedSkills.length && prev.every((val, index) => val === parsedSkills[index]);
        return isSame ? prev : parsedSkills;
      });
    }
  }, [user?.skills]);

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
      const { data: { data: { uploadUrl, fileKey } } } = await axiosInstance.get(
        `/upload/presigned-url?fileType=${file.type}`,
        { showLoader: false }
      )

      await axiosInstance.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
        showLoader: true
      })

      const res = await axiosInstance.post(
        "/upload/save-profile-picture",
        { fileKey }
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

  const handleRemovePhoto = () => {
    setPhotoUrl("")
    toast.info("Avatar removed locally. Commit changes to sync.")
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const res = await axiosInstance.put(
        "/profile/edit",
        { firstName, lastName, photoUrl, userAge: age, gender, bio, skills }
      )
      dispatch(addUser(res.data.data))
      toast.success("Identity Synchronization Complete")
    } catch (err) {
      toast.error(err?.response?.data || "Network error occurred")
    } finally {
      setIsSaving(false)
    }
  }

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
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wide">
            <Settings2 className="w-4 h-4" />
            <span>Profile Settings</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Edit Profile
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your professional identity and presence.
          </p>
        </div>

        <Button
          onClick={handleSaveProfile}
          loading={isSaving}
          className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all"
        >
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </div>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Main Form Area */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Avatar Area - Image 2 Style */}
          <div className="bg-muted/10 p-8 rounded-3xl border border-border/50 backdrop-blur-sm">
             <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative group shrink-0">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-dashed border-primary/30 bg-muted/20 flex items-center justify-center relative shadow-inner">
                    <AnimatePresence mode="wait">
                      {photoUrl ? (
                        <motion.img 
                          key="photo"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          src={photoUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <motion.div
                          key="icon"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center gap-2"
                        >
                          <ImageIcon className="w-10 h-10 text-muted-foreground/20" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  {/* Status Overlay */}
                  <div className="absolute -bottom-2 -right-2 bg-background border border-border px-2 py-1 rounded-lg shadow-xl">
                      <div className={`w-2 h-2 rounded-full ${photoUrl ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-orange-500'}`} />
                  </div>
                </div>

                <div className="space-y-4 text-center sm:text-left flex-1">
                   <div>
                     <Label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Profile Avatar</Label>
                     <h3 className="text-lg font-bold text-foreground">Visual Identity</h3>
                   </div>
                   
                   <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                      <label className="cursor-pointer">
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploadingImage} />
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload New</span>
                        </div>
                      </label>
                      
                      {photoUrl && (
                        <Button 
                          variant="ghost" 
                          onClick={handleRemovePhoto}
                          className="flex items-center gap-2 px-5 py-2.5 bg-muted/40 border border-border/50 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </Button>
                      )}
                   </div>
                   <p className="text-[9px] text-muted-foreground/40 uppercase tracking-[0.1em] font-bold">Standard: 2MB limit • JPEG / PNG / WEBP</p>
                </div>
             </div>
          </div>

          {/* Persona Data Grid */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <UserCircle className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-foreground/80">Personnel Data</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <ProfileInputField 
                icon={UserCircle} 
                label="First Name" 
                id="firstName" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                placeholder="Entry first name..." 
              />
              <ProfileInputField 
                icon={User} 
                label="Last Name" 
                id="lastName" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                placeholder="Entry last name..." 
              />
              <ProfileInputField 
                icon={Hash} 
                label="Age" 
                id="age" 
                type="number" 
                value={age} 
                onChange={(e) => setAge(e.target.value)} 
                placeholder="Entry age..." 
              />
              <div className="space-y-2.5 mb-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Gender</Label>
                <div className="relative group/select">
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="h-12 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-medium text-sm">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Users className="w-4 h-4 text-muted-foreground/40 group-focus-within/select:text-primary transition-all duration-300" />
                      </div>
                      <SelectValue placeholder="Identify" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/50 rounded-2xl backdrop-blur-xl">
                      <SelectItem value="male" className="rounded-xl">Male</SelectItem>
                      <SelectItem value="female" className="rounded-xl">Female</SelectItem>
                      <SelectItem value="others" className="rounded-xl">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="absolute inset-0 rounded-2xl border border-primary/0 group-focus-within/select:border-primary/20 pointer-events-none transition-colors duration-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Context */}
          <div className="space-y-8 pb-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <BrainCircuit className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-foreground/80">Professional Context</h2>
            </div>

            <div className="space-y-10">
              <SkillsInput label="Core Tech Stack" id="skills" skills={skills} setSkills={setSkills} />
              <ProfileTextAreaField 
                icon={FileText} 
                label="Direct Bio" 
                id="bio" 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                placeholder="Describe your professional journey and tech focus..." 
                maxLength={200} 
              />
            </div>
            </div>


          {/* GitHub Integration */}
          <div className="space-y-8 pb-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <Github className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-foreground/80">Developer Integration</h2>
            </div>
            
            <GitHubStats user={user} setUser={(u) => dispatch(addUser(u))} />
            {user?.github?.contributionCalendar && (
               <ContributionGraph data={user.github.contributionCalendar} />
            )}
          </div>
        </div>

        {/* Live Preview Sidebar */}
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping absolute inset-0" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 relative" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Live Deployment Preview</span>
              </div>
              
              <div className="px-2 py-0.5 rounded bg-muted/30 border border-border/40 text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                Real-time
              </div>
            </div>
            
            <motion.div 
              layout
              className="relative p-1 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-transparent to-primary/5 border border-primary/5 shadow-2xl"
            >
              <div className="scale-95 md:scale-100 p-2 origin-top">
                <UserCard user={previewUser} isPreview={true} />
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default EditProfile
