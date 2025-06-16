import { Heart, Github, Twitter, Linkedin } from "lucide-react"
import { Button } from "./ui/button"

const Footer = () => {
  return (
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
        
  )
}

export default Footer
