import { useAppStore } from '@/store/app.store';
import type { MusicMetadata } from '@/types/upload';
import { authQueryParams } from './httpClient';

const TAG_WRITER_URL = import.meta.env.VITE_TAG_WRITER_URL || 'http://localhost:3001';

class TagWriterService {
  async updateSongTags(
    songId: string,
    metadata: Partial<MusicMetadata>,
    coverArt?: File
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const { username, password, authType } = useAppStore.getState().data;
      const auth = authQueryParams(username, password, authType);

      const formData = new FormData();
      formData.append('songId', songId);
      formData.append('metadata', JSON.stringify(metadata));
      formData.append('navidromeAuth', JSON.stringify({
        ...auth,
        v: '1.16.0',
        c: 'aonsoku',
        f: 'json'
      }));

      if (coverArt) {
        formData.append('coverArt', coverArt);
      }

      const response = await fetch(`${TAG_WRITER_URL}/api/update-tags`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update tags');
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error('Failed to update song tags:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${TAG_WRITER_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Tag writer service not available:', error);
      return false;
    }
  }
}

export const tagWriterService = new TagWriterService();
