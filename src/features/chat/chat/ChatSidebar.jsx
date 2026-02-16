import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Search, X, MessageSquare, Terminal, Activity, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const SidebarList = ({ filteredConnections, targetUserId, setSidebarOpen }) => {
  const navigate = useNavigate();
  const onlineUsers = useSelector((store) => store.chat.onlineUsers);
  const unreadCounts = useSelector((store) => store.chat.unreadCounts);
  const lastMessageTimestamps = useSelector((store) => store.chat.lastMessageTimestamps);
  
  const sortedConnections = [...filteredConnections].sort((a, b) => {
    const timeA = lastMessageTimestamps[a._id] ? new Date(lastMessageTimestamps[a._id]).getTime() : 0;
    const timeB = lastMessageTimestamps[b._id] ? new Date(lastMessageTimestamps[b._id]).getTime() : 0;
    return timeB - timeA;
  });
  
  return (
    <div className="space-y-2 py-2">
      {sortedConnections?.length === 0 ? (
        <div className="text-center py-20 px-4 space-y-4">
          <div className="w-16 h-16 bg-muted/20 rounded-2xl flex items-center justify-center mx-auto border border-border/10">
              <MessageSquare className="h-8 w-8 text-muted-foreground/30" />
          </div>
          <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">No Nodes Detected</p>
        </div>
      ) : (
        sortedConnections.map((connection, idx) => {
          const isOnline = onlineUsers.includes(connection._id);
          const unreadCount = unreadCounts[connection._id] || 0;
          
          return (
            <motion.div
              key={connection._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <button
                onClick={() => {
                  navigate(`/app/chat/${connection._id}`);
                  setSidebarOpen && setSidebarOpen(false);
                }}
                className={`w-full group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                  connection._id === targetUserId 
                    ? "bg-primary/10 border border-primary/20 shadow-sm shadow-primary/5" 
                    : "hover:bg-muted/40 border border-transparent"
                }`}
              >
                {connection._id === targetUserId && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                  />
                )}
                
                <div className="relative">
                  <Avatar className={`h-12 w-12 border-2 transition-all duration-300 ${
                    connection._id === targetUserId ? "border-primary/40 shadow-sm" : "border-border/40 group-hover:border-border/80"
                  }`}>
                    <AvatarImage src={connection.photoUrl} alt={connection.firstName} className="object-cover" />
                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-black">
                      {connection.firstName?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 bg-background rounded-full flex items-center justify-center border border-border/10">
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isOnline ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]" : "bg-muted-foreground/30"}`}></div>
                  </div>
                </div>

                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`font-bold text-[0.9375rem] truncate tracking-tight transition-colors ${
                      connection._id === targetUserId ? "text-primary" : "text-foreground group-hover:text-primary"
                    }`}>
                      {connection.firstName} {connection.lastName}
                    </span>
                    {unreadCount > 0 && (
                      <Badge className="h-5 min-w-[20px] px-1.5 flex items-center justify-center bg-primary text-primary-foreground font-black text-[10px] rounded-full border-2 border-background">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                      <p className={`text-[10px] uppercase font-bold tracking-widest truncate ${
                          connection._id === targetUserId ? 'text-primary/70' : 'text-muted-foreground/50'
                      }`}>
                          {connection.gender || 'Developer'}
                      </p>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })
      )}
    </div>
  );
};

const SearchBox = ({ searchTerm, setSearchTerm }) => (
  <div className="relative group">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 w-4 h-4 group-focus-within:text-primary transition-all duration-300" />
    <Input
      placeholder="Search Secure Link..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="h-11 pl-11 pr-10 rounded-xl bg-muted/20 border-border/40 hover:border-border/60 focus:bg-background focus:ring-1 focus:ring-primary/20 transition-all font-medium placeholder:text-muted-foreground/30 text-sm shadow-inner"
    />
    <AnimatePresence>
      {searchTerm && (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute right-1 top-1/2 -translate-y-1/2"
        >
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-transparent text-muted-foreground/50 hover:text-foreground" 
                onClick={() => setSearchTerm("")}
            >
                <X className="h-4 w-4" />
            </Button>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const ChatSidebar = ({ searchTerm, setSearchTerm, filteredConnections, sidebarOpen, setSidebarOpen, targetUserId, isMobileFullScreen }) => {
  return (
    <>
      {/* Desktop Sidebar (or Mobile Full Screen) */}
      <div className={`${isMobileFullScreen ? "flex w-full h-full" : "hidden md:flex md:w-80"} bg-background border-r border-border/50 flex-col relative z-20`}>
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Activity className="w-4 h-4 text-primary" />
                </div>
                <div>
                    <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-foreground">Protocols</h2>
                    <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest hidden md:block">v2.4.0 Secure</p>
                </div>
            </div>
            <ShieldCheck className="w-4 h-4 text-green-500/50" />
          </div>
          <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        
        <ScrollArea className="flex-1 px-3">
          <SidebarList 
            filteredConnections={filteredConnections} 
            targetUserId={targetUserId} 
            setSidebarOpen={setSidebarOpen}
          />
        </ScrollArea>

        <div className="p-4 border-t border-border/40 bg-muted/10 flex-shrink-0">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/40">
            </div>
        </div>
      </div>

      {/* Mobile Sidebar Sheet (Only when NOT in full screen mode) */}
      {!isMobileFullScreen && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="w-[85vw] sm:w-80 p-0 bg-background border-r border-border">
            <SheetHeader className="p-6 border-b border-border/40">
                <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-primary" />
                    <SheetTitle className="text-sm font-black uppercase tracking-[0.2em] pt-0.5">Communications</SheetTitle>
                </div>
            </SheetHeader>
            <div className="p-6">
                <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
            <ScrollArea className="flex-1 px-4">
                <SidebarList 
                filteredConnections={filteredConnections} 
                targetUserId={targetUserId} 
                setSidebarOpen={setSidebarOpen}
                />
            </ScrollArea>
            </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default ChatSidebar;
