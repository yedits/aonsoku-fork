import { useState } from 'react';
import { YouTubeVideo } from '@/types/youtube';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { YouTubeVideoPlayer } from './VideoPlayer';
import { Eye, ThumbsUp, MessageSquare, Clock, Play } from 'lucide-react';

interface VideoCardProps {
  video: YouTubeVideo;
}

export function YouTubeVideoCard({ video }: VideoCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  const formatNumber = (num: string) => {
    const n = parseInt(num);
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <>
      <Card 
        className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="w-16 h-16 text-white" fill="white" />
          </div>
          <div className="absolute bottom-2 right-2 bg-black/90 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {video.duration}
          </div>
          {parseInt(video.viewCount) > 100000 && (
            <Badge className="absolute top-2 left-2 bg-red-600 text-white">
              Trending
            </Badge>
          )}
        </div>
        <CardHeader className="pb-3">
          <CardTitle className="line-clamp-2 text-sm leading-tight">{video.title}</CardTitle>
          <CardDescription className="text-xs">{formatDate(video.publishedAt)}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Eye className="w-3 h-3" />
              {formatNumber(video.viewCount)}
            </span>
            <span className="flex items-center gap-1 hover:text-foreground transition-colors">
              <ThumbsUp className="w-3 h-3" />
              {formatNumber(video.likeCount)}
            </span>
            <span className="flex items-center gap-1 hover:text-foreground transition-colors">
              <MessageSquare className="w-3 h-3" />
              {formatNumber(video.commentCount)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{video.title}</DialogTitle>
            <DialogDescription>
              Published {formatDate(video.publishedAt)} • {formatNumber(video.viewCount)} views
            </DialogDescription>
          </DialogHeader>
          <YouTubeVideoPlayer video={video} />
        </DialogContent>
      </Dialog>
    </>
  );
}