import { X, Menu, Send, ArrowLeft, MoreVertical, Phone, Video, MessageCircle, Search } from "lucide-react"
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
import { addConnection } from "../utils/connectionSlice"
import { useDispatch } from "react-redux"

const Chat = () => {
  const { targetUserId } = useParams()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [socket, setSocket] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const connectionData = useSelector((store) => store.connection)
  const user = useSelector((store) => store.user)
  const userId = user?._id
  const navigate = useNavigate()

  const targetConnection = connectionData?.find((connection) => connection?._id === targetUserId)

  // Filter connections based on search term
  const filteredConnections =
    connectionData?.filter((connection) =>
      `${connection.firstName} ${connection.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchChat = async () => {
    if (!targetUserId) return
    try {
      const response = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      })
      const chatMessages = response?.data?.messages.map(msg => ({
        senderId: msg.senderId._id,
        firstName: msg.senderId.firstName,
        lastName: msg.senderId.lastName,
        content: msg.content,
        createdAt: msg.createdAt,
      }))
      setMessages(chatMessages || [])
    } catch (error) {
      console.error("Error fetching chat:", error.message)
    }
  }

  useEffect(() => {
    if (!userId) return;
    const newSocket = createSocketConnection();
    
    newSocket.on("connect", () => {
      console.log("⚡️ Socket.IO connected, id =", newSocket.id);
      if (targetUserId) {
        newSocket.emit("joinChat", {
          firstName: user.firstName,
          userId,
          targetUserId,
        });
        console.log("→ joinChat emitted");
      }
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [userId, targetUserId]);

  useEffect(() => {
    fetchChat()
  }, [targetUserId])

  useEffect(() => {
    if (!socket) return

    socket.on("messageReceived", (message) => {
      const newMessage = {
        senderId: message.senderId._id,
        firstName: message.senderId.firstName,
        lastName: message.senderId.lastName,
        content: message.content,
        createdAt: message.createdAt,
      }
      setMessages((prevMessages) => {
        if (prevMessages.some((msg) => msg.content === newMessage.content && msg.senderId === newMessage.senderId)) {
          return prevMessages
        }
        return [...prevMessages, newMessage]
      })
    })

    return () => socket.off("messageReceived")
  }, [socket])

  const dispatch = useDispatch()

  useEffect(() => {
    const handleConnections = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/connections`, {
          withCredentials: true,
        })
        dispatch(addConnection(res?.data?.data))
      } catch (error) {
        console.error("Error fetching connections:", error.response?.data)
      }
    }

    if (!connectionData || connectionData?.length === 0) {
      handleConnections()
    }
  }, [dispatch, connectionData])

  const sendMessage = (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || !targetUserId) return;

    const message = {
      firstName: user.firstName,
      userId,
      targetUserId,
      content: newMessage.trim(),
    };

    console.log("→ sending sendMessage:", message);
    socket.emit("sendMessage", message);

    setNewMessage("");
    inputRef.current?.focus();
  };

  const handleTyping = () => {
    if (socket && targetUserId) {
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

  if (!targetUserId) {
    return (
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        <div className="hidden md:flex md:w-80 bg-white border-r border-gray-200 flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/app/connections")}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
             {searchTerm &&  <Button variant="ghost" className="absolute right-0" onClick={() => setSearchTerm("")}>
                <X className="cursor-pointer h-5 w-5"/>
              </Button>}
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredConnections?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No conversations found</p>
                </div>
              ) : (
                filteredConnections.map((connection) => (
                  <Link
                    key={connection._id}
                    to={`/app/chat/${connection._id}`}
                    className="flex items-center p-3 rounded-lg transition-colors hover:bg-gray-50"
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
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Messages</SheetTitle>
            </SheetHeader>
            <div className="p-4 border-b ">
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Button variant="ghost" className="absolute right-0" onClick={() => setSearchTerm("")}>
                  <X className="cursor-pointer h-5 w-5"/>
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredConnections.map((connection) => (
                  <Link
                    key={connection._id}
                    to={`/app/chat/${connection._id}`}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center p-3 rounded-lg transition-colors hover:bg-gray-50"
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

        <div className="flex-1 flex flex-col bg-white min-h-0">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0 md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-gray-900">Messages</h1>
            <div></div>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-16 h-16 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">DevMate Chat</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Connect and chat with fellow developers from around the world. Share ideas, collaborate on projects, and
                build meaningful professional relationships.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Real-time messaging</p>
                <p>• Secure conversations</p>
                <p>• Professional networking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!targetConnection) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">User not found</h2>
            <p className="text-gray-600 mb-4">The user you're trying to chat with doesn't exist or isn't connected.</p>
            <Button asChild>
              <Link to="/app/chat">Back to Messages</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <div className="hidden md:flex md:w-80 bg-white border-r border-gray-200 flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/app/connections")}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConnections.map((connection) => (
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

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Messages</SheetTitle>
          </SheetHeader>
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredConnections.map((connection) => (
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

      <div className="flex-1 flex flex-col bg-white min-h-0">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:flex" onClick={() => navigate("/app/chat")}>
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

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {Object.entries(messageGroups).map(([date, dateMessages]) => (
                <div key={date}>
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">{date}</div>
                  </div>

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
                            className={`inline-block px-4 py-2 rounded-2xl shadow-sm ${
                              isOwnMessage
                                ? "bg-blue-600 text-white rounded-br-md"
                                : "bg-gray-100 text-gray-900 rounded-bl-md"
                            }`}
                            style={{ minWidth: `${Math.max(msg.firstName?.length, msg.content?.length) * 0.6 + 2}rem` }}
                          >
                            <p className={`text-xs mb-1 font-bold ${isOwnMessage ? "text-white/70" : "text-blue-600"}`}>
                              {isOwnMessage ? user.firstName : msg.firstName}
                            </p>
                            <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                          </div>
                          <span className="text-xs text-gray-500 mt-1 px-2">{formatTime(msg.createdAt)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}

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