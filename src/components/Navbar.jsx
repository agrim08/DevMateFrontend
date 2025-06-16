"use client"

import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BASE_URL } from "../utils/constants"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { removeUser } from "../utils/userSlice"
import { addRequest } from "../utils/requestSlice"
import { Menu, User, LogOut, Heart, MessageCircle, Users, Clock, Crown, Globe } from "lucide-react"

import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"
import { Badge } from "./ui/badge"

const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false)

  const user = useSelector((store) => store.user)
  const requests = useSelector((store) => store.request)
  const requestCount = requests?.length || 0

  // Fetch pending requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/pending`, {
        withCredentials: true,
      })
      dispatch(addRequest(res?.data?.data || []))
    } catch (error) {
      console.error("Error fetching requests:", error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchRequests()
    }
  }, [user])

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const handleLogout = async () => {
    try {
      const logoutUser = await axios.post(
        `${BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
        },
      )

      dispatch(removeUser())

      if (logoutUser.status === 200) {
        navigate("/login")
      }
    } catch (error) {
      console.log(error.message)
      return
    } finally {
      setShowLogoutConfirm(false)
    }
  }

  const headerMenuItems = [
    { label: "Feed", icon: <Globe className="w-4 h-4" />, path: "/app" },
    { label: "Chat", icon: <MessageCircle className="w-4 h-4" />, path: "/app/chat" },
    { label: "Connections", icon: <Users className="w-4 h-4" />, path: "/app/connections" },
    {
      label: "Requests",
      icon: <Clock className="w-4 h-4" />,
      path: "/app/requests",
      badge: requestCount > 0 ? requestCount : null,
    },
    {
      label: "Premium",
      icon: <Crown className="w-4 h-4" />,
      path: "/app/premium",
      isPremium: true,
    },
  ]

  if (!user) {
    return null
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link
                to="/landing"
                className="flex items-center space-x-3 text-gray-900 hover:text-blue-600 transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <span className="font-bold text-xl tracking-tight">DevMate</span>
                  <p className="text-xs text-gray-500 -mt-1">Connect & Grow</p>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">

              {/* Header Menu Items */}
              <div className="flex items-center space-x-4">
                {headerMenuItems.map((item) => (
                  <div key={item.path} className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className={`text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors ${
                        item.isPremium
                          ? "bg-amber-400 text-white hover:bg-amber-500 hover:text-white shadow-lg"
                          : ""
                      }`}
                    >
                      <Link to={item.path} className="flex items-center space-x-2">
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </Button>
                    {item.badge && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs font-bold rounded-full">
                        {item.badge > 99 ? "99+" : item.badge}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-blue-100 transition-all duration-200"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.photoUrl || "/placeholder.svg"} alt={user?.firstName} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                        {user?.firstName?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <div className="flex items-center justify-start gap-3 p-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user?.photoUrl || "/placeholder.svg"} alt={user?.firstName} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                        {user?.firstName?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="font-semibold text-sm text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.emailId}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/app/profile"
                      className="flex items-center space-x-3 cursor-pointer py-2.5 px-3 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span className="font-medium">Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 cursor-pointer py-2.5 px-3 hover:bg-red-50 transition-colors"
                    onClick={handleLogoutClick}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-medium">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden ">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="text-left flex items-center space-x-3">
                      <Link to={"/app"}>
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Heart className="h-4 w-4 text-white" />
                        </div>
                        <span>DevMate</span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 space-y-6">
                    {/* User Info */}
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={user?.photoUrl || "/placeholder.svg"} alt={user?.firstName} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-lg">
                          {user?.firstName?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="font-semibold text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-[180px]">{user?.emailId}</p>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-2 bg-white text-black">
                      {headerMenuItems.map((item) => (
                        <div key={item.path} className="relative">
                          <Button
                            variant="ghost"
                            className={`w-full justify-start h-12 text-left transition-colors ${
                              item.isPremium
                                ? "bg-amber-400 text-white hover:bg-amber-500 hover:text-white shadow-lg"
                                : ""
                            }`}
                            asChild
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Link to={item.path} className="flex items-center space-x-3">
                              {item.icon}
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          </Button>
                          {item.badge && (
                            <Badge className="absolute top-2 right-4 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs font-bold rounded-full">
                              {item.badge > 99 ? "99+" : item.badge}
                            </Badge>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-12 text-left hover:bg-gray-50 transition-colors"
                        asChild
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Link to="/app/profile" className="flex items-center space-x-3">
                          <User className="w-4 h-4" />
                          <span className="font-medium">Profile</span>
                        </Link>
                      </Button>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-4 border-t">
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-12 text-red-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => {
                          setIsMenuOpen(false)
                          handleLogoutClick()
                        }}
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span className="font-medium">Sign Out</span>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog with Backdrop Blur */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="sm:max-w-md backdrop-blur-sm bg-white text-black">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">Sign Out</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to sign out? You'll need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-gray-50 text-gray-900 hover:bg-gray-100">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Backdrop Blur Overlay for Logout Dialog */}
      {showLogoutConfirm && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />}
    </>
  )
}

export default Navbar
