import { useState } from 'react';
import { YouTubeVideo } from '@/types/youtube';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { YouTubeVideoPlayer } from './VideoPlayer';
import { Eye, ThumbsUp, MessageSquare, Clock } from 'lucide-react';

interface VideoCardProps {
  video: YouTubeVideo;
}

export function YouTubeVideoCard({ video }: VideoCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatNumber = (num: string) => {
    return parseInt(num).toLocaleString();
  };

  return (
    <>
      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full aspect-video object-cover rounded-t-lg"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {video.duration}
          </div>
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2 text-sm">{video.title}</CardTitle>
          <CardDescription className="text-xs">{formatDate(video.publishedAt)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatNumber(video.viewCount)}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              {formatNumber(video.likeCount)}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {formatNumber(video.commentCount)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{video.title}</DialogTitle>
            <DialogDescription>
              Published on {formatDate(video.publishedAt)}
            </DialogDescription>
          </DialogHeader>
          <YouTubeVideoPlayer video={video} />
        </DialogContent>
      </Dialog>
    </>
  );
}