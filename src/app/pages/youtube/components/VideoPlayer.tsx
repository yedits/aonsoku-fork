import { useState, useEffect } from 'react';
import { YouTubeVideo, YouTubeComment } from '@/types/youtube';
import { youtubeService } from '@/service/youtube';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Card, CardContent } from '@/app/components/ui/card';
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
      const commentsData = await youtubeService.getVideoComments(video.id);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const formatNumber = (num: string) => {
    return parseInt(num).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* YouTube Player */}
      <div className="aspect-video w-full">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg"
        />
      </div>

      {/* Video Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-around text-sm">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span>{formatNumber(video.viewCount)} views</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-muted-foreground" />
              <span>{formatNumber(video.likeCount)} likes</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <span>{formatNumber(video.commentCount)} comments</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Description and Comments */}
      <Tabs defaultValue="description">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="comments">Comments ({comments.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description">
          <Card>
            <CardContent className="p-4">
              <p className="whitespace-pre-wrap text-sm">
                {video.description || 'No description available.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comments">
          {loadingComments ? (
            <div className="flex justify-center py-8">
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