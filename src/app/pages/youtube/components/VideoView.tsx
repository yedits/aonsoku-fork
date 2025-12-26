import { useState, useEffect } from 'react';
import { YouTubeVideo, YouTubeComment } from '@/types/youtube';
import { youtubeService } from '@/service/youtube';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/app/components/ui/collapsible';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Separator } from '@/app/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { X, Eye, ThumbsUp, MessageSquare, ChevronDown, ChevronRight } from 'lucide-react';

interface VideoViewProps {
  video: YouTubeVideo;
  onClose: () => void;
}

export function YouTubeVideoView({ video, onClose }: VideoViewProps) {
  const [comments, setComments] = useState<YouTubeComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (activeTab === 'comments' && comments.length === 0) {
      loadComments();
    }
  }, [activeTab]);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const data = await youtubeService.getVideoComments(video.id, 50);
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
    
    if (days === 0) return 'today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Video Player Section - Left */}
      <div className="flex-1 flex flex-col">
        {/* Close Button */}
        <div className="p-4 border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Back to Videos
          </Button>
        </div>

        {/* Video Player */}
        <div className="flex-1 flex items-center justify-center bg-black p-4">
          <div className="w-full max-w-6xl aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded"
            />
          </div>
        </div>

        {/* Video Info Below Player */}
        <div className="p-6 border-t">
          <h1 className="text-2xl font-bold mb-3">{video.title}</h1>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {formatNumber(video.viewCount)} views
            </span>
            <span className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" />
              {formatNumber(video.likeCount)} likes
            </span>
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {formatNumber(video.commentCount)} comments
            </span>
            <span>•</span>
            <span>{formatDate(video.publishedAt)}</span>
          </div>
        </div>
      </div>

      {/* Side Panel - Right */}
      <div className="w-[480px] border-l flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b">
            <TabsList className="w-full grid grid-cols-2 rounded-none h-12">
              <TabsTrigger value="description" className="rounded-none">
                Description
              </TabsTrigger>
              <TabsTrigger value="comments" className="rounded-none">
                Comments ({formatNumber(video.commentCount)})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="description" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="comments" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                {loadingComments ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    No comments available
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <CommentThread key={comment.id} comment={comment} />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function CommentThread({ comment }: { comment: YouTubeComment }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  return (
    <div className="space-y-3">
      {/* Main Comment */}
      <div className="flex gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={comment.authorProfileImageUrl} />
          <AvatarFallback>{comment.author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-medium text-sm">{comment.author}</span>
            <span className="text-xs text-muted-foreground">{formatDate(comment.publishedAt)}</span>
          </div>
          <div 
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: comment.text }}
          />
          <div className="flex items-center gap-4 mt-2">
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ThumbsUp className="w-3 h-3" />
              {comment.likeCount > 0 && comment.likeCount}
            </button>
          </div>
        </div>
      </div>

      {/* Replies */}
      {hasReplies && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary hover:underline ml-11 mb-2">
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3">
            {comment.replies!.map((reply) => (
              <div key={reply.id} className="flex gap-3 ml-11">
                <Avatar className="w-7 h-7 flex-shrink-0">
                  <AvatarImage src={reply.authorProfileImageUrl} />
                  <AvatarFallback>{reply.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium text-sm">{reply.author}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(reply.publishedAt)}</span>
                  </div>
                  <div 
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: reply.text }}
                  />
                  <div className="flex items-center gap-4 mt-2">
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                      <ThumbsUp className="w-3 h-3" />
                      {reply.likeCount > 0 && reply.likeCount}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      <Separator className="my-4" />
    </div>
  );
}