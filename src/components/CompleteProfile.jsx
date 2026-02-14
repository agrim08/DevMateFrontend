import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Alert, AlertDescription } from "./ui/alert"
import { Input } from "./ui/input"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useDispatch } from "react-redux"
import { Textarea } from "./ui/textarea"
import { 
  User, Calendar, Users, Briefcase, Heart, CheckCircle, X, 
  Upload, Image as ImageIcon, Loader2, Sparkles, Terminal,
  Cpu, Zap, Fingerprint, Shield
} from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { addUser } from "../utils/userSlice"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { motion, AnimatePresence } from "framer-motion"

const CompleteProfile = () => {
  const [userAge, setUserAge] = useState("")
  const [bio, setBio] = useState("")
  const [skills, setSkills] = useState([])
  const [currentSkill, setCurrentSkill] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [gender, setGender] = useState("")
  const [errors, setErrors] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [photoPreview, setPhotoPreview] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()])
      setCurrentSkill("")
    }
  }

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setErrors("Packet size exceeds 2MB limit.")
      return
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      setErrors("Invalid media format. Supported: JPEG, PNG, WebP.")
      return
    }

    setUploadingImage(true)
    setErrors("")

    const localPreviewUrl = URL.createObjectURL(file)
    setPhotoPreview(localPreviewUrl)

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
        setPhotoPreview(res.data.data.photoUrl)
      }
    } catch (error) {
      console.error("Transmission error:", error)
      setErrors("Media synchronization failed.")
    } finally {
      setUploadingImage(false)
    }
  }

  const validateInputs = () => {
    let validationErrors = ""
    if (!userAge || isNaN(Number.parseInt(userAge)) || Number.parseInt(userAge) < 1) {
      validationErrors += "Temporal age required.\n"
    }
    if (!gender) {
      validationErrors += "Node gender required.\n"
    }
    if (!bio || bio.length < 20 || bio.length > 250) {
      validationErrors += "Bio bit-rate insufficient (20-250 chars).\n"
    }
    if (skills.length < 3) {
      validationErrors += "Minimum 3 technical skills required.\n"
    }
    setErrors(validationErrors.trim())
    return validationErrors === ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors("")

    if (!validateInputs()) return

    setIsLoading(true)

    try {
      const res = await axios.post(
        `${BASE_URL}/complete-profile`,
        {
          userAge: Number.parseInt(userAge),
          bio,
          skills: skills.join(", "),
          photoUrl,
          gender: gender.toLowerCase(),
        },
        { withCredentials: true },
      )

      if (res.data && res.data.data && res.data.data.isProfileComplete) {
        dispatch(addUser(res.data.data))
        navigate("/app")
      }
    } catch (error) {
      setErrors(error.response?.data?.error || "Profile finalization failed.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[15%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="bg-card/40 backdrop-blur-2xl border-border/40 rounded-[2.5rem] shadow-2xl p-2 sm:p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-20"><Fingerprint className="w-24 h-24" /></div>
          
          <CardHeader className="text-center space-y-4 pb-8 relative z-10">
            <div className="inline-flex items-center justify-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Node Configuration</span>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-4xl font-black tracking-tighter text-foreground uppercase">
                Initialize <span className="text-primary italic">Profile</span>
              </CardTitle>
              <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                Calibrate your digital identity for the DevMate ecosystem
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Photo & Basic Info Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Photo Upload Section */}
                <div className="md:col-span-4 flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-dashed border-border/50 bg-muted/20 flex items-center justify-center p-1 relative transition-colors group-hover:border-primary/50"
                    >
                      {photoPreview ? (
                        <img src={photoPreview} alt="Node Preview" className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 opacity-40">
                            <ImageIcon className="w-10 h-10" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Avatar</span>
                        </div>
                      )}
                      
                      {uploadingImage && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-2xl">
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                      )}
                    </motion.div>
                  </div>
                  
                  <label className="cursor-pointer group">
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploadingImage} />
                    <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border border-border/50 rounded-xl hover:bg-muted/50 transition-all">
                        <Upload className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">Upload Packet</span>
                    </div>
                  </label>
                </div>

                {/* Basic Details Section */}
                <div className="md:col-span-8 grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Temporal Age</Label>
                    <div className="relative group/input">
                        <Input
                          type="number"
                          placeholder="24"
                          value={userAge}
                          onChange={(e) => setUserAge(e.target.value)}
                          className="h-12 pl-12 bg-muted/20 border-border/50 rounded-2xl focus:ring-primary/20 text-sm font-bold placeholder:opacity-30"
                        />
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Node Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="h-12 pl-12 bg-muted/20 border-border/50 rounded-2xl focus:ring-primary/20 text-sm font-bold relative group/select">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/select:text-primary transition-colors" />
                        <SelectValue placeholder="Identify" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border/50 rounded-2xl">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="others">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 space-y-2.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex justify-between">
                        <span>Digital Bio</span>
                        <span className="opacity-50 tracking-normal">{bio.length}/250</span>
                    </Label>
                    <div className="relative group/input">
                        <Textarea
                          placeholder="Synthesize your mission and technical stack..."
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="min-h-[100px] pl-12 pt-4 bg-muted/20 border-border/50 rounded-2xl focus:ring-primary/20 text-sm font-bold placeholder:opacity-30 resize-none"
                        />
                        <Terminal className="absolute left-4 top-4 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Configuration Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-primary" />
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Technical Core Skills (Min 3)</Label>
                </div>
                
                <div className="relative group/input">
                  <Input
                    placeholder="e.g. Next.js, Rust, AWS"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyPress={handleSkillKeyPress}
                    className="h-14 pl-12 pr-24 bg-muted/20 border-border/50 rounded-2xl focus:ring-primary/20 text-sm font-bold placeholder:opacity-30"
                  />
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                  <Button
                    type="button"
                    onClick={addSkill}
                    disabled={!currentSkill.trim()}
                    className="absolute right-2 top-2 h-10 px-6 rounded-xl text-[10px] font-black uppercase bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                  >
                    Inject
                  </Button>
                </div>
                
                <AnimatePresence>
                  {skills.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-2 p-4 bg-muted/10 border border-border/30 rounded-3xl"
                    >
                      {skills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="pl-3 pr-1 py-1.5 bg-primary/20 text-primary-foreground border-primary/30 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        >
                          {skill}
                          <button
                            type="button"
                            className="p-1 hover:bg-primary/30 rounded-lg transition-colors"
                            onClick={() => removeSkill(skill)}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {errors && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Alert className="bg-destructive/10 border-destructive/20 rounded-2xl">
                        <AlertDescription className="text-destructive text-[10px] font-black uppercase tracking-widest text-center">
                            {errors}
                        </AlertDescription>
                    </Alert>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={isLoading || skills.length < 3}
                className="w-full h-16 bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all relative overflow-hidden group/submit"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/submit:animate-shimmer" />
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Link</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 fill-current" />
                    <span>Establish Node Link</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Support Meta */}
        <div className="mt-8 flex items-center justify-between text-muted-foreground/40 font-black text-[9px] uppercase tracking-[0.4em] px-8">
            <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Multi-Threaded</span>
            </div>
            <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                <span>v1.0.42</span>
            </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CompleteProfile
