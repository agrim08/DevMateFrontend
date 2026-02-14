import { Button } from "../ui/button";
import { MessageSquare, Zap, Terminal } from "lucide-react";

const EmptyChat = ({ onGoConnections, hasConnections }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background relative overflow-hidden">
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

        <div className="space-y-3">
          <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase">
            {hasConnections ? "System Ready." : "No active nodes."}
          </h2>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed">
            {hasConnections 
              ? "Select a neural link from the sidebar to begin encrypted communication."
              : <>Your communication encrypted channel is silent. <br /> Find developers to initialize a new link.</>
            }
          </p>
        </div>

        {!hasConnections && (
          <Button 
            onClick={onGoConnections}
            className="h-12 px-10 rounded-2xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all"
          >
            Discover Nodes
          </Button>
        )}
      </div>

      {/* Terminal Signature */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 opa