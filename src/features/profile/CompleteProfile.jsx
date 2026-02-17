import { useState } from "react"

import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Input } from "../../components/ui/input"
import axios from "axios"
import axiosInstance from "../../api/axiosInstance"
import { useDispatch } from "react-redux"
import { Textarea } from "../../components/ui/textarea"
import { 
  User, Calendar, Users, Briefcase, Heart, CheckCircle, X, 
  Upload, Image as ImageIcon, Loader2, Sparkles, Terminal,
  Cpu, Zap, Fingerprint, Shield, Github, MapPin
} from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { addUser } from "../../store/slices/userSlice"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"

import { useLocation } from "../../hooks/useLocation";

// ─── Step indicator component ──────────────────────────────────────────────────
const StepIndicator = ({ steps, currentStep }) => (
  <div className="flex items-center justify-center gap-0 mb-10">
    {steps.map((step, i) => (
      <div key={i} className="flex items-center">
        <motion.div
          animate={{
            scale: i === currentStep ? 1.1 : 1,
            opacity: i <= currentStep ? 1 : 0.35,
          }}
          className="flex flex-col items-center gap-1.5"
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 ${
              i < currentStep
                ? "bg-primary border-primary"
                : i === currentStep
                ? "bg-primary/20 border-primary"
                : "bg-muted/20 border-border/40"
            }`}
          >
            {i < currentStep ? (
              <CheckCircle className="w-4 h-4 text-primary-foreground" />
            ) : (
              <span className={`text-[10px] font-black ${i === currentStep ? "text-primary" : "text-muted-foreground"}`}>
                {i + 1}
              </span>
            )}
          </div>
          <span
            className={`text-[8px] font-black uppercase tracking-widest hidden sm:block transition-colors ${
              i === currentStep ? "text-primary" : "text-muted-foreground/40"
            }`}
          >
            {step}
          </span>
        </motion.div>

        {i < steps.length - 1 && (
          <div className="w-12 sm:w-16 h-px mx-2 mb-4 transition-all duration-500"
            style={{ background: i < currentStep ? "hsl(var(--primary))" : "hsl(var(--border) / 0.3)" }}
          />
        )}
      </div>
    ))}
  </div>
)

// ─── Section wrapper ────────────────────────────────────────────────────────────
const Section = ({ icon: Icon, title, subtitle, children }) => (
  <div className="space-y-5">
    <div className="flex items-center gap-3 pb-3 border-b border-border/20">
      <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">{title}</p>
        {subtitle && <p className="text-[9px] text-muted-foreground/50 uppercase tracking-widest mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
)

// ─── Field wrapper ──────────────────────────────────────────────────────────────
const Field = ({ label, hint, children }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between px-0.5">
      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{label}</Label>
      {hint && <span className="text-[9px] text-muted-foreground/40 tracking-widest">{hint}</span>}
    </div>
    {children}
  </div>
)

const STEPS = ["Identity", "Location", "Skills", "Finalize"]

const CompleteProfile = () => {
  const [userAge, setUserAge] = useState("")
  const [bio, setBio] = useState("")
  const [skills, setSkills] = useState([])
  const [currentSkill, setCurrentSkill] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [gender, setGender] = useState("")

  const {
    countries, states, cities,
    selectedCountry: country,
    selectedState: state,
    selectedCity: city,
    handleCountryChange: setCountry,
    handleStateChange: setState,
    handleCityChange: setCity,
    loadingCountries, loadingStates, loadingCities
  } = useLocation("", "", "");

  const [errors, setErrors] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [photoPreview, setPhotoPreview] = useState("")
  const [activeStep, setActiveStep] = useState(0)

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
      const { data: { data: { uploadUrl, fileKey } } } = await axiosInstance.get(
        `/upload/presigned-url?fileType=${file.type}`
      )

      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type }
      })

      const res = await axiosInstance.post("/upload/save-profile-picture", { fileKey })

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
      const res = await axiosInstance.post("/complete-profile", {
        userAge: Number.parseInt(userAge),
        bio,
        skills: skills.join(", "),
        photoUrl,
        gender: gender.toLowerCase(),
        city,
        state,
        country,
      })

      if (res.data && res.data.data && res.data.data.isProfileComplete) {
        dispatch(addUser(res.data.data))
        navigate("/app")
      }
    } catch (error) {
      setErrors(error.response?.data?.message || error.response?.data?.error || "Profile finalization failed.")
    } finally {
      setIsLoading(false)
    }
  }

  const stepVariants = {
    enter: { opacity: 0, y: 12 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[15%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl relative z-10"
      >
        <Card className="bg-card/40 backdrop-blur-2xl border-border/40 rounded-[2.5rem] shadow-2xl overflow-hidden">

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <CardHeader className="text-center space-y-2 pt-10 pb-6 px-8">
            <CardTitle className="text-4xl font-black tracking-tighter text-foreground uppercase">
              Initialize <span className="text-primary">Profile</span>
            </CardTitle>
            <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
              Calibrate your digital identity for the DevMate ecosystem
            </CardDescription>
          </CardHeader>

          {/* ── Step Indicator ──────────────────────────────────────────────── */}
          <div className="px-8">
            <StepIndicator steps={STEPS} currentStep={activeStep} />
          </div>

          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-10">

              {/* ══════════════════════════════════════════════════════════════
                  STEP 0 — IDENTITY
                  Avatar · Age · Gender · Bio · GitHub
              ══════════════════════════════════════════════════════════════ */}
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div
                    key="step-0"
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="space-y-8"
                  >
                    <Section icon={Fingerprint} title="Identity Core" subtitle="Who you are in the network">

                      {/* Avatar — full width, centred, prominent */}
                      <div className="flex flex-col items-center gap-4">
                        <motion.div
                          whileHover={{ scale: 1.04 }}
                          className="relative w-28 h-28 rounded-3xl overflow-hidden border-2 border-dashed border-border/50 bg-muted/20 flex items-center justify-center transition-colors hover:border-primary/50"
                        >
                          {photoPreview ? (
                            <img src={photoPreview} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center gap-2 opacity-40">
                              <ImageIcon className="w-9 h-9" />
                              <span className="text-[9px] font-black uppercase tracking-widest">Avatar</span>
                            </div>
                          )}
                          {uploadingImage && (
                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                              <Loader2 className="w-7 h-7 text-primary animate-spin" />
                            </div>
                          )}
                        </motion.div>

                        <label className="cursor-pointer group">
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploadingImage} />
                          <div className="flex items-center gap-2 px-5 py-2.5 bg-muted/30 border border-border/50 rounded-xl hover:bg-muted/50 transition-all">
                            <Upload className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
                              Upload Packet
                            </span>
                          </div>
                        </label>
                      </div>

                      {/* Age + Gender — equal columns */}
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Temporal Age">
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
                        </Field>

                        <Field label="Node Gender">
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
                        </Field>
                      </div>

                      {/* Bio — full width */}
                      <Field label="Digital Bio" hint={`${bio.length}/250`}>
                        <div className="relative group/input">
                          <Textarea
                            placeholder="Synthesize your mission and technical stack..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="min-h-[110px] pl-12 pt-4 bg-muted/20 border-border/50 rounded-2xl focus:ring-primary/20 text-sm font-bold placeholder:opacity-30 resize-none"
                          />
                          <Terminal className="absolute left-4 top-4 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                        </div>
                      </Field>

                      {/* GitHub — full width, visually separated */}
                      <div className="pt-1">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => window.location.href = `${axiosInstance.defaults.baseURL}/github/auth`}
                          className="w-full h-12 rounded-xl border-border/50 hover:bg-muted/50 gap-2 font-bold"
                        >
                          <Github className="w-4 h-4" />
                          Connect GitHub Account
                        </Button>
                      </div>
                    </Section>
                  </motion.div>
                )}

                {/* ════════════════════════════════════════════════════════════
                    STEP 1 — LOCATION
                    Country → State → City in a clean vertical stack
                ════════════════════════════════════════════════════════════ */}
                {activeStep === 1 && (
                  <motion.div
                    key="step-1"
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="space-y-8"
                  >
                    <Section icon={MapPin} title="Network Node" subtitle="Broadcast your coordinates">
                      <div className="space-y-4">
                        <Field label="Country">
                          <div className="relative group/select">
                            <Select value={country} onValueChange={setCountry} disabled={loadingCountries}>
                              <SelectTrigger className="h-12 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-medium text-sm">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                  <MapPin className="w-4 h-4 text-muted-foreground/40 group-focus-within/select:text-primary transition-all duration-300" />
                                </div>
                                <SelectValue placeholder={loadingCountries ? "Loading..." : "Select Country"} />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border/50 rounded-2xl backdrop-blur-xl max-h-60 overflow-y-auto">
                                {countries.map((c) => (
                                  <SelectItem key={c.id} value={c.name} className="rounded-xl">{c.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </Field>

                        <Field label="State">
                          <div className="relative group/select">
                            <Select value={state} onValueChange={setState} disabled={!country || loadingStates}>
                              <SelectTrigger className="h-12 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-medium text-sm">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                  <MapPin className="w-4 h-4 text-muted-foreground/40 group-focus-within/select:text-primary transition-all duration-300" />
                                </div>
                                <SelectValue placeholder={loadingStates ? "Loading..." : !country ? "Select country first" : "Select State"} />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border/50 rounded-2xl backdrop-blur-xl max-h-60 overflow-y-auto">
                                {states.map((s) => (
                                  <SelectItem key={s.id} value={s.name} className="rounded-xl">{s.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </Field>

                        <Field label="City">
                          <div className="relative group/select">
                            <Select value={city} onValueChange={setCity} disabled={!state || loadingCities}>
                              <SelectTrigger className="h-12 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-medium text-sm">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                  <MapPin className="w-4 h-4 text-muted-foreground/40 group-focus-within/select:text-primary transition-all duration-300" />
                                </div>
                                <SelectValue placeholder={loadingCities ? "Loading..." : !state ? "Select state first" : "Select City"} />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border/50 rounded-2xl backdrop-blur-xl max-h-60 overflow-y-auto">
                                {cities.map((c) => (
                                  <SelectItem key={c.id} value={c.name} className="rounded-xl">{c.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </Field>

                        {/* Visual progress hint for cascading selects */}
                        <div className="flex items-center gap-3 p-3 bg-muted/10 rounded-2xl border border-border/20">
                          {[
                            { label: "Country", done: !!country },
                            { label: "State", done: !!state },
                            { label: "City", done: !!city },
                          ].map((step, i) => (
                            <div key={i} className="flex items-center gap-2 flex-1">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${step.done ? "bg-primary" : "bg-border/40"}`} />
                              <span className={`text-[9px] font-black uppercase tracking-widest ${step.done ? "text-primary" : "text-muted-foreground/30"}`}>
                                {step.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Section>
                  </motion.div>
                )}

                {/* ════════════════════════════════════════════════════════════
                    STEP 2 — SKILLS
                ════════════════════════════════════════════════════════════ */}
                {activeStep === 2 && (
                  <motion.div
                    key="step-2"
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="space-y-8"
                  >
                    <Section icon={Cpu} title="Technical Core" subtitle="Minimum 3 skills required">
                      <div className="space-y-4">
                        {/* Input + inject button */}
                        <div className="relative group/input">
                          <Input
                            placeholder="e.g. Next.js, Rust, AWS"
                            value={currentSkill}
                            onChange={(e) => setCurrentSkill(e.target.value)}
                            onKeyPress={handleSkillKeyPress}
                            className="h-14 pl-12 pr-28 bg-muted/20 border-border/50 rounded-2xl focus:ring-primary/20 text-sm font-bold placeholder:opacity-30"
                          />
                          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                          <Button
                            type="button"
                            onClick={addSkill}
                            disabled={!currentSkill.trim()}
                            className="absolute right-2 top-2 h-10 px-5 rounded-xl text-[10px] font-black uppercase bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                          >
                            Inject
                          </Button>
                        </div>

                        {/* Skill counter */}
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                            {skills.length} / 3+ loaded
                          </span>
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <div
                                key={i}
                                className={`w-6 h-1 rounded-full transition-all duration-300 ${skills.length > i ? "bg-primary" : "bg-border/30"}`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Skill tags */}
                        <AnimatePresence>
                          {skills.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex flex-wrap gap-2 p-4 bg-muted/10 border border-border/30 rounded-3xl min-h-[64px]"
                            >
                              <AnimatePresence>
                                {skills.map((skill, index) => (
                                  <motion.div
                                    key={skill}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.7 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                  >
                                    <Badge className="pl-3 pr-1 py-1.5 bg-primary/20 text-primary-foreground border-primary/30 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                      {skill}
                                      <button
                                        type="button"
                                        className="p-1 hover:bg-primary/30 rounded-lg transition-colors"
                                        onClick={() => removeSkill(skill)}
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </Badge>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {skills.length === 0 && (
                          <div className="flex flex-col items-center gap-2 py-8 opacity-30">
                            <Cpu className="w-8 h-8" />
                            <span className="text-[9px] font-black uppercase tracking-widest">No skills injected yet</span>
                          </div>
                        )}
                      </div>
                    </Section>
                  </motion.div>
                )}

                {/* ════════════════════════════════════════════════════════════
                    STEP 3 — FINALIZE (summary review)
                ════════════════════════════════════════════════════════════ */}
                {activeStep === 3 && (
                  <motion.div
                    key="step-3"
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="space-y-8"
                  >
                    <Section icon={Zap} title="Finalize Node" subtitle="Review and establish link">
                      <div className="space-y-3">

                        {/* Profile snapshot */}
                        <div className="flex items-center gap-4 p-4 bg-muted/10 border border-border/20 rounded-2xl">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-muted/30 flex-shrink-0 border border-border/30">
                            {photoPreview
                              ? <img src={photoPreview} alt="Avatar" className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center opacity-30"><User className="w-6 h-6" /></div>
                            }
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-foreground truncate">{bio || "No bio provided"}</p>
                            <p className="text-[10px] text-muted-foreground/50 mt-1 uppercase tracking-widest">
                              {gender || "—"} · {userAge ? `${userAge}yr` : "—"} · {city || country || "No location"}
                            </p>
                          </div>
                        </div>

                        {/* Skills summary */}
                        <div className="p-4 bg-muted/10 border border-border/20 rounded-2xl space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Skills Loaded</p>
                          {skills.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {skills.map((s) => (
                                <span key={s} className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-primary/20 text-primary rounded-lg border border-primary/20">
                                  {s}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[10px] text-destructive/70 font-bold">No skills — go back to step 3</p>
                          )}
                        </div>

                        {/* Checklist */}
                        {[
                          { label: "Age set", ok: !!userAge },
                          { label: "Gender set", ok: !!gender },
                          { label: "Bio written (20–250 chars)", ok: bio.length >= 20 && bio.length <= 250 },
                          { label: "3+ skills loaded", ok: skills.length >= 3 },
                        ].map(({ label, ok }) => (
                          <div key={label} className="flex items-center gap-3 px-1">
                            {ok
                              ? <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                              : <X className="w-4 h-4 text-destructive/60 flex-shrink-0" />
                            }
                            <span className={`text-[10px] font-black uppercase tracking-widest ${ok ? "text-foreground/60" : "text-destructive/60"}`}>
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Section>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Error alert ──────────────────────────────────────────────── */}
              <AnimatePresence>
                {errors && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Alert className="bg-destructive/10 border-destructive/20 rounded-2xl">
                      <AlertDescription className="text-destructive text-[10px] font-black uppercase tracking-widest text-center whitespace-pre-line">
                        {errors}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Navigation buttons ───────────────────────────────────────── */}
              <div className={`flex gap-3 ${activeStep > 0 ? "justify-between" : "justify-end"}`}>
                {activeStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setErrors(""); setActiveStep(s => s - 1); }}
                    className="h-12 px-6 rounded-2xl border-border/50 font-black text-[10px] uppercase tracking-widest hover:bg-muted/30"
                  >
                    ← Back
                  </Button>
                )}

                {activeStep < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={() => { setErrors(""); setActiveStep(s => s + 1); }}
                    className="h-12 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Next →
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    loading={isLoading}
                    disabled={isLoading}
                    className="flex-1 h-14 bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all relative overflow-hidden group/submit"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/submit:animate-shimmer" />
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Establish Node Link</span>
                    </div>
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer meta */}
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