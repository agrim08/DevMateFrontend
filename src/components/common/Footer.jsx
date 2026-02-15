import { Code2, Github, Twitter, Linkedin } from "lucide-react"
import { Link } from "react-router-dom"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-6 py-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Brand */}
          <Link to="/app" className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            <span className="font-semibold tracking-tight">DevMate</span>
          </Link>

          {/* Center: Core Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/app" className="hover:text-foreground transition-colors">
              Feed
            </Link>
            <Link to="/app/connections" className="hover:text-foreground transition-colors">
              Network
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>

          {/* Right: Social */}
          <div className="flex items-center gap-4 text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          © {currentYear} DevMate
        </div>

      </div>
    </footer>
  )
}

export default Footer
