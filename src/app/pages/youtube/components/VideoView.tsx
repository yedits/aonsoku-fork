import { useState, useEffect } from 'react';
import { YouTubeVideo, YouTubeComment } from '@/types/youtube';
import { youtubeService } from '@/service/youtube';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/app/components/ui/collapsible';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Separator } from '@/app/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { 
  X, Eye, ThumbsUp, MessageSquare, ChevronDown, ChevronRight, 
  Share2, Download, ListPlus, ExternalLink, Clock 
} from 'lucide-react';

interface VideoViewProps {
  video: YouTubeVideo;
  onClose: () => void;
}

export function YouTubeVideoView({ video, onClose }: VideoViewProps) {
  const [comments, setComments] = useState<YouTubeComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    loadComments();
  }, [video.id]);

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

  const handleShare = () => {
    navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${video.id}`);
    // TODO: Add toast notification
  };

  const handleOpenYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Main Content - Left Side */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar with Back Button */}
        <div className="flex items-center justify-between px-6 py-3 border-b bg-background">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Back to Videos
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleShare} className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="ghost" size="sm" onClick={handleOpenYouTube} className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Watch on YouTube
            </Button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <ScrollArea className="flex-1">
          <div className="max-w-7xl mx-auto px-6 py-6 space-y-4">
            {/* Video Title & Stats */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold leading-tight">{video.title}</h1>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {formatNumber(video.viewCount)} views
                </span>
                <span className="flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4" />
                  {formatNumber(video.likeCount)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  {formatNumber(video.commentCount)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {video.duration}
                </span>
                <span>•</span>
                <span>{formatDate(video.publishedAt)}</span>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative w-full rounded-lg overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Description Section */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 text-lg">Description</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                    {video.description || 'No description available.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Extra padding at bottom */}
            <div className="h-6"></div>
          </div>
        </ScrollArea>
      </div>

      {/* Comments Sidebar - Right Side */}
      <div className="w-[420px] border-l flex flex-col bg-muted/30">
        {/* Comments Header */}
        <div className="px-4 py-4 border-b bg-background">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Comments</h2>
            <Badge variant="secondary">{formatNumber(video.commentCount)}</Badge>
          </div>
        </div>

        {/* Comments List */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {loadingComments ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No comments available</p>
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
        <Avatar className="w-9 h-9 flex-shrink-0">
          <AvatarImage src={comment.authorProfileImageUrl} />
          <AvatarFallback className="text-xs">{comment.author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-sm">{comment.author}</span>
            <span className="text-xs text-muted-foreground">{formatDate(comment.publishedAt)}</span>
          </div>
          <div 
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: comment.text }}
          />
          {comment.likeCount > 0 && (
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1">
              <ThumbsUp className="w-3 h-3" />
              {comment.likeCount}
            </button>
          )}
        </div>
      </div>

      {/* Replies */}
      {hasReplies && (
        <div className="ml-12">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary hover:underline mb-2">
              {isOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              {comment.replies!.map((reply) => (
                <div key={reply.id} className="flex gap-2.5">
                  <Avatar className="w-7 h-7 flex-shrink-0">
                    <AvatarImage src={reply.authorProfileImageUrl} />
                    <AvatarFallback className="text-xs">{reply.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-sm">{reply.author}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(reply.publishedAt)}</span>
                    </div>
                    <div 
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: reply.text }}
                    />
                    {reply.likeCount > 0 && (
                      <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1">
                        <ThumbsUp className="w-3 h-3" />
                        {reply.likeCount}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}

      <Separator className="my-3" />
    </div>
  );
}