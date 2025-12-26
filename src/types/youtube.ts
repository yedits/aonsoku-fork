export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  itemCount: number;
  videos: YouTubeVideo[];
}

export interface YouTubeComment {
  id: string;
  author: string;
  authorProfileImageUrl: string;
  text: string;
  likeCount: number;
  publishedAt: string;
  replies?: YouTubeComment[];
}

export interface YouTubeChannelInfo {
  id: string;
  title: string;
  description: string;
  subscriberCount: string;
  videoCount: string;
  thumbnail: string;
}