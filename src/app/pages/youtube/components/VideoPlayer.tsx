import { useState, useEffect } from 'react';
import { YouTubeVideo, YouTubeComment } from '@/types/youtube';
import { youtubeService } from '@/service/youtube';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { YouTubeComments } from './Comments';
import { Eye, ThumbsUp, MessageSquare } from 'lucide-react';

interface VideoPlayerProps {
  video: YouTubeVideo;
}

export function YouTubeVideoPlayer({ video }: VideoPlayerProps) {
  const [comments, setComments] = useState<YouTubeComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    loadComments();
  }, [video.id]);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const data = await youtubeService.getVideoComments(video.id, 100);
      setComments(data);
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const formatNumber = (num: string) => {
    const n = parseInt(num);
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

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

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Video Stats */}
      <div className="flex items-center gap-6 text-sm">
        <span className="flex items-center gap-2 text-muted-foreground">
          <Eye className="w-4 h-4" />
          {formatNumber(video.viewCount)} views
        </span>
        <span className="flex items-center gap-2 text-muted-foreground">
          <ThumbsUp className="w-4 h-4" />
          {formatNumber(video.likeCount)} likes
        </span>
        <span className="flex items-center gap-2 text-muted-foreground">
          <MessageSquare className="w-4 h-4" />
          {formatNumber(video.commentCount)} comments
        </span>
        <span className="text-muted-foreground">
          {formatDate(video.publishedAt)}
        </span>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="description">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="comments">
            Comments ({formatNumber(video.commentCount)})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{video.description}</p>
          </div>
        </TabsContent>
        
        <TabsContent value="comments" className="mt-4">
          {loadingComments ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <YouTubeComments comments={comments} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}