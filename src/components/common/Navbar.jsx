import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import axiosInstance from "../../api/axiosInstance"
import { removeUser } from "../../store/slices/userSlice"
import { 
  LogOut, 
  User, 
  Settings,
  Code2,
  Search,
  ChevronDown,
  Crown,
  Sparkles,
  Menu
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ThemeToggle } from "./ThemeToggle"

const Navbar = ({ setIsMobileMenuOpen }) => {
  const user = useSelector((store) => store.user.data)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/logout")
      dispatch(removeUser())
      navigate("/login")
    } catch (err) {
      console.error("Logout failed")
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search logic or navigate to search results
    console.log("Searching for:", searchQuery)
  }

  return (
    <nav className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container h-full mx-auto px-4 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="ghost" size="icon" className="md:hidden -ml-2 text-muted-foreground hover:text-foreground" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          {/* Brand */}
          <Link to="/app" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
              DevMate
            </span>
          </Link>
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-xl hidden md:block">
            <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                    type="text" 
                    placeholder="Search developers, skills, or projects..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 bg-muted/30 border border-border/50 rounded-full pl-10 pr-4 text-sm focus:bg-background focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            </form>
        </div>

        {/* Action Items */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {/* Premium CTA */}
          <Button asChild variant="ghost" className="hidden sm:flex items-center gap-2 rounded-xl text-primary hover:bg-primary/10 transition-colors">
            <Link to="/app/premium">
              <Crown className="w-4 h-4" />
              <span className="text-sm font-semibold">Go Premium</span>
            </Link>
          </Button>

          <div className="h-4 w-[1px] bg-border mx-1 hidden sm:block" />

          {/* User Profile Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 flex items-center gap-2 pl-1 pr-2 rounded-full border border-transparent hover:border-border hover:bg-muted/50 transition-all">
                  <Avatar className="h-8 w-8 border border-border/50">
                    <AvatarImage src={user.photoUrl} alt={user.firstName} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 mt-2 p-2 rounded-2xl border-border/50 shadow-2xl" align="end">
                <DropdownMenuLabel className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border">
                        <AvatarImage src={user.photoUrl} alt={user.firstName} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {user.firstName[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <p className="text-sm font-black leading-none">{user.firstName} {user.lastName}</p>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1 tracking-widest">{user.gender || 'Developer'}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <div className="p-1 space-y-1">
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                        <Link to="/app/profile" className="flex items-center gap-3 py-2">
                            <User className="w-4 h-4 text-muted-foreground" /> 
                            <span className="font-semibold">My Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                        <Link to="/app/premium" className="flex items-center gap-3 py-2 text-primary focus:text-primary">
                            <Crown className="w-4 h-4" /> 
                            <span className="font-semibold">Go Premium</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                        <Link to="/app/settings" className="flex items-center gap-3 py-2">
                            <Settings className="w-4 h-4 text-muted-foreground" /> 
                            <span className="font-semibold">Account Settings</span>
                        </Link>
                    </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="bg-border/50" />
                <div className="p-1">
                    <DropdownMenuItem onClick={handleLogout} className="rounded-xl cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center gap-3 py-2">
                        <LogOut className="w-4 h-4" /> 
                        <span className="font-semibold">Sign out</span>
                    </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
