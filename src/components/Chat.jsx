"use client"

import { X, Menu, Send, ArrowLeft, MoreVertical, Phone, Video } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"
import { useParams, Link, useNavigate } from "react-router-dom"
import { createSocketConnection } from "../utils/socket"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ScrollArea } from "./ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"

const Chat = () => {
  const { targetUserId } = useParams()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [socket, setSocket] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const connectionData = useSelector((store) => store.connection)
  const user = useSelector((store) => store.user)
  const userId = user?._id
  const navigate = useNavigate()

  const targetConnection = connectionData?.find((connection) => connection?._id === targetUserId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchChat = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      })
      setMessages(response.data.messages || [])
    } catch (error) {
      console.error("Error fetching chat:", error.message)
    }
  }

  useEffect(() => {
    if (!userId) return

    const newSocket = createSocketConnection()
    setSocket(newSocket)

    newSocket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    })

    newSocket.on("messageReceived", (message) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    // newSocket.on("userTyping", ({ userId: typingUserId }) => {
    //   if (typingUserId !== userId) {
    //     setIsTyping(true)
    //     setTimeout(() => setIsTyping(false), 3000)
    //   }
    // })

    return () => {
      newSocket.disconnect()
    }
  }, [userId, targetUserId])

  useEffect(() => {
    fetchChat()
  }, [targetUserId])

  useEffect(() => {
    if (!socket) return

    socket.on("messageReceived", (message) => {
      setMessages((prevMessages) => {
        if (prevMessages.some((msg) => msg.content === message.content && msg.senderId === message.senderId)) {
          return prevMessages
        }
        return [...prevMessages, message]
      })
    })

    return () => socket.off("messageReceived")
  }, [socket])

  const sendMessage = (e) => {
    e?.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      firstName: user.firstName,
      userId,
      targetUserId,
      content: newMessage.trim(),
    }

    socket.emit("sendMessage", message)
    setNewMessage("")
    inputRef.current?.focus()
  }

  const handleTyping = () => {
    if (socket) {
      socket.emit("typing", { userId, targetUserId })
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  const groupMessagesByDate = (messages) => {
    const groups = {}
    messages.forEach((message) => {
      const date = formatDate(message.createdAt)
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    return groups
  }

  if (!targetConnection) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">User not found</h2>
            <p className="text-gray-600 mb-4">The user you're trying to chat with doesn't exist or isn't connected.</p>
            <Button asChild>
              <Link to="/app/connections">Back to Connections</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-80 bg-white border-r border-gray-200 flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/app/connections")}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {connectionData?.map((connection) => (
              <Link
                key={connection._id}
                to={`/app/chat/${connection._id}`}
                className={`flex items-center p-3 rounded-lg transition-colors hover:bg-gray-50 ${
                  connection._id === targetUserId ? "bg-blue-50 border border-blue-200" : ""
                }`}
              >
                <Avatar className="h-12 w-12 mr-3">
                  <AvatarImage src={connection.photoUrl || "/placeholder.svg"} alt={connection.firstName} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                    {connection.firstName?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {connection.firstName} {connection.lastName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">Click to start chatting</p>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Messages</SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {connectionData?.map((connection) => (
                <Link
                  key={connection._id}
                  to={`/app/chat/${connection._id}`}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center p-3 rounded-lg transition-colors hover:bg-gray-50 ${
                    connection._id === targetUserId ? "bg-blue-50 border border-blue-200" : ""
                  }`}
                >
                  <Avatar className="h-12 w-12 mr-3">
                    <AvatarImage src={connection.photoUrl || "/placeholder.svg"} alt={connection.firstName} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {connection.firstName?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {connection.firstName} {connection.lastName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">Click to start chatting</p>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white min-h-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:flex" onClick={() => navigate("/app/connections")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={targetConnection.photoUrl || "/placeholder.svg"} alt={targetConnection.firstName} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                {targetConnection.firstName?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">
                {targetConnection.firstName} {targetConnection.lastName}
              </h3>
              <p className="text-sm text-gray-500">{isTyping ? "Typing..." : "Online"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {Object.entries(messageGroups).map(([date, dateMessages]) => (
                <div key={date}>
                  {/* Date Separator */}
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">{date}</div>
                  </div>

                  {/* Messages for this date */}
                  {dateMessages.map((msg, index) => {
                    const isOwnMessage = msg.senderId === userId
                    const showAvatar =
                      !isOwnMessage && (index === 0 || dateMessages[index - 1]?.senderId !== msg.senderId)

                    return (
                      <div
                        key={index}
                        className={`flex items-end space-x-2 mb-3 ${isOwnMessage ? "justify-end" : "justify-start"}`}
                      >
                        {!isOwnMessage && (
                          <Avatar className={`h-8 w-8 ${showAvatar ? "opacity-100" : "opacity-0"}`}>
                            <AvatarImage
                              src={targetConnection.photoUrl || "/placeholder.svg"}
                              alt={targetConnection.firstName}
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-semibold">
                              {targetConnection.firstName?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"} max-w-xs lg:max-w-md`}
                        >
                          <div
                            className={`px-4 py-2 rounded-2xl shadow-sm ${
                              isOwnMessage
                                ? "bg-blue-600 text-white rounded-br-md"
                                : "bg-gray-100 text-gray-900 rounded-bl-md"
                            }`}
                          >
                            <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                          </div>
                          <span className="text-xs text-gray-500 mt-1 px-2">{formatTime(msg.createdAt)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-end space-x-2 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={targetConnection.photoUrl || "/placeholder.svg"}
                      alt={targetConnection.firstName}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-semibold">
                      {targetConnection.firstName?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Message Input - Fixed at bottom */}
        <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
          <form onSubmit={sendMessage} className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value)
                  handleTyping()
                }}
                placeholder="Type your message..."
                className="pr-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-full"
                maxLength={1000}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!newMessage.trim()}
                className="absolute right-1 top-1 h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat
