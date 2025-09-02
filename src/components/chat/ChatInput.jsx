import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Send } from "lucide-react";

const ChatInput = ({ newMessage, setNewMessage, sendMessage, handleTyping, inputRef, connectionStatus }) => {
  return (
    <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
      <form onSubmit={sendMessage} className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type your message..."
            className="pr-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-full"
            maxLength={1000}
            disabled={connectionStatus !== "connected"}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!newMessage.trim() || connectionStatus !== "connected"}
            className="absolute right-1 top-1 h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
