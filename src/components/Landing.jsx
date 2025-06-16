"use client"

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
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"

const Landing = () => {
  const navigate = useNavigate()
  const user = useSelector((store) => store.user)
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
      navigate("/")
    } else {
      navigate("/login")
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-gray-900">DevMate</span>
                <p className="text-xs text-gray-500 -mt-1">Connect & Grow</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/login")}>
                    Sign In
                  </Button>
                  <Button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="container mx-auto text-center">
          <div 
            id="hero"
            data-animate
            className={`transition-all duration-1000 ${
              isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">
              <Star className="w-4 h-4 mr-1" />
              Join 10,000+ Developers Worldwide
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Connect with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Amazing{" "}
              </span>
              Developers
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              DevMate is the premier platform for developers to connect, collaborate, and grow together. 
              Build meaningful relationships with fellow developers from around the globe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-300 hover:bg-gray-50 text-lg px-8 py-6"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-green-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div 
            id="stats"
            data-animate
            className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 delay-200 ${
              isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div 
            id="features-header"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 delay-300 ${
              isVisible['features-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to
              <span className="text-blue-600"> Network</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help developers connect, collaborate, and build amazing things together.
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
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div 
            id="testimonials-header"
            data-animate
            className={`text-center mb-16 transition-all duration-1000 delay-200 ${
              isVisible['testimonials-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl font-bold mb-4">What Developers Say</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of developers who have transformed their careers with DevMate.
            </p>
          </div>

          <div 
            id="testimonials-grid"
            data-animate
            className={`grid md:grid-cols-3 gap-8 transition-all duration-1000 delay-400 ${
              isVisible['testimonials-grid'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-blue-100 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-blue-50 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <div 
            id="cta"
            data-animate
            className={`transition-all duration-1000 delay-200 ${
              isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Connect with Amazing Developers?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join DevMate today and start building meaningful connections that will accelerate your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6"
              >
                <Heart className="mr-2 h-5 w-5" />
                Start Connecting Now
              </Button>
            </div>
            <div className="flex items-center justify-center mt-6 space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                Free to join
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                Join in 30 seconds
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-xl">DevMate</span>
                  <p className="text-xs text-gray-400 -mt-1">Connect & Grow</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                The premier platform for developers to connect, collaborate, and grow together. 
                Building the future of developer networking.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Premium</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DevMate. Made with <Heart className="inline w-4 h-4 text-red-500 mx-1" /> for developers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing