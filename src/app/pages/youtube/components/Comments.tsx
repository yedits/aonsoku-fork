import { YouTubeComment } from '@/types/youtube';
import { Card, CardContent } from '@/app/components/ui/card';
import { ThumbsUp } from 'lucide-react';

interface CommentsProps {
  comments: YouTubeComment[];
}

export function YouTubeComments({ comments }: CommentsProps) {
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

  const CommentItem = ({ comment, isReply = false }: { comment: YouTubeComment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-12 mt-2' : ''}`}>
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <img
              src={comment.authorProfileImageUrl}
              alt={comment.author}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{comment.author}</span>
                <span className="text-xs text-muted-foreground">{formatDate(comment.publishedAt)}</span>
              </div>
              <div 
                className="text-sm mb-2"
                dangerouslySetInnerHTML={{ __html: comment.text }}
              />
              {comment.likeCount > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ThumbsUp className="w-3 h-3" />
                  {comment.likeCount}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  );

  if (comments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          No comments available or comments are disabled for this video.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}