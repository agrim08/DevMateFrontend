import { Button } from "../ui/button";
import { MessageCircle, X, Search } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

const EmptyChat = ({ onGoConnections }) => {
  return (
    <div className="flex-1 flex flex-col bg-white min-h-0">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0 md:hidden">
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
          <Button className="mt-6" onClick={onGoConnections}>
            View Connections
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyChat;
