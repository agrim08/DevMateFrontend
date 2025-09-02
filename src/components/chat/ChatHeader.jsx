import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ArrowLeft, Menu, Phone, Video, MoreVertical } from "lucide-react";

const ChatHeader = ({ targetConnection, navigate, setSidebarOpen }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
      <div className="flex items-center space-x-3">
        {/* Mobile menu toggle */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>

        {/* Back button desktop */}
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
        <Button variant="ghost" size="sm"><Phone className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm"><Video className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button>
      </div>
    </div>
  );
};

export default ChatHeader;
