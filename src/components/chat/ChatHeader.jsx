import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronLeft, Menu, Phone, Video, MoreVertical, ShieldCheck, Github } from "lucide-react";

const ChatHeader = ({ targetConnection, navigate, setSidebarOpen }) => {
  return (
    <div className="h-16 md:h-20 flex items-center justify-between px-4 md:px-6 border-b border-border/40 bg-background/60 backdrop-blur-xl flex-shrink-0 z-10 shadow-sm">
      <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
        {/* Mobile menu toggle */}
        <Button variant="ghost" size="icon" className="md:hidden rounded-lg bg-muted/20 flex-shrink-0" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-4 w-4" />
        </Button>

        {/* Back button desktop */}
        <Button variant="ghost" size="sm" className="hidden md:flex rounded-xl font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-all" onClick={() => navigate("/app/chat")}>
          <ChevronLeft className="h-3.5 w-3.5 mr-1.5" />
          Synchronize
        </Button>

        <div className="h-8 w-[1px] bg-border/40 mx-2 hidden md:block" />

        <div className="flex items-center gap-3.5">
            <div className="relative group cursor-pointer">
                <Avatar className="h-10 w-10 border-2 border-primary/20 bg-muted shadow-lg group-hover:border-primary/50 transition-all duration-300">
                    <AvatarImage src={targetConnection.photoUrl} alt={targetConnection.firstName} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary font-black">
                        {targetConnection.firstName?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-background shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            </div>
            <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className="font-black text-foreground text-sm md:text-base tracking-tight leading-none group cursor-pointer hover:text-primary transition-colors truncate">
                        {targetConnection.firstName} {targetConnection.lastName}
                    </h3>
                    <div className="px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                        <ShieldCheck className="w-3 h-3 text-primary" />
                    </div>
                </div>
                <p className="text-[9px] font-black text-green-500/80 uppercase tracking-[0.15em] mt-1.5 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
                    Link Secure / Online
                </p>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-muted-foreground/50 hover:text-primary hover:bg-primary/5"><Phone className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-muted-foreground/50 hover:text-primary hover:bg-primary/5"><Video className="h-4 w-4" /></Button>
        </div>
        <div className="h-8 w-[1px] bg-border/40 mx-1 hidden sm:block" />
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-muted-foreground/50 hover:text-primary hover:bg-primary/5 transition-all"><MoreVertical className="h-4 w-4" /></Button>
      </div>
    </div>
  );
};

export default ChatHeader;
