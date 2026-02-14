import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Send, Plus, Smile, Hash, Cpu } from "lucide-react";

const ChatInput = ({ newMessage, setNewMessage, sendMessage, handleTyping, inputRef, connectionStatus }) => {
  return (
    <div className="p-3 md:p-6 bg-background/40 backdrop-blur-xl border-t border-border/40 flex-shrink-0 z-10 pb-safe">
      <form onSubmit={sendMessage} className="flex items-center gap-2 md:gap-4 max-w-5xl mx-auto w-full group/form">
        <div className="gap-1.5 p-1 bg-muted/20 border border-border/20 rounded-xl hidden sm:flex">
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground/50 hover:text-primary hover:bg-primary/5 transition-all">
                <Plus className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-muted-foreground/50 hover:text-primary hover:bg-primary/5 transition-all hidden sm:flex">
                <Smile className="w-4 h-4" />
            </Button>
        </div>
        
        {/* Mobile-only plus button outside container */}
        <Button type="button" variant="ghost" size="icon" className="h-10 w-10 sm:hidden rounded-xl text-muted-foreground/50 hover:text-primary hover:bg-primary/5 transition-all flex-shrink-0">
            <Plus className="w-5 h-5" />
        </Button>
        
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
             <Hash className="w-3.5 h-3.5 text-primary/40 group-focus-within/form:text-primary/60 transition-colors" />
          </div>
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder={connectionStatus === "connected" ? "Execute message command..." : "Synchronizing..."}
            className="h-12 md:h-14 pl-10 pr-14 md:pr-20 rounded-2xl bg-muted/10 border-border/30 focus:bg-background focus:ring-1 focus:ring-primary/20 transition-all font-mono text-[16px] md:text-[0.9375rem] placeholder:text-muted-foreground/20 shadow-inner group-focus-within/form:border-primary/30"
            maxLength={1000}
            disabled={connectionStatus !== "connected"}
          />
          <div className="absolute right-2 top-1.5 flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5 px-3 h-11 border-l border-border/30 text-[10px] font-black uppercase tracking-widest text-muted-foreground/20">
                <Cpu className="w-3 h-3" />
                <span>Secure</span>
            </div>
            <Button
                type="submit"
                size="icon"
                disabled={!newMessage.trim() || connectionStatus !== "connected"}
                className={`h-11 w-11 rounded-xl shadow-lg transition-all active:scale-95 ${
                    newMessage.trim() && connectionStatus === "connected"
                    ? "bg-primary text-primary-foreground shadow-primary/30 ring-1 ring-white/20"
                    : "bg-muted text-muted-foreground opacity-30 cursor-not-allowed"
                }`}
            >
                <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
