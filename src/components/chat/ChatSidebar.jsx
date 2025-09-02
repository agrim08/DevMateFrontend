import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Search, X, MessageCircle } from "lucide-react";

const SidebarList = ({ filteredConnections, targetUserId }) => (
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
      ))
    )}
  </div>
);

const SearchBox = ({ searchTerm, setSearchTerm }) => (
  <div className="relative flex items-center">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
    <Input
      placeholder="Search conversations..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10"
    />
    {searchTerm && (
      <Button variant="ghost" className="absolute right-0" onClick={() => setSearchTerm("")}>
        <X className="cursor-pointer h-5 w-5" />
      </Button>
    )}
  </div>
);

const ChatSidebar = ({ searchTerm, setSearchTerm, filteredConnections, sidebarOpen, setSidebarOpen, targetUserId }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-80 bg-white border-r border-gray-200 flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          </div>
          <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <ScrollArea className="flex-1">
          <SidebarList filteredConnections={filteredConnections} targetUserId={targetUserId} />
        </ScrollArea>
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0 bg-white">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Messages</SheetTitle>
          </SheetHeader>
          <div className="p-4 border-b">
            <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
          <ScrollArea className="flex-1">
            <div onClick={() => setSidebarOpen(false)}>
              <SidebarList filteredConnections={filteredConnections} targetUserId={targetUserId} />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ChatSidebar;
