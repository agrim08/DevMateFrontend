import { Button } from "../ui/button";
import { MessageSquare, Zap, Terminal } from "lucide-react";

const EmptyChat = ({ onGoConnections, hasConnections }) => {
  return (
    <div className="flex-3 flex flex-col items-center justify-center p-8 bg-background relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 text-center space-y-8 max-w-sm">
        {/* Minimal Icon Stage */}
        <div className="flex justify-center">
            <div className="relative">
                <div className="w-20 h-20 bg-card border border-border/50 rounded-3xl flex items-center justify-center shadow-2xl skew-x-1 -rotate-2">
                    <MessageSquare className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute -bottom-2 -right-2 p-1.5 bg-primary text-primary-foreground rounded-lg shadow-xl">
                    <Zap className="w-3 h-3 fill-current" />
                </div>
            </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            {hasConnections ? "Select a Conversation" : "No Active Connections"}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
            {hasConnections 
              ? "Choose a developer from your network sidebar to start collaborating."
              : "Your network is empty. Connect with other developers to start chatting."
            }
          </p>
        </div>

        {!hasConnections && (
          <Button 
            onClick={onGoConnections}
            className="h-11 px-8 rounded-xl bg-primary font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-primary/25 transition-all"
          >
            Find Developers
          </Button>
        )}
      </div>

      {/* Terminal Signature */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-20 pointer-events-none">
          <Terminal className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">System.Idle</span>
      </div>
    </div>
  );
};

export default EmptyChat;
