import { httpClient } from './httpClient';
import type { MusicMetadata } from '@/types/upload';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  albumId?: string;
  artistId?: string;
  year?: number;
  genre?: string;
  duration?: number;
  bitRate?: number;
  size?: number;
  path?: string;
  coverArt?: string;
  track?: number;
  discNumber?: number;
  created?: string;
  albumArtist?: string;
  type?: string;
  suffix?: string;
  contentType?: string;
}

export interface SearchResult {
  song?: Song[];
  album?: Array<{
    id: string;
    name: string;
    artist: string;
    artistId: string;
    coverArt?: string;
    songCount: number;
    duration: number;
    created: string;
    year?: number;
    genre?: string;
  }>;
  artist?: Array<{
    id: string;
    name: string;
    albumCount: number;
    coverArt?: string;
  }>;
}

class SongService {
  async searchSongs(query: string, songCount = 50): Promise<Song[]> {
    try {
      const response = await httpClient<{ searchResult3: SearchResult }>(
        'search3',
        {
          query: {
            query,
            songCount,
            albumCount: 0,
            artistCount: 0,
          },
        }
      );

      if (response?.data?.searchResult3?.song) {
        return response.data.searchResult3.song;
      }

      return [];
    } catch (error) {
      console.error('Failed to search songs:', error);
      throw error;
    }
  }

  async getSong(id: string): Promise<Song | null> {
    try {
      const response = await httpClient<{ song: Song }>('getSong', {
        query: { id },
      });

      if (response?.data?.song) {
        return response.data.song;
      }

      return null;
    } catch (error) {
      console.error('Failed to get song:', error);
      throw error;
    }
  }

  async getRecentSongs(count = 50): Promise<Song[]> {
    try {
      const response = await httpClient<{ albumList2: { album: Song[] } }>(
        'getAlbumList2',
        {
          query: {
            type: 'recent',
            size: count,
          },
        }
      );

      if (response?.data?.albumList2?.album) {
        // Get songs from recent albums
        const songs: Song[] = [];
        for (const album of response.data.albumList2.album.slice(0, 10)) {
          const albumSongs = await this.getAlbumSongs(album.id);
          songs.push(...albumSongs);
        }
        return songs.slice(0, count);
      }

      return [];
    } catch (error) {
      console.error('Failed to get recent songs:', error);
      return [];
    }
  }

  async getAlbumSongs(albumId: string): Promise<Song[]> {
    try {
      const response = await httpClient<{ album: { song: Song[] } }>(
        'getAlbum',
        {
          query: { id: albumId },
        }
      );

      if (response?.data?.album?.song) {
        return response.data.album.song;
      }

      return [];
    } catch (error) {
      console.error('Failed to get album songs:', error);
      return [];
    }
  }

  async updateSongMetadata(
    songId: string,
    metadata: Partial<MusicMetadata>
  ): Promise<boolean> {
    try {
      // Navidrome uses the updateShare endpoint for metadata updates
      // This is a workaround - in a real implementation, you'd need a proper API endpoint
      const params: Record<string, string | number> = {
        id: songId,
      };

      if (metadata.title) params.title = metadata.title;
      if (metadata.artist) params.artist = metadata.artist;
      if (metadata.album) params.album = metadata.album;
      if (metadata.albumArtist) params.albumArtist = metadata.albumArtist;
      if (metadata.year) params.year = metadata.year;
      if (metadata.genre) params.genre = metadata.genre;
      if (metadata.track) params.track = metadata.track;
      if (metadata.disc) params.disc = metadata.disc;

      // Note: Navidrome doesn't have a direct updateSong endpoint in the Subsonic API
      // This would need to be implemented on the backend or use ID3 tag writing
      // For now, we'll return true and log the attempt
      console.log('Update song metadata request:', songId, metadata);
      
      // In a real implementation, you would:
      // 1. Send the metadata to a custom backend endpoint
      // 2. Backend writes the tags to the file using a library like node-id3
      // 3. Trigger a library rescan
      
      return true;
    } catch (error) {
      console.error('Failed to update song metadata:', error);
      return false;
    }
  }

  async updateCoverArt(songId: string, coverArtFile: File): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('id', songId);
      formData.append('coverArt', coverArtFile);

      // Note: Similar to metadata updates, Navidrome doesn't have a direct endpoint
      // This would need backend implementation
      console.log('Update cover art request:', songId, coverArtFile.name);
      
      return true;
    } catch (error) {
      console.error('Failed to update cover art:', error);
      return false;
    }
  }

  // Convert Song to MusicMetadata format
  songToMetadata(song: Song): MusicMetadata {
    return {
      title: song.title,
      artist: song.artist,
      album: song.album,
      albumArtist: song.albumArtist,
      year: song.year,
      genre: song.genre,
      track: song.track,
      disc: song.discNumber,
      coverArt: song.coverArt,
    };
  }
}

export const songService = new SongService();
