import { useState } from "react"
import { Eye, EyeOff, Mail, Heart, Github, Terminal, Zap, ShieldCheck, Globe, Lock, Cpu } from "lucide-react"
import axiosInstance from "../../api/axiosInstance"
import { useDispatch } from "react-redux"
import { addUser } from "../../store/slices/userSlice"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Separator } from "../../components/ui/separator"
import { Input } from "../../components/ui/input"
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
      validationError += "Email address required.\n"
    } else if (!emailRegex.test(emailId)) {
      validationError += "Invalid email format.\n"
    }

    if (!password.trim()) {
      validationError += "Password required.\n"
    } else if (password.length < 8) {
      validationError += "Password must be at least 8 characters.\n"
    }

    if (!isLoginForm) {
      if (!firstName.trim()) {
        validationError += "First name required.\n"
      } else if (firstName.length < 2 || firstName.length > 20) {
        validationError += "First name too short.\n"
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
      const res = await axiosInstance.post("/login", { emailId, password })
      dispatch(addUser(res.data.data))
      navigate("/app")
    } catch (error) {
      setIsLoading(false)
      const msg = error.response?.data?.message || error.response?.data || "Authentication failed"
      setErrors(msg)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setErrors("")
    if (!validateInputs()) return

    try {
      setIsLoading(true)
      await axiosInstance.post(
        "/signup",
        { emailId, password, firstName, lastName }
      )
      setIsLoginForm(true) 
      setErrors("")
    } catch (error) {
      setIsLoading(false)
      const msg = error.response?.data?.message || error.response?.data || "Account creation failed"
      setErrors(msg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%]-left-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px] animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[size:40px_40px] opacity-[0.01] bg-[linear-gradient(to_right,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground))_1px,transparent_1px)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand/App Branding */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-primary/5 border border-primary/10 rounded-2xl shadow-xl relative group">
            <Heart className="w-10 h-10 text-primary fill-current relative z-10" />
            <div className="absolute -top-1 -right-1 p-1.5 bg-background border border-border rounded-lg shadow-xl">
                <Zap className="w-3 h-3 text-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Dev<span className="text-primary font-light">Mate</span>
            </h1>
            <p className="text-xs font-semibold text-muted-foreground/60 tracking-wider">
                Connecting Modern Developers
            </p>
          </div>
        </div>

        <Card className="bg-card/50 backdrop-blur-xl border-border/50 rounded-3xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          <CardHeader className="pt-10 pb-6 text-center space-y-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLoginForm ? "login-title" : "signup-title"}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <CardTitle className="text-2xl font-bold tracking-tight text-foreground uppercase">
                  {isLoginForm ? "Welcome Back" : "Create Account"}
                </CardTitle>
                <CardDescription className="text-xs font-semibold text-muted-foreground/50 tracking-wide">
                  {isLoginForm
                    ? "Enter your credentials to continue"
                    : "Join the largest developer community"}
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
                    <Label className="text-xs font-semibold text-muted-foreground">First Name</Label>
                    <Input
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-12 bg-muted/20 border-border/50 rounded-xl focus:ring-primary/20 text-sm font-medium placeholder:opacity-30"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-xs font-semibold text-transparent">.</Label>
                    <Input
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-12 bg-muted/20 border-border/50 rounded-xl focus:ring-primary/20 text-sm font-medium placeholder:opacity-30"
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-2.5">
                <Label className="text-xs font-semibold text-muted-foreground">Email Address</Label>
                <div className="relative group/input">
                  <Input
                    type="email"
                    placeholder="dev@example.com"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    className="h-12 pl-12 bg-muted/20 border-border/50 rounded-xl focus:ring-primary/20 text-sm font-medium placeholder:opacity-30 transition-all"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within/input:text-primary transition-colors" />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                    <Label className="text-xs font-semibold text-muted-foreground">Password</Label>
                    {isLoginForm && (
                        <button type="button" className="text-[10px] font-semibold text-primary/60 hover:text-primary transition-colors">Forgot Password?</button>
                    )}
                </div>
                <div className="relative group/input">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-12 pr-12 bg-muted/20 border-border/50 rounded-xl focus:ring-primary/20 text-sm font-medium placeholder:opacity-30 transition-all"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within/input:text-primary transition-colors" />
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
                    <Alert className="bg-destructive/10 border-destructive/20 rounded-xl p-3">
                        <AlertDescription className="text-destructive text-xs font-semibold text-center leading-relaxed">
                            {errors}
                        </AlertDescription>
                    </Alert>
                </motion.div>
              )}

              <Button
                type="submit"
                loading={isLoading}
                className="w-full h-12 bg-primary text-primary-foreground font-bold text-sm rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all relative overflow-hidden group/btn"
              >
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isLoginForm ? "Sign In" : "Sign Up"}</span>
                </div>
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><Separator className="w-full bg-border/50" /></div>
                <div className="relative flex justify-center text-[10px] font-semibold text-muted-foreground/50">
                  <span className="bg-card px-4">OR CONTINUE WITH</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 bg-muted/10 border-border/50 text-foreground font-semibold text-sm rounded-xl hover:bg-muted/20 transition-all"
                disabled
              >
                <Github className="w-5 h-5 mr-3" />
                <span>GitHub</span>
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-muted/5 border-t border-border/30 p-8">
            <div className="w-full text-center text-sm font-medium text-muted-foreground">
              {isLoginForm ? (
                <>
                  New developer?{" "}
                  <button
                    className="font-bold text-primary hover:text-primary/80 transition-colors ml-1"
                    onClick={() => { setIsLoginForm(false); setErrors(""); }}
                  >
                    Create Account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    className="font-bold text-primary hover:text-primary/80 transition-colors ml-1"
                    onClick={() => { setIsLoginForm(true); setErrors(""); }}
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </CardFooter>
        </Card>

        {/* Footer Meta */}
        <div className="mt-8 text-center space-y-4">
            <p className="text-[10px] font-semibold text-muted-foreground/30 uppercase tracking-[0.3em]">
                Secure Professional Platform
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

export default Login
