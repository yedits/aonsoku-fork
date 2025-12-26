import { YouTubeVideo, YouTubePlaylist } from '@/types/youtube';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Video, ListVideo, Eye, ThumbsUp, MessageSquare, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface StatsProps {
  videos: YouTubeVideo[];
  playlists: YouTubePlaylist[];
  onRefresh: () => void;
}

export function YouTubeStats({ videos, playlists, onRefresh }: StatsProps) {
  const [refreshing, setRefreshing] = useState(false);
  
  const totalViews = videos.reduce((sum, v) => sum + parseInt(v.viewCount), 0);
  const totalLikes = videos.reduce((sum, v) => sum + parseInt(v.likeCount), 0);
  const totalComments = videos.reduce((sum, v) => sum + parseInt(v.commentCount), 0);
  const avgViews = videos.length > 0 ? Math.round(totalViews / videos.length) : 0;
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 1000);
  };
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };
  
  const stats = [
    { icon: Video, label: 'Total Videos', value: videos.length, color: 'text-blue-500' },
    { icon: ListVideo, label: 'Playlists', value: playlists.length, color: 'text-purple-500' },
    { icon: Eye, label: 'Total Views', value: formatNumber(totalViews), color: 'text-green-500' },
    { icon: ThumbsUp, label: 'Total Likes', value: formatNumber(totalLikes), color: 'text-red-500' },
    { icon: MessageSquare, label: 'Total Comments', value: formatNumber(totalComments), color: 'text-orange-500' },
    { icon: Eye, label: 'Avg Views', value: formatNumber(avgViews), color: 'text-cyan-500' },
  ];
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Channel Statistics</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Data cached for 1 hour to save API quota
        </p>
      </CardContent>
    </Card>
  );
}