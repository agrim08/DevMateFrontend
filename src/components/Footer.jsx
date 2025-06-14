import { Heart, Github, Twitter, Linkedin } from "lucide-react"
import { Button } from "./ui/button"

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900">DevMate</span>
              <p className="text-xs text-gray-500 -mt-1">Connect & Grow</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © 2024 DevMate. Made with <Heart className="inline w-4 h-4 text-red-500 mx-1" />
              for developers
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-gray-100">
              <Github className="h-4 w-4 text-gray-600" />
              <span className="sr-only">GitHub</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-gray-100">
              <Twitter className="h-4 w-4 text-gray-600" />
              <span className="sr-only">Twitter</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-gray-100">
              <Linkedin className="h-4 w-4 text-gray-600" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
