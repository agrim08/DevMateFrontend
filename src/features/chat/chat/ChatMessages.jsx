import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageBubble from "./MessageBubble";

const ChatMessages = ({ messageGroups, userId, targetConnection, retryMessage, isTyping, messagesEndRef, formatTime }) => {
  return (
    <div className="flex-1 overflow-hidden bg-background/20">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-5xl mx-auto w-full">
          {Object.entries(messageGroups).map(([date, dateMessages]) => (
            <div key={date} className="space-y-6">
              <div className="flex items-center justify-center gap-4 py-2 md:py-4">
                <div className="h-[1px] flex-1 bg-border/20" />
                <div className="text-[9px] md:text-[10px] uppercase font-black tracking-widest md:tracking-[0.2em] text-muted-foreground/60 whitespace-nowrap">{date}</div>
                <div className="h-[1px] flex-1 bg-border/20" />
              </div>

              {dateMessages.map((msg, index) => {
                const isOwnMessage = msg.senderId === userId;
                const showAvatar =
                  !isOwnMessage && (index === 0 || dateMessages[index - 1]?.senderId !== msg.senderId);

                return (
                  <MessageBubble
                    key={index}
                    msg={msg}
                    isOwnMessage={isOwnMessage}
                    showAvatar={showAvatar}
                    user={{ _id: userId }}
                    targetConnection={targetConnection}
                    retryMessage={retryMessage}
                    formatTime={formatTime}
                  />
                );
              })}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-end gap-3 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Avatar className="h-9 w-9 border border-primary/20 bg-muted">
                <AvatarImage src={targetConnection.photoUrl} alt={targetConnection.firstName} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-black">
                  {targetConnection.firstName?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="bg-card border border-border/50 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatMessages;
