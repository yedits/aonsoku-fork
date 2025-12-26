import { YouTubeVideo, YouTubePlaylist, YouTubeComment, YouTubeChannelInfo } from '@/types/youtube';

// YouTube Data API v3 key - Users should add their own API key
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';
const CHANNEL_ID = 'UCqR_2vVvvvvvvvvvvvvvvvv'; // YeditsCommunity channel ID
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Helper function to parse duration from ISO 8601 format
function parseDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';
  
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '0M').replace('M', '');
  const seconds = (match[3] || '0S').replace('S', '');
  
  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.padStart(2, '0')}`;
}

export class YouTubeService {
  private static instance: YouTubeService;

  private constructor() {}

  public static getInstance(): YouTubeService {
    if (!YouTubeService.instance) {
      YouTubeService.instance = new YouTubeService();
    }
    return YouTubeService.instance;
  }

  async getChannelInfo(): Promise<YouTubeChannelInfo | null> {
    if (!API_KEY) {
      console.warn('YouTube API key not configured');
      return null;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${API_KEY}`
      );
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) return null;
      
      const channel = data.items[0];
      return {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        subscriberCount: channel.statistics.subscriberCount,
        videoCount: channel.statistics.videoCount,
        thumbnail: channel.snippet.thumbnails.high.url,
      };
    } catch (error) {
      console.error('Error fetching channel info:', error);
      return null;
    }
  }

  async getChannelVideos(maxResults = 50): Promise<YouTubeVideo[]> {
    if (!API_KEY) {
      console.warn('YouTube API key not configured');
      return [];
    }

    try {
      // Get video IDs from channel
      const searchResponse = await fetch(
        `${BASE_URL}/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${maxResults}&order=date&type=video&key=${API_KEY}`
      );
      const searchData = await searchResponse.json();
      
      if (!searchData.items || searchData.items.length === 0) return [];
      
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
      
      // Get detailed video information
      const videosResponse = await fetch(
        `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
      );
      const videosData = await videosResponse.json();
      
      return videosData.items.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.high.url,
        publishedAt: video.snippet.publishedAt,
        duration: parseDuration(video.contentDetails.duration),
        viewCount: video.statistics.viewCount || '0',
        likeCount: video.statistics.likeCount || '0',
        commentCount: video.statistics.commentCount || '0',
      }));
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  }

  async getChannelPlaylists(maxResults = 50): Promise<YouTubePlaylist[]> {
    if (!API_KEY) {
      console.warn('YouTube API key not configured');
      return [];
    }

    try {
      const response = await fetch(
        `${BASE_URL}/playlists?part=snippet,contentDetails&channelId=${CHANNEL_ID}&maxResults=${maxResults}&key=${API_KEY}`
      );
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) return [];
      
      return data.items.map((playlist: any) => ({
        id: playlist.id,
        title: playlist.snippet.title,
        description: playlist.snippet.description,
        thumbnail: playlist.snippet.thumbnails.high.url,
        itemCount: playlist.contentDetails.itemCount,
        videos: [], // Populated on demand
      }));
    } catch (error) {
      console.error('Error fetching playlists:', error);
      return [];
    }
  }

  async getPlaylistVideos(playlistId: string, maxResults = 50): Promise<YouTubeVideo[]> {
    if (!API_KEY) {
      console.warn('YouTube API key not configured');
      return [];
    }

    try {
      const response = await fetch(
        `${BASE_URL}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${API_KEY}`
      );
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) return [];
      
      const videoIds = data.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
      
      const videosResponse = await fetch(
        `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
      );
      const videosData = await videosResponse.json();
      
      return videosData.items.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.high.url,
        publishedAt: video.snippet.publishedAt,
        duration: parseDuration(video.contentDetails.duration),
        viewCount: video.statistics.viewCount || '0',
        likeCount: video.statistics.likeCount || '0',
        commentCount: video.statistics.commentCount || '0',
      }));
    } catch (error) {
      console.error('Error fetching playlist videos:', error);
      return [];
    }
  }

  async getVideoComments(videoId: string, maxResults = 100): Promise<YouTubeComment[]> {
    if (!API_KEY) {
      console.warn('YouTube API key not configured');
      return [];
    }

    try {
      const response = await fetch(
        `${BASE_URL}/commentThreads?part=snippet,replies&videoId=${videoId}&maxResults=${maxResults}&order=relevance&key=${API_KEY}`
      );
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) return [];
      
      return data.items.map((thread: any) => {
        const topComment = thread.snippet.topLevelComment.snippet;
        const replies = thread.replies?.comments?.map((reply: any) => ({
          id: reply.id,
          author: reply.snippet.authorDisplayName,
          authorProfileImageUrl: reply.snippet.authorProfileImageUrl,
          text: reply.snippet.textDisplay,
          likeCount: reply.snippet.likeCount,
          publishedAt: reply.snippet.publishedAt,
        })) || [];
        
        return {
          id: thread.snippet.topLevelComment.id,
          author: topComment.authorDisplayName,
          authorProfileImageUrl: topComment.authorProfileImageUrl,
          text: topComment.textDisplay,
          likeCount: topComment.likeCount,
          publishedAt: topComment.publishedAt,
          replies: replies.length > 0 ? replies : undefined,
        };
      });
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }
}

export const youtubeService = YouTubeService.getInstance();