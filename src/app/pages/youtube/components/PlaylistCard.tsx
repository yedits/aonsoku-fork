import { useState } from 'react';
import { YouTubePlaylist } from '@/types/youtube';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { YouTubePlaylistViewer } from './PlaylistViewer';
import { List } from 'lucide-react';

interface PlaylistCardProps {
  playlist: YouTubePlaylist;
}

export function YouTubePlaylistCard({ playlist }: PlaylistCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative">
          <img
            src={playlist.thumbnail}
            alt={playlist.title}
            className="w-full aspect-video object-cover rounded-t-lg"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <List className="w-3 h-3" />
            {playlist.itemCount} videos
          </div>
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2 text-sm">{playlist.title}</CardTitle>
          <CardDescription className="line-clamp-2 text-xs">
            {playlist.description || 'No description'}
          </CardDescription>
        </CardHeader>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{playlist.title}</DialogTitle>
            <DialogDescription>
              {playlist.itemCount} videos in this playlist
            </DialogDescription>
          </DialogHeader>
          <YouTubePlaylistViewer playlist={playlist} />
        </DialogContent>
      </Dialog>
    </>
  );
}