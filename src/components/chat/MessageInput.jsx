import { Send, Paperclip, Smile } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const MessageInput = ({ 
  newMessage, 
  setNewMessage, 
  onSendMessage, 
  onTyping, 
  connectionStatus, 
  inputRef 
}) => {
  return (
    <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
      <form onSubmit={onSendMessage} className="flex items-center space-x-3">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="flex-shrink-0 hover:bg-gray-100"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              onTyping();
            }}
            placeholder="Type your message..."
            className="pr-20 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-full"
            maxLength={1000}
            disabled={connectionStatus !== "connected"}
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <Smile className="h-4 w-4" />
            </Button>
            
            <Button
              type="submit"
              size="sm"
              disabled={!newMessage.trim() || connectionStatus !== "connected"}
              className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </form>
      
      {connectionStatus !== "connected" && (
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-500">
            {connectionStatus === "connecting" ? "Connecting..." : "Disconnected - messages will be sent when reconnected"}
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageInput;