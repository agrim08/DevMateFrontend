import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { 
  Globe, 
  MessageSquare, 
  Users, 
  Bell, 
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { Sheet, SheetContent } from "../ui/sheet"

const SidebarContent = ({ isCollapsed, navItems, isActive, isMobile }) => {
  return (
    <div className="flex-1 py-6 px-3 space-y-8 flex flex-col h-full overflow-y-auto overflow-x-hidden scrollbar-none">
       {/* Navigation Section */}
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group ${
                isActive(item.path) 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              {(!isCollapsed || isMobile) && (
                <span className="font-semibold text-sm tracking-tight whitespace-nowrap">{item.label}</span>
              )}
              
              {item.count > 0 && (
                <span className={`absolute ${isCollapsed && !isMobile ? "-top-1 -right-1" : "right-3 top-1/2 -translate-y-1/2"} min-w-[18px] h-[18px] px-1 bg-primary text-[10px] font-bold text-primary-foreground rounded-full flex items-center justify-center border-2 border-background`}>
                  {item.count}
                </span>
              )}

              {/* Tooltip for collapsed mode (only on desktop) */}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-popover text-popover-foreground text-xs font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 whitespace-nowrap border border-border/50 shadow-xl">
                    {item.label}
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Secondary Section */}
        <div className="pt-6 border-t border-border/50 space-y-1 mt-auto">
             <p className={`px-4 mb-2 text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider transition-all duration-300 ${isCollapsed && !isMobile ? 'opacity-0 invisible h-0' : 'opacity-100 visible'}`}>
                Account
            </p>
            <Link
              to="/app/profile"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-muted-foreground hover:bg-muted hover:text-foreground group relative`}
            >
              <User className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobile) && <span className="font-semibold text-sm tracking-tight">Profile</span>}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-popover text-popover-foreground text-xs font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 whitespace-nowrap border border-border/50 shadow-xl">
                    Profile
                </div>
              )}
            </Link>
             <Link
              to="/app/settings"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-muted-foreground hover:bg-muted hover:text-foreground group relative`}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobile) && <span className="font-semibold text-sm tracking-tight">Settings</span>}
              {isCollapsed && !isMobile && (
                 <div className="absolute left-full ml-4 px-3 py-1.5 bg-popover text-popover-foreground text-xs font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 whitespace-nowrap border border-border/50 shadow-xl">
                    Settings
                </div>
              )}
            </Link>
        </div>
    </div>
  )
}

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const user = useSelector((store) => store.user.data)
  const location = useLocation()
  const requests = useSelector((store) => store.request)
  const unreadCounts = useSelector((store) => store.chat.unreadCounts)
  const requestCount = requests?.length || 0
  const unreadMessageCount = Object.values(unreadCounts).reduce((a, b) => a + b, 0)

  const navItems = [
    { label: "Feed", icon: <Globe className="w-5 h-5" />, path: "/app" },
    { 
      label: "Messages", 
      icon: <MessageSquare className="w-5 h-5" />, 
      path: "/app/chat",
      count: unreadMessageCount
    },
    { label: "My Circle", icon: <Users className="w-5 h-5" />, path: "/app/connections" },
    { label: "Requests", icon: <Bell className="w-5 h-5" />, path: "/app/requests", count: requestCount },
  ]

  const isActive = (path) => location.pathname === path

  if (!user) return null

  return (
    <>
        {/* Desktop Sidebar */}
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? "80px" : "260px" }}
            className="fixed left-0 top-16 bottom-0 bg-card border-r border-border z-40 hidden md:flex flex-col transition-all duration-300"
        >
            <SidebarContent isCollapsed={isCollapsed} navItems={navItems} isActive={isActive} isMobile={false} />
            
             {/* Collapse Toggle */}
             <div className="p-4 border-t border-border/50 overflow-x-hidden">
                <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full h-10 rounded-xl hover:bg-muted"
                >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <ChevronLeft className="w-4 h-4" />
                        <span className="text-xs font-semibold">Collapse</span>
                    </div>
                )}
                </Button>
            </div>
        </motion.aside>

        {/* Mobile Sidebar */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetContent side="left" className="p-0 w-[280px] pt-4 custom-sheet-mobile">
               <SidebarContent isCollapsed={false} navItems={navItems} isActive={isActive} isMobile={true} />
            </SheetContent>
        </Sheet>
    </>
  )
}

export default Sidebar
