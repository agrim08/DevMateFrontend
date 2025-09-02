import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const MessageBubble = ({ msg, isOwnMessage, showAvatar, user, targetConnection, retryMessage, formatTime }) => {
  return (
    <div className={`flex items-end space-x-2 mb-3 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      {!isOwnMessage && (
        <Avatar className={`h-8 w-8 ${showAvatar ? "opacity-100" : "opacity-0"}`}>
          <AvatarImage src={targetConnection.photoUrl || "/placeholder.svg"} alt={targetConnection.firstName} />
          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-semibold">
            {targetConnection.firstName?.charAt(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"} max-w-xs lg:max-w-md`}>
        <div
          className={`inline-block px-4 py-2 rounded-2xl shadow-sm ${
            isOwnMessage
              ? `bg-blue-600 text-white rounded-br-md ${msg.status === "failed" ? "opacity-50" : ""}`
              : "bg-gray-100 text-gray-900 rounded-bl-md"
          }`}
        >
          <p className={`text-xs mb-1 font-bold ${isOwnMessage ? "text-white/70" : "text-blue-600"}`}>
            {isOwnMessage ? user.firstName : msg.firstName}
          </p>
          <p className="text-sm leading-relaxed break-words">{msg.content}</p>
          {msg.status === "sending" && (
            <p className="text-xs text-gray-300">Sending...</p>
          )}
          {msg.status === "failed" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 text-xs mt-1"
              onClick={() => retryMessage(msg)}
            >
              Retry
            </Button>
          )}
        </div>
        <span className="text-xs text-gray-500 mt-1 px-2">{formatTime(msg.createdAt)}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
