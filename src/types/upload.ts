export interface MusicMetadata {
  title?: string;
  artist?: string;
  album?: string;
  albumArtist?: string;
  year?: number;
  track?: number;
  genre?: string;
  comment?: string;
  coverArt?: string; // base64 encoded image
}

export interface UploadFile {
  id: string;
  file: File;
  metadata?: MusicMetadata;
  coverArtFile?: File; // Separate cover art file
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  file?: {
    originalName: string;
    path: string;
    size: number;
  };
}

export interface MetadataResponse {
  format: {
    duration?: number;
    bitrate?: number;
    sampleRate?: number;
    codec?: string;
  };
  common: MusicMetadata;
  native: Record<string, any>;
}

export interface BatchUploadFile {
  file: File;
  metadata?: MusicMetadata;
  coverArt?: File;
}
