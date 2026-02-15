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
    <div className="p-4 border-t border-border/40 bg-card/60 backdrop-blur-xl flex-shrink-0">
      <form onSubmit={onSendMessage} className="flex items-center space-x-3">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          className="flex-shrink-0 hover:bg-muted/40 rounded-xl h-10 w-10"
        >
          <Paperclip className="h-4 w-4 text-muted-foreground" />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              onTyping();
            }}
            placeholder="Secure terminal transmission..."
            className="pr-12 h-12 bg-muted/20 border-border/50 rounded-2xl focus:ring-primary/20 text-sm font-medium placeholder:text-muted-foreground/30"
            maxLength={1000}
            disabled={connectionStatus !== "connected"}
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Button
              type="submit"
              size="icon"
              disabled={!newMessage.trim() || connectionStatus !== "connected"}
              className="h-9 w-9 rounded-xl bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
      
      {connectionStatus !== "connected" && (
        <div className="mt-2 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
            {connectionStatus === "connecting" ? "Establishing Secure Link..." : "Node Disconnected"}
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageInput;