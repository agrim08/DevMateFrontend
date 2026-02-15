import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { 
  Heart, 
  Users, 
  MessageCircle, 
  Code, 
  Zap, 
  Globe, 
  ArrowRight, 
  CheckCircle,
  Star,
  Github,
  Linkedin,
  Twitter
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

const Landing = () => {
  const navigate = useNavigate()
  const { data: user } = useSelector((store) => store.user)
  const [isVisible, setIsVisible] = useState({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }))
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('[data-animate]')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const handleGetStarted = () => {
    if (user) {
      navigate("/app")
    } else {
      navigate("/login")
    }
  }

  const handleDashboardClick = () => {
    navigate("/app")
  }

  const features = [
    {
      icon: Users,
      title: "Connect with Developers",
      description: "Discover and connect with like-minded developers from around the world"
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Engage in meaningful conversations with your developer network"
    },
    {
      icon: Code,
      title: "Skill Matching",
      description: "Find developers with complementary skills for your projects"
    },
    {
      icon: Zap,
      title: "Premium Features",
      description: "Unlock advanced networking tools with our premium membership"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Join a worldwide community of passionate developers"
    },
    {
      icon: Heart,
      title: "Built for Developers",
      description: "Designed specifically for the developer community's unique needs"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Full Stack Developer",
      content: "DevMate helped me find amazing collaborators for my open source projects. The community is incredibly supportive!",
      avatar: "SC"
    },
    {
      name: "Alex Rodriguez",
      role: "Frontend Engineer",
      content: "I've made genuine connections that led to job opportunities. DevMate is a game-changer for developers.",
      avatar: "AR"
    },
    {
      name: "Priya Patel",
      role: "Backend Developer",
      content: "The skill matching feature is brilliant. I found the perfect mentor to help me level up my career.",
      avatar: "PP"
    }
  ]

  const stats = [
    { number: "10K+", label: "Active Developers" },
    { number: "50K+", label: "Connections Made" },
    { number: "100+", label: "Countries" },
    { number: "95%", label: "Satisfaction Rate" }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <Heart className="h-5 w-5 text-primary-foreground fill-current" />
              </div>
              <div className="hidden sm:block">
                <span className="font-black text-xl tracking-tighter text-foreground uppercase">DevMate</span>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest -mt-1">Connect & Grow</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Button onClick={handleDashboardClick} className="bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-xl px-6 h-10 shadow-lg shadow-primary/10">
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/login")} className="text-xs font-black uppercase tracking-widest rounded-xl px-6 h-10">
                    Sign In
                  </Button>
                  <Button onClick={handleGetStarted} className="bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest rounded-xl px-6 h-10 shadow-lg shadow-primary/10">
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div 
            id="hero"
            data-animate
            className={`transition-all duration-1000 ${
              isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Badge className="mb-8 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-sm">
              <Star className="w-3.5 h-3.5 mr-2 fill-current" />
              Join 10,000+ Elite Developers
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black text-foreground mb-8 tracking-tighter leading-[0.9] uppercase">
                Connect with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-tr from-primary via-primary/80 to-primary/40">
                Amazing
              </span>
              <br /> Developers
            </h1>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
              DevMate is the premier ecosystem for modern engineers to cultivate high-signal networks, collaborate on mission-critical code, and accelerate career velocity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-xs h-16 px-10 rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Join Workspace
                <ArrowRight className="ml-3 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-border bg-card/40 backdrop-blur-sm text-foreground font-black uppercase tracking-[0.2em] text-xs h-16 px-10 rounded-2xl hover:bg-muted/50 transition-all"
              >
                View Protocol
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-border/40 bg-muted/20">
        <div className="container mx-auto px-4">
          <div 
            id="stats"
            data-animate
            className={`grid grid-cols-2 md:grid-cols-4 gap-12 transition-all duration-1000 delay-200 ${
              isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-5xl font-black text-foreground mb-3 tracking-tighter group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                </div>
                <div className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-60">
                    {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="container mx-auto">
          <div 
            id="features-header"
            data-animate
            className={`text-center mb-20 transition-all duration-1000 delay-300 ${
              isVisible['features-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tighter uppercase leading-tight">
              Sovereign Networking <br />
              <span className="text-primary opacity-50">Protocol</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto font-medium opacity-60">
              Advanced feature sets optimized for the specific social dynamics of engineering professionals.
            </p>
          </div>

          <div 
            id="features-grid"
            data-animate
            className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-500 ${
              isVisible['features-grid'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {features.map((feature, index) => (
              <Card key={index} className="group hover:border-primary/50 transition-all duration-500 border-border/50 bg-card/40 backdrop-blur-xl rounded-[2rem] overflow-hidden">
                <CardContent className="p-10">
                  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-primary-foreground fill-current" />
                  </div>
                  <h3 className="text-xl font-black text-foreground mb-4 uppercase tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed opacity-70">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-primary text-primary-foreground overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-black/10 skew-x-12 transform origin-top" />
        <div className="container mx-auto px-4 relative z-10">
          <div 
            id="testimonials-header"
            data-animate
            className={`text-center mb-24 transition-all duration-1000 delay-200 ${
              isVisible['testimonials-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-5xl font-black mb-6 tracking-tighter uppercase">Developer Intel</h2>
            <p className="text-xl text-primary-foreground/60 max-w-xl mx-auto font-medium">
              Verified transmissions from nodes operating within the DevMate network.
            </p>
          </div>

          <div 
            id="testimonials-grid"
            data-animate
            className={`grid md:grid-cols-3 gap-10 transition-all duration-1000 delay-400 ${
              isVisible['testimonials-grid'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-primary-foreground/5 backdrop-blur-sm border-primary-foreground/10 hover:bg-primary-foreground/10 transition-all duration-500 rounded-3xl">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary-foreground/20 rounded-2xl flex items-center justify-center text-primary-foreground font-black text-sm mr-4 shadow-inner">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-black text-primary-foreground uppercase text-xs tracking-widest">{testimonial.name}</div>
                      <div className="text-primary-foreground/40 text-[10px] font-bold uppercase tracking-widest">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-primary-foreground/80 font-medium leading-relaxed italic">"{testimonial.content}"</p>
                  <div className="flex mt-6 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-primary-foreground fill-current opacity-20" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-4 bg-background relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="container mx-auto text-center relative z-10">
          <div 
            id="cta"
            data-animate
            className={`transition-all duration-1000 delay-200 ${
              isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-5xl md:text-7xl font-black text-foreground mb-8 tracking-tighter uppercase leading-none">
                Establish Your <br />
                <span className="text-primary">Presence</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto font-medium opacity-60">
              The neural network is waiting. Synchronize your profile and start connecting with amazing developers in under 30 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-xs h-16 px-12 rounded-[1.5rem] shadow-[0_20px_40px_-10px_rgba(var(--primary),0.3)] hover:scale-[1.05] active:scale-95 transition-all"
              >
                Start Connection
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center mt-12 gap-x-12 gap-y-4">
              <div className="flex items-center gap-2 group">
                <div className="w-5 h-5 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <CheckCircle className="w-3 h-3 text-primary" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Zero Initial Cost</span>
              </div>
              <div className="flex items-center gap-2 group">
                <div className="w-5 h-5 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <CheckCircle className="w-3 h-3 text-primary" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Instant Sync</span>
              </div>
              <div className="flex items-center gap-2 group">
                <div className="w-5 h-5 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <CheckCircle className="w-3 h-3 text-primary" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">Global Node Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-foreground py-24 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-2 space-y-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20">
                  <Heart className="h-6 w-6 text-primary-foreground fill-current" />
                </div>
                <div>
                  <span className="font-black text-2xl tracking-tighter uppercase">DevMate</span>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Connecting Modern Developers</p>
                </div>
              </div>
              <p className="text-muted-foreground font-medium max-w-sm leading-relaxed opacity-60">
                The premier digital ecosystem for developers to cultivate professional relationships, share technical insights, and build the future together.
              </p>
              <div className="flex space-x-4">
                {[
                    { icon: Github, href: "https://github.com/agrim08" },
                    { icon: Linkedin, href: "https://www.linkedin.com/in/agrim-gupta08" },
                    { icon: Twitter, href: "https://x.com/AgrimGupta0805" }
                ].map((social, i) => (
                  <a key={i} href={social.href} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-muted border border-border/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-12 md:col-span-2">
                <div className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">Protocol</h4>
                <ul className="space-y-4 text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                    <li className="hover:text-primary transition-colors cursor-pointer">Features</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Security</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Network</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Nodes</li>
                </ul>
                </div>
                
                <div className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">Entity</h4>
                <ul className="space-y-4 text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                    <li className="hover:text-primary transition-colors cursor-pointer">About</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Registry</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Mission</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Status</li>
                </ul>
                </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">
                &copy; 2024 DevMate Network. All Transmission Secured.
            </p>
            <div className="flex items-center gap-2 group px-4 py-2 bg-muted/30 rounded-full border border-border/50">
               <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Built for nodes worldwide by</span>
               <div className="flex items-center gap-1.5 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                   <Heart className="w-3 h-3 text-primary fill-current" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-foreground">Agrim Gupta</span>
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing