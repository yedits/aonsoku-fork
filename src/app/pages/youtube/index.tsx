import { useState, useEffect } from 'react';
import { youtubeService } from '@/service/youtube';
import { YouTubeVideo, YouTubePlaylist, YouTubeChannelInfo } from '@/types/youtube';
import { YouTubeVideoCard } from '@/app/pages/youtube/components/VideoCard';
import { YouTubePlaylistCard } from '@/app/pages/youtube/components/PlaylistCard';
import { YouTubeChannelHeader } from '@/app/pages/youtube/components/ChannelHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

export default function YouTubePage() {
  const [channelInfo, setChannelInfo] = useState<YouTubeChannelInfo | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    loadChannelData();
  }, []);

  const loadChannelData = async () => {
    setLoading(true);
    try {
      const [channelData, videosData, playlistsData] = await Promise.all([
        youtubeService.getChannelInfo(),
        youtubeService.getChannelVideos(50),
        youtubeService.getChannelPlaylists(50),
      ]);
      
      setChannelInfo(channelData);
      setVideos(videosData);
      setPlaylists(playlistsData);
    } catch (error) {
      console.error('Error loading YouTube data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {channelInfo && <YouTubeChannelHeader channel={channelInfo} />}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="videos">Videos ({videos.length})</TabsTrigger>
          <TabsTrigger value="playlists">Playlists ({playlists.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <YouTubeVideoCard key={video.id} video={video} />
            ))}
          </div>
          {videos.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No videos found. Please configure your YouTube API key.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="playlists" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <YouTubePlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
          {playlists.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No playlists found.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}