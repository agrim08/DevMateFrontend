import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AlertCircle, RotateCcw } from "lucide-react";

const MessageBubble = ({ msg, isOwnMessage, showAvatar, user, targetConnection, retryMessage, formatTime }) => {
  return (
    <div className={`flex items-end gap-3 mb-2 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
      {!isOwnMessage && (
        <div className="w-9 h-9 flex-shrink-0">
            {showAvatar && (
                <Avatar className="h-9 w-9 border border-primary/20 bg-muted shadow-sm">
                    <AvatarImage src={targetConnection.photoUrl} alt={targetConnection.firstName} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-black">
                        {targetConnection.firstName?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            )}
        </div>
      )}

      {isOwnMessage && <div className="w-9 h-9" />}

      <div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"} max-w-[85%] md:max-w-[75%]`}>
        <div
          className={`relative px-5 py-3.5 rounded-[1.5rem] shadow-sm transition-all duration-300 group ${
            isOwnMessage
              ? `bg-primary/90 backdrop-blur-md text-primary-foreground rounded-br-none shadow-lg shadow-primary/20 ${
                  msg.status === "failed" ? "opacity-50 ring-1 ring-destructive" : "border border-white/10"
                }`
              : "bg-card/50 backdrop-blur-xl border border-border/40 text-foreground rounded-bl-none shadow-sm hover:border-border/80"
          }`}
        >
          <p className="text-[0.9375rem] font-medium leading-relaxed break-words tracking-tight">{msg.content}</p>
          
          {msg.status === "sending" && (
            <div className="absolute -left-10 bottom-2 flex items-center">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          )}
          
          {msg.status === "failed" && (
            <div className="absolute -left-12 bottom-0 animate-in fade-in zoom-in duration-300">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive hover:bg-destructive/10 rounded-xl"
                    onClick={() => retryMessage && retryMessage(msg)}
                    title="Retry protocol transmission"
                >
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </div>
          )}
        </div>
        
        <div className={`flex items-center gap-3 mt-1.5 px-1 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
            <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300">
                {isOwnMessage ? "Primary Node" : (targetConnection.firstName || "Remote Node")}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground/30 tabular-nums tracking-tighter">
                {formatTime(msg.createdAt)}
            </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
