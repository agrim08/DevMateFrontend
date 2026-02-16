import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const ContributionGraph = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Process data to fill the grid (7 columns for days, N rows for weeks essentially, but reversed in UI terms)
  // Calendar usually goes Top->Bottom (Sun->Sat) and Left->Right (Weeks).
  // CSS Grid with grid-rows-7 grid-flow-col does exactly this.
  
  // We need to ensure we have enough data or pad it, but rendering what we have is fine.
  // Data is expected to be flattened array of { date, count }.
  
  // Color mapping based on GitHub's approximate levels
  const getColor = (count) => {
    if (count === 0) return "bg-zinc-100 dark:bg-zinc-800/50";
    if (count <= 3) return "bg-emerald-200 dark:bg-emerald-900/60";
    if (count <= 6) return "bg-emerald-300 dark:bg-emerald-800/80";
    if (count <= 10) return "bg-emerald-400 dark:bg-emerald-600";
    return "bg-emerald-500 dark:bg-emerald-500";
  };

  const totalContributions = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.count, 0);
  }, [data]);

  return (
    <div className="mt-6 p-6 border border-zinc-800/40 rounded-xl bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">
            {totalContributions} contributions in the last year
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Less</span>
            <div className={`w-2.5 h-2.5 rounded-sm ${getColor(0)}`} />
            <div className={`w-2.5 h-2.5 rounded-sm ${getColor(2)}`} />
            <div className={`w-2.5 h-2.5 rounded-sm ${getColor(5)}`} />
            <div className={`w-2.5 h-2.5 rounded-sm ${getColor(8)}`} />
            <div className={`w-2.5 h-2.5 rounded-sm ${getColor(12)}`} />
            <span>More</span>
        </div>
      </div>
      
      <div className="overflow-x-auto pb-2">
        <div 
            className="grid grid-rows-7 grid-flow-col gap-1 w-max" 
            style={{ 
                // Approx width for 52 weeks * (10px box + 4px gap) 
                minWidth: "max-content" 
            }}
        >
          {data.map((day, i) => (
            <TooltipProvider key={`${day.date}-${i}`}>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger>
                        <div 
                            className={cn(
                                "w-2.5 h-2.5 rounded-[2px] transition-colors hover:ring-1 hover:ring-ring/50",
                                getColor(day.count)
                            )}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                        {day.count} contributions on {day.date}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;
