import { useEffect, useState } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import Footer from "./Footer"
import { useDispatch, useSelector } from "react-redux"

const Body = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: user } = useSelector((store) => store.user)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (
      user &&
      !user.isProfileComplete &&
      location.pathname !== "/app/complete-profile" &&
      location.pathname !== "/login" &&
      location.pathname !== "/"
    ) {
      navigate("/app/complete-profile")
    }
  }, [user, navigate, location.pathname])

  const showSidebar = user && location.pathname !== "/app/complete-profile" && location.pathname !== "/login" && location.pathname !== "/"

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 transition-colors duration-300">
      <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      <div className="flex flex-1 relative">
        {showSidebar && (
          <Sidebar 
            isCollapsed={isSidebarCollapsed} 
            setIsCollapsed={setIsSidebarCollapsed} 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        )}
        
        <main className={`flex-1 w-full transition-all duration-300 ${
          showSidebar 
            ? isSidebarCollapsed 
              ? "md:pl-[80px]" 
              : "md:pl-[260px]" 
            : ""
        }`}>
          <div className="min-h-[calc(100vh-64px-100px)]">
             <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default Body