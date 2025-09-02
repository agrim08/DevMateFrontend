import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import MessageBubble from "./MessageBubble";

const ChatMessages = ({ messageGroups, userId, targetConnection, retryMessage, isTyping, messagesEndRef, formatTime }) => {
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {Object.entries(messageGroups).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="flex items-center justify-center my-4">
                <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">{date}</div>
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
            <div className="flex items-end space-x-2 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={targetConnection.photoUrl || "/placeholder.svg"} alt={targetConnection.firstName} />
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
  );
};

export default ChatMessages;
