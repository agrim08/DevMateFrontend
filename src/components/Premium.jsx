import { useState, useEffect } from "react"
import { Crown, Check, X, Zap, ShieldCheck, Sparkles, CreditCard, ArrowRight } from "lucide-react"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      })
      if (res.data.isPremium) {
        setIsUserPremium(true)
      }
    } catch (error) {
      console.error("Error verifying premium status:", error)
    }
  }

  useEffect(() => {
    verifyPremiumUser()
  }, [])

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => console.log("Razorpay script loaded")
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleMembership = async (membershipType) => {
    if (isUserPremium) {
      setShowCelebration(true)
      return
    }

    if (typeof window.Razorpay === "undefined") {
      toast.error("Bridge Unavailable", {
        description: "Payment system is still initializing. Please wait a second and try again."
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(
        `${BASE_URL}/payment/create-order`,
        { membershipType },
        { withCredentials: true },
      )

      const { amount, currency, keyId, orderId, notes } = response.data.data

      const options = {
        key: keyId,
        amount,
        currency,
        name: "DevMate Premium",
        description: `Upgrading to ${membershipType.toUpperCase()} tier`,
        order_id: orderId,
        prefill: {
          name: notes?.firstName ? `${notes.firstName} ${notes.lastName || ''}` : "Developer",
          email: notes?.emailId || "",
        },
        theme: { 
          color: "#3b82f6", // DevMate Primary Blue
          backdrop_color: "#020617" 
        },
        modal: {
          ondismiss: () => setIsLoading(false)
        },
        handler: async (response) => {
          try {
            // Verify payment on backend if needed, or just refresh
            await verifyPremiumUser()
            setShowCelebration(true)
            toast.success("Transaction Complete", {
              description: "Welcome to the elite tier of DevMate."
            })
          } catch (e) {
            console.error("Verification error", e)
          } finally {
            setIsLoading(false)
          }
        },
      }
      
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response) {
          toast.error("Payment Failed", { description: response.error.description })
          setIsLoading(false)
      })
      rzp.open()
    } catch (error) {
      console.error("Order creation error:", error)
      toast.error("Order Initialization Failed", {
        description: error.response?.data || "Could not connect to payment server."
      })
      setIsLoading(false)
    }
  }

  const plans = [
    {
      name: "Emerald",
      price: "₹300",
      duration: "3 months",
      popular: false,
      description: "Perfect for active developers building their professional circle.",
      features: [
        { text: "Follow up to 50 users / day", included: true },
        { text: "Direct messaging access", included: true },
        { text: "3 months validity", included: true },
        { text: "Premium badge", included: false },
        { text: "Priority support", included: false },
      ],
    },
    {
      name: "Diamond",
      price: "₹1200",
      duration: "6 months",
      popular: true,
      description: "The ultimate experience for engineering leaders and influencers.",
      features: [
        { text: "Follow up to 100 users / day", included: true },
        { text: "Direct messaging access", included: true },
        { text: "Exclusive Premium badge", included: true },
        { text: "24/7 Priority support", included: true },
        { text: "6 months validity", included: true },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background pt-16 pb-24 px-4 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>
      
      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-xl flex items-center justify-center z-[100] p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-card border border-primary/20 p-10 rounded-[2.5rem] shadow-2xl text-center space-y-8 relative overflow-hidden"
            >
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
              
              <div className="relative inline-flex flex-col items-center">
                <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mb-4">
                  <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                </div>
                <h2 className="text-4xl font-black text-foreground tracking-tighter">Elite Member</h2>
                <div className="h-1 w-12 bg-primary mt-2 rounded-full" />
              </div>
              
              <p className="text-muted-foreground font-medium leading-relaxed">
                Your account has been successfully upgraded. You now have unrestricted access to the most powerful networking features on DevMate.
              </p>

              <div className="space-y-3">
                <Button asChild className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs bg-primary text-primary-foreground shadow-xl shadow-primary/20">
                  <Link to="/app">Enter Workspace</Link>
                </Button>
                <button onClick={() => setShowCelebration(false)} className="text-muted-foreground text-xs font-black uppercase tracking-widest hover:text-foreground transition-colors py-2">
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
            <h1 className="text-4xl font-black text-foreground tracking-tight md:text-5xl leading-[1.1]">
                Supercharge your <br />
                <span className="text-primary italic">Network</span>.
            </h1>
            <p className="text-muted-foreground font-medium max-w-xl mx-auto text-lg leading-relaxed">
                Unlock high-frequency networking, direct communication channels, and exclusive identity badges.
            </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch px-4">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative flex flex-col p-10 rounded-[2.5rem] border transition-all duration-500 bg-card/50 backdrop-blur-sm group ${
                plan.popular 
                  ? "border-primary/50 shadow-2xl shadow-primary/10 ring-1 ring-primary/20" 
                  : "border-border hover:border-primary/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                   <Badge className="bg-primary text-primary-foreground font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px] shadow-lg">
                      Recommended
                   </Badge>
                </div>
              )}

              <div className="mb-8 space-y-3">
                <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-foreground tracking-tight">
                        {plan.name}
                    </h3>
                    {plan.name === 'Diamond' ? <Crown className="w-6 h-6 text-primary fill-current" /> : <ShieldCheck className="w-6 h-6 text-primary" />}
                </div>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                    {plan.description}
                </p>
              </div>

              <div className="mb-12">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-foreground tracking-tighter">{plan.price}</span>
                  <span className="text-muted-foreground font-black text-xs uppercase tracking-widest">/ {plan.duration}</span>
                </div>
              </div>

              <div className="space-y-5 mb-14 flex-1">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 border ${feature.included ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted/50 border-border/50 text-muted-foreground/30'}`}>
                        {feature.included ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`text-sm font-bold tracking-tight ${feature.included ? 'text-foreground' : 'text-muted-foreground/40'}`}>
                        {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleMembership(plan.name.toLowerCase())}
                disabled={isLoading}
                className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 group/btn overflow-hidden ${
                  plan.popular 
                    ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-[1.02]" 
                    : "bg-muted text-foreground hover:bg-muted-foreground/10"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Processing</span>
                  </div>
                ) : isUserPremium ? (
                  <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Active</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 relative">
                    <CreditCard className="w-4 h-4" />
                    <span>Select {plan.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                  </div>
                )}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-24 text-center space-y-6">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">
                Secure Payment Powered by Razorpay
            </p>
            <div className="flex items-center justify-center gap-8 opacity-30 grayscale hover:grayscale-0 transition-all">
                <div className="w-12 h-12 rounded-xl bg-muted" />
                <div className="w-12 h-12 rounded-xl bg-muted" />
                <div className="w-12 h-12 rounded-xl bg-muted" />
            </div>
        </div>
      </div>
    </div>
  )
}

export default Premium
