import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axiosInstance from "../../api/axiosInstance"
import { useDispatch } from "react-redux"
import { addUser } from "../../store/slices/userSlice"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { ShieldCheck, Loader2, Mail, Lock, Zap } from "lucide-react"
import { motion } from "framer-motion"

const VerifyEmail = () => {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { state } = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const emailId = state?.emailId

  const verifyOTP = async () => {
    if (!otp || otp.length < 6) {
        setError("Please enter a valid 6-digit verification code.")
        return
    }
    
    try {
      setLoading(true)
      setError("")
      const res = await axiosInstance.post("/verify-email", { emailId, otp })

      dispatch(addUser(res.data.data))
      navigate("/app")
    } catch (err) {
      setError(err.response?.data || "Invalid synchronization code.")
    } finally {
      setLoading(false)
    }
  }

  if (!emailId) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <div className="text-destructive font-black uppercase tracking-widest text-xs">Access Denied</div>
                <Button variant="outline" onClick={() => navigate("/login")}>Return to Base</Button>
            </div>
        </div>
      )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[size:32px_32px] opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-card/40 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-8 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl border border-primary/20 shadow-inner">
                <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">Verify <span className="text-primary italic">Node</span></h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">
                    A verification packet was sent to your neural address
                </p>
            </div>
          </div>

          <div className="bg-muted/10 border border-border/30 rounded-2xl p-4 flex items-center gap-4 group transition-colors hover:border-border/60">
            <div className="p-2 bg-background border border-border rounded-xl">
                <Mail className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">Target Address</div>
                <div className="text-sm font-bold truncate text-foreground/80 lowercase italic">{emailId}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Synchronization Code</label>
                <div className="relative group/input">
                    <Input
                      placeholder="000 000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="h-14 text-center text-xl font-black tracking-[1em] bg-muted/20 border-border/50 rounded-2xl focus:ring-primary/20 placeholder:opacity-20 placeholder:tracking-normal transition-all"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="text-[10px] font-black uppercase tracking-widest text-destructive text-center p-2 bg-destructive/10 rounded-xl border border-destructive/20">
                    {error}
                  </div>
              </motion.div>
            )}

            <Button 
                onClick={verifyOTP} 
                loading={loading}
                disabled={otp.length < 6}
                className="w-full h-14 bg-primary text-primary-foreground font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
              <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Establish Link</span>
              </div>
            </Button>
          </div>

          <div className="text-center">
            <button 
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors underline underline-offset-4 decoration-2"
                onClick={() => navigate("/login")}
            >
                Back to Authentication
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
            <p className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-[0.6em]">
                Secure Protocol Enforcement
            </p>
        </div>
      </motion.div>
    </div>
  )
}

export default VerifyEmail
