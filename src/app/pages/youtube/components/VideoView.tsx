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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { 
  X, Eye, ThumbsUp, MessageSquare, ChevronDown, ChevronRight, 
  Share2, Download, ListPlus, ExternalLink, Clock, ThumbsDown,
  Bookmark, Link as LinkIcon, Settings, Play, User, Calendar,
  TrendingUp, Hash
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoViewProps {
  video: YouTubeVideo;
  onClose: () => void;
}

export function YouTubeVideoView({ video, onClose }: VideoViewProps) {
  const [comments, setComments] = useState<YouTubeComment[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<YouTubeVideo[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('comments');

  useEffect(() => {
    loadComments();
    loadRelatedVideos();
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

  const loadRelatedVideos = async () => {
    try {
      const data = await youtubeService.getChannelVideos(6);
      setRelatedVideos(data.filter(v => v.id !== video.id).slice(0, 6));
    } catch (err) {
      console.error('Error loading related videos:', err);
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
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${video.id}`);
  };

  const handleDownload = async () => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
  };

  const extractTags = (description: string) => {
    const hashtagRegex = /#\w+/g;
    const matches = description.match(hashtagRegex) || [];
    return matches.slice(0, 5);
  };

  const tags = extractTags(video.description);

  return (
    <div className="flex h-screen bg-background">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <div className="h-14 border-b px-4 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleShare} className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload} className="gap-2">
              <ExternalLink className="w-4 h-4" />
              YouTube
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="w-full px-6 py-4 space-y-4">
            {/* Video Player */}
            <div className="w-full bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Video Info Section */}
            <div className="space-y-3">
              {/* Title */}
              <h1 className="text-2xl font-bold leading-tight">{video.title}</h1>
              
              {/* Stats and Actions Bar */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                {/* Left: Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {formatNumber(video.viewCount)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(video.publishedAt)}
                  </span>
                </div>
                
                {/* Right: Action Buttons */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-full bg-muted">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn('rounded-l-full', isLiked && 'text-primary')}
                      onClick={() => {
                        setIsLiked(!isLiked);
                        if (isDisliked) setIsDisliked(false);
                      }}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1.5" />
                      {formatNumber(video.likeCount)}
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn('rounded-r-full', isDisliked && 'text-primary')}
                      onClick={() => {
                        setIsDisliked(!isDisliked);
                        if (isLiked) setIsLiked(false);
                      }}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleShare}
                    className="gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleDownload}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  
                  <Button
                    variant={isSaved ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setIsSaved(!isSaved)}
                    className="gap-2"
                  >
                    <Bookmark className={cn('w-4 h-4', isSaved && 'fill-current')} />
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      <Hash className="w-3 h-3" />
                      {tag.slice(1)}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Description Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 text-lg">Description</h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {video.description || 'No description available.'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-sm">
                      <div className="text-muted-foreground mb-1">Duration</div>
                      <div className="font-medium flex items-center gap-1.5 justify-end">
                        <Clock className="w-4 h-4" />
                        {video.duration}
                      </div>
                    </div>
                    <Separator />
                    <div className="text-sm">
                      <div className="text-muted-foreground mb-1">Comments</div>
                      <div className="font-medium flex items-center gap-1.5 justify-end">
                        <MessageSquare className="w-4 h-4" />
                        {formatNumber(video.commentCount)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Videos */}
            {relatedVideos.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Related Videos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedVideos.map((related) => (
                    <Card key={related.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className="relative aspect-video">
                        <img
                          src={related.thumbnail}
                          alt={related.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1.5 right-1.5 bg-black/90 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                          {related.duration}
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm line-clamp-2 leading-tight mb-2">
                          {related.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {formatNumber(related.viewCount)}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            {formatNumber(related.likeCount)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Padding */}
            <div className="h-6"></div>
          </div>
        </ScrollArea>
      </div>

      {/* Right Sidebar - Comments & Info */}
      <div className="w-[400px] border-l flex flex-col bg-muted/20">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b">
            <TabsList className="w-full grid grid-cols-2 rounded-none h-12 bg-transparent">
              <TabsTrigger value="comments" className="rounded-none data-[state=active]:bg-background">
                <MessageSquare className="w-4 h-4 mr-2" />
                Comments ({formatNumber(video.commentCount)})
              </TabsTrigger>
              <TabsTrigger value="info" className="rounded-none data-[state=active]:bg-background">
                <Settings className="w-4 h-4 mr-2" />
                Info
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Comments Tab */}
          <TabsContent value="comments" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                {loadingComments ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No comments yet</p>
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

          {/* Info Tab */}
          <TabsContent value="info" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                <div className="space-y-3">
                  <h3 className="font-semibold">Video Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Views</span>
                      <span className="font-medium">{formatNumber(video.viewCount)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Likes</span>
                      <span className="font-medium">{formatNumber(video.likeCount)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Comments</span>
                      <span className="font-medium">{formatNumber(video.commentCount)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{video.duration}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Published</span>
                      <span className="font-medium">{formatDate(video.publishedAt)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="font-semibold">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => {
                      navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${video.id}`);
                    }}>
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Copy Video URL
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => {
                      navigator.clipboard.writeText(video.thumbnail);
                    }}>
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Copy Thumbnail URL
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ListPlus className="w-4 h-4 mr-2" />
                      Add to Playlist
                    </Button>
                  </div>
                </div>
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
      <div className="flex gap-3 group">
        <Avatar className="w-8 h-8 flex-shrink-0">
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
            <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
              <ThumbsUp className="w-3 h-3" />
              {comment.likeCount}
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {hasReplies && (
        <div className="ml-11">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-primary hover:underline mb-2 py-1">
              {isOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span className="font-medium">
                {comment.replies!.length} {comment.replies!.length === 1 ? 'reply' : 'replies'}
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-1">
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
                      <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                        <ThumbsUp className="w-3 h-3" />
                        {reply.likeCount}
                      </div>
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