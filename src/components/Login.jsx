import { useState } from "react"
import { Eye, EyeOff, Mail, Heart, Github, Terminal, Zap, ShieldCheck } from "lucide-react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { addUser } from "../utils/userSlice"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../utils/constants"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Alert, AlertDescription } from "./ui/alert"
import { Separator } from "./ui/separator"
import { Input } from "./ui/input"
import { motion, AnimatePresence } from "framer-motion"

const Login = () => {
  const [emailId, setEmailId] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [errors, setErrors] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoginForm, setIsLoginForm] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const validateInputs = () => {
    let validationError = ""
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailId.trim()) {
      validationError += "Neural address required.\n"
    } else if (!emailRegex.test(emailId)) {
      validationError += "Invalid protocol format.\n"
    }

    if (!password.trim()) {
      validationError += "Access key required.\n"
    } else if (password.length < 8) {
      validationError += "Key must be at least 8 characters.\n"
    }

    if (!isLoginForm) {
      if (!firstName.trim()) {
        validationError += "First name required.\n"
      } else if (firstName.length < 2 || firstName.length > 20) {
        validationError += "Invalid identifier length.\n"
      }
    }

    setErrors(validationError.trim())
    return validationError === ""
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setErrors("")
    if (!validateInputs()) return

    try {
      setIsLoading(true)
      const res = await axios.post(`${BASE_URL}/login`, { emailId, password }, { withCredentials: true })
      dispatch(addUser(res.data.data))
      setIsLoading(false)
      navigate("/app")
    } catch (error) {
      setIsLoading(false)
      const msg = error.response?.data || "Authentication failed"
      setErrors(msg)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setErrors("")
    if (!validateInputs()) return

    try {
      setIsLoading(true)
      await axios.post(
        `${BASE_URL}/signup`,
        { emailId, password, firstName, lastName },
        { withCredentials: true }
      )
      setIsLoading(false)
      setIsLoginForm(true) 
      setErrors("")
      // Auto-switching after custom toast or alert logic could be added here
    } catch (error) {
      setIsLoading(false)
      setErrors(error.response?.data || "Node creation failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[size:40px_40px] opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand/App Branding */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-muted/30 border border-border/50 rounded-[2rem] shadow-2xl relative group">
            <div className="absolute inset-0 bg-primary/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Heart className="w-10 h-10 text-primary fill-current relative z-10" />
            <div className="absolute -top-1 -right-1 p-1.5 bg-background border border-border rounded-lg shadow-xl">
                <Zap className="w-3 h-3 text-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">
                Dev<span className="text-primary italic">Mate</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">
                Network Protocol v2.0
            </p>
          </div>
        </div>

        <Card className="bg-card/50 backdrop-blur-xl border-border/50 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          <CardHeader className="pt-10 pb-6 text-center space-y-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLoginForm ? "login-title" : "signup-title"}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <CardTitle className="text-2xl font-black tracking-tight text-foreground uppercase">
                  {isLoginForm ? "Initialize Link" : "Create Node"}
                </CardTitle>
                <CardDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                  {isLoginForm
                    ? "Verify credentials to enter ecosystem"
                    : "Generate your unique developer identifier"}
                </CardDescription>
              </motion.div>
            </AnimatePresence>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={isLoginForm ? handleLogin : handleSignUp} className="space-y-6">
              {!isLoginForm && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="grid grid-cols-2 gap-4 overflow-hidden"
                >
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identifier</Label>
                    <Input
                      placeholder="First"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-12 bg-muted/20 border-border/50 rounded-xl focus:ring-primary/20 text-sm font-bold placeholder:opacity-30"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-transparent">.</Label>
                    <Input
                      placeholder="Last"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-12 bg-muted/20 border-border/50 rounded-xl focus:ring-primary/20 text-sm font-bold placeholder:opacity-30"
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-2.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Neural Address</Label>
                <div className="relative group/input">
                  <Input
                    type="email"
                    placeholder="dev@example.com"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    className="h-12 pl-12 bg-muted/20 border-border/50 rounded-xl focus:ring-primary/20 text-sm font-bold placeholder:opacity-30 transition-all"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Access Key</Label>
                    {isLoginForm && (
                        <button type="button" className="text-[9px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors">Recover</button>
                    )}
                </div>
                <div className="relative group/input">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-12 pr-12 bg-muted/20 border-border/50 rounded-xl focus:ring-primary/20 text-sm font-bold placeholder:opacity-30 transition-all"
                  />
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50 rounded-lg text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {errors && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <Alert className="bg-destructive/10 border-destructive/20 rounded-2xl p-4">
                        <AlertDescription className="text-destructive text-[10px] font-black uppercase tracking-widest text-center leading-relaxed">
                            {errors}
                        </AlertDescription>
                    </Alert>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                {isLoading ? (
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Synchronizing</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>{isLoginForm ? "Verify & Enter" : "Establish Node"}</span>
                    </div>
                )}
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><Separator className="w-full bg-border/30" /></div>
                <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.3em] text-muted-foreground/40 italic">
                  <span className="bg-card px-4">External Auth</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-14 bg-muted/20 border-border/50 text-foreground font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-muted/40 transition-all active:scale-98"
                disabled
              >
                <Github className="w-5 h-5 mr-3" />
                <span>{isLoginForm ? "OAuth via GitHub" : "Sync With GitHub"}</span>
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-muted/10 border-t border-border/30 p-8">
            <div className="w-full text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {isLoginForm ? (
                <>
                  New developer?{" "}
                  <button
                    className="font-black text-primary hover:text-primary/80 underline decoration-2 underline-offset-4 transition-colors ml-1"
                    onClick={() => { setIsLoginForm(false); setErrors(""); }}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Existing node?{" "}
                  <button
                    className="font-black text-primary hover:text-primary/80 underline decoration-2 underline-offset-4 transition-colors ml-1"
                    onClick={() => { setIsLoginForm(true); setErrors(""); }}
                  >
                    Sync Credentials
                  </button>
                </>
              )}
            </div>
          </CardFooter>
        </Card>

        {/* Footer Meta */}
        <div className="mt-8 text-center space-y-4">
            <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.5em]">
                Secure Decentralized Verification
            </p>
            <div className="flex items-center justify-center gap-4 opacity-20">
                <Globe className="w-4 h-4" />
                <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                <Lock className="w-4 h-4" />
                <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                <Cpu className="w-4 h-4" />
            </div>
        </div>
      </motion.div>
    </div>
  )
}

// Missing imports to be safe
import { Globe, Lock, Cpu } from "lucide-react"

export default Login
