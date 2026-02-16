import { Github, Star, GitFork, Book, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
// Assuming there's a user slice action to update user data or we re-fetch.
// If I can't import actions easily, I'll reload window or use context if available.
import { BASE_URL } from "@/utils/constants"; // Check constants or config

const GitHubStats = ({ user, setUser }) => {
  const { github } = user;

  const handleConnect = () => {
    window.location.href = `${BASE_URL}/github/connect`;
  };

  const handleDisconnect = async () => {
    try {
      await axios.post(`${BASE_URL}/github/disconnect`, {}, { withCredentials: true });
      toast.success("GitHub disconnected");
      // Update local state locally to reflect changes immediately
      setUser({ ...user, github: undefined });
    } catch (error) {
      toast.error("Failed to disconnect");
    }
  };

  const handleSync = async () => {
    try {
      await axios.post(`${BASE_URL}/github/sync`, {}, { withCredentials: true });
      toast.success("Sync started. Data will update shortly.");
    } catch (error) {
      if (error.response?.status === 429) {
          toast.error(error.response.data.message);
      } else {
        toast.error("Sync failed");
      }
    }
  };

  if (!github || !github.username) {
    return (
      <Card className="premium-card mt-6">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="p-3 bg-muted rounded-full">
            <Github className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Connect GitHub</h3>
            <p className="text-muted-foreground mt-1 max-w-md">
              Showcase your repositories, contributions, and coding stats directly on your profile.
            </p>
          </div>
          <Button onClick={handleConnect} className="btn-primary">
            Connect Account
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="premium-card mt-6 border-zinc-800/40">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 rounded-lg">
                <Github className="w-5 h-5" />
            </div>
            <div>
                <CardTitle className="text-lg">GitHub Activity</CardTitle>
                <a 
                    href={`https://github.com/${github.username}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                    @{github.username}
                </a>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleSync} title="Sync now">
                <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDisconnect} className="text-destructive hover:text-destructive" title="Disconnect">
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatItem icon={<Book className="w-4 h-4 text-blue-400" />} label="Repositories" value={github.totalRepos} />
            <StatItem icon={<Star className="w-4 h-4 text-yellow-400" />} label="Total Stars" value={github.totalStars} />
            {/* We could add more stats here */}
        </div>
        
        {/* Top Languages */}
        {github.languages && Object.keys(github.languages).length > 0 && (
            <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Top Languages</h4>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(github.languages)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([lang]) => (
                        <span key={lang} className="px-2.5 py-1 bg-secondary rounded-md text-xs font-medium">
                            {lang}
                        </span>
                    ))}
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
};

const StatItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
        {icon}
        <div>
            <p className="text-2xl font-bold leading-none">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
        </div>
    </div>
);

export default GitHubStats;
