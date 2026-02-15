import { useEffect, useState } from "react"
import Navbar from "../common/Navbar"
import Sidebar from "../common/Sidebar"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import Footer from "../common/Footer"
import { useDispatch, useSelector } from "react-redux"
import axiosInstance from "../../api/axiosInstance"
import { addRequest } from "../../store/slices/requestSlice"
import { getSocket, disconnectSocket } from "../../features/chat/socket"
import { incrementUnread, setOnlineUsers, updateUserStatus } from "../../store/slices/chatSlice"

const AppLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { data: user } = useSelector((store) => store.user)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // ===== Global Data Fetching =====
  const fetchPendingRequests = async () => {
    if (!user) return
    try {
      const res = await axiosInstance.get("/user/requests/pending")
      dispatch(addRequest(res?.data?.data))
    } catch (error) {
      console.error("Failed to load requests:", error.message)
    }
  }

  // ===== Socket Real-time Core =====
  useEffect(() => {
    if (!user?._id) return

    const socket = getSocket(user._id)

    socket.on("connect", () => {
      console.log("Connected to secure neural link")
      socket.emit("getOnlineUsers")
    })

    socket.on("requestCountUpdate", () => {
      fetchPendingRequests()
    })

    socket.on("globalMessageReceived", (message) => {
      dispatch(incrementUnread(message.senderId))
    })

    socket.on("userStatusUpdate", (data) => {
      dispatch(updateUserStatus(data))
    })

    socket.on("onlineUsersList", (users) => {
      dispatch(setOnlineUsers(users))
    })

    // Initial load
    fetchPendingRequests()

    return () => {
      disconnectSocket()
    }
  }, [user?._id])

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

export default AppLayout