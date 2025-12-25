import express from 'express';
import cors from 'cors';
import multer from 'multer';
import nodeId3 from 'node-id3';
import { parseFile } from 'music-metadata';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

// Configuration
const PORT = process.env.PORT || 3001;
const NAVIDROME_URL = process.env.NAVIDROME_URL || 'http://localhost:4533';
const MUSIC_LIBRARY_PATH = process.env.MUSIC_LIBRARY_PATH;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Middleware
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    musicLibraryPath: MUSIC_LIBRARY_PATH,
    navidromeUrl: NAVIDROME_URL
  });
});

// Get song file path from Navidrome
async function getSongPath(songId, navidromeAuth) {
  try {
    const response = await axios.get(`${NAVIDROME_URL}/rest/getSong`, {
      params: {
        id: songId,
        ...navidromeAuth
      }
    });

    const song = response.data['subsonic-response']?.song;
    if (!song) {
      throw new Error('Song not found');
    }

    // Build full file path
    const filePath = path.join(MUSIC_LIBRARY_PATH, song.path);
    return filePath;
  } catch (error) {
    console.error('Error getting song path:', error);
    throw error;
  }
}

// Trigger Navidrome scan
async function triggerNavidromeScan(navidromeAuth) {
  try {
    await axios.get(`${NAVIDROME_URL}/rest/startScan`, {
      params: navidromeAuth
    });
    console.log('Navidrome scan triggered');
    return true;
  } catch (error) {
    console.error('Error triggering Navidrome scan:', error);
    return false;
  }
}

// Write tags to MP3 file
function writeMP3Tags(filePath, tags, coverArtPath) {
  const id3Tags = {
    title: tags.title,
    artist: tags.artist,
    album: tags.album,
    year: tags.year?.toString(),
    genre: tags.genre,
    trackNumber: tags.track?.toString(),
    partOfSet: tags.disc?.toString(),
    comment: {
      language: 'eng',
      text: tags.comment || ''
    },
    unsynchronisedLyrics: tags.lyrics ? {
      language: 'eng',
      text: tags.lyrics
    } : undefined,
    composer: tags.composer,
    bpm: tags.bpm?.toString(),
    performerInfo: tags.albumArtist,
  };

  // Add cover art if provided
  if (coverArtPath) {
    id3Tags.image = {
      mime: 'image/jpeg',
      type: {
        id: 3,
        name: 'front cover'
      },
      description: 'Cover',
      imageBuffer: fs.readFileSync(coverArtPath)
    };
  }

  // Remove undefined values
  Object.keys(id3Tags).forEach(key => {
    if (id3Tags[key] === undefined) {
      delete id3Tags[key];
    }
  });

  const success = nodeId3.update(id3Tags, filePath);
  return success;
}

// Update song metadata endpoint
app.post('/api/update-tags', upload.single('coverArt'), async (req, res) => {
  try {
    const { songId, metadata, navidromeAuth } = req.body;
    
    if (!songId || !metadata) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!MUSIC_LIBRARY_PATH) {
      return res.status(500).json({ error: 'MUSIC_LIBRARY_PATH not configured' });
    }

    // Parse metadata
    const tags = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
    const auth = typeof navidromeAuth === 'string' ? JSON.parse(navidromeAuth) : navidromeAuth;

    // Get file path from Navidrome
    const filePath = await getSongPath(songId, auth);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found', path: filePath });
    }

    // Get file extension
    const ext = path.extname(filePath).toLowerCase();

    // Handle cover art
    const coverArtPath = req.file ? req.file.path : null;

    // Write tags based on file type
    let success = false;
    
    if (ext === '.mp3') {
      success = writeMP3Tags(filePath, tags, coverArtPath);
    } else {
      // For non-MP3 files, we'd need different libraries
      // For now, return an error
      return res.status(400).json({ 
        error: 'Unsupported file format',
        format: ext,
        message: 'Currently only MP3 files are supported. Support for FLAC, M4A coming soon.'
      });
    }

    // Clean up uploaded cover art
    if (coverArtPath && fs.existsSync(coverArtPath)) {
      fs.unlinkSync(coverArtPath);
    }

    if (!success) {
      return res.status(500).json({ error: 'Failed to write tags' });
    }

    // Trigger Navidrome rescan
    await triggerNavidromeScan(auth);

    res.json({ 
      success: true,
      message: 'Tags updated successfully',
      filePath,
      scanTriggered: true
    });

  } catch (error) {
    console.error('Error updating tags:', error);
    res.status(500).json({ 
      error: 'Failed to update tags',
      message: error.message 
    });
  }
});

// Get file metadata (read-only)
app.get('/api/get-metadata/:songId', async (req, res) => {
  try {
    const { songId } = req.params;
    const navidromeAuth = req.query;

    const filePath = await getSongPath(songId, navidromeAuth);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const metadata = await parseFile(filePath);

    res.json({
      success: true,
      metadata: {
        common: metadata.common,
        format: metadata.format,
        native: metadata.native
      },
      filePath
    });

  } catch (error) {
    console.error('Error reading metadata:', error);
    res.status(500).json({ 
      error: 'Failed to read metadata',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🎵 Tag Writer Service running on port ${PORT}`);
  console.log(`📁 Music Library: ${MUSIC_LIBRARY_PATH || 'NOT CONFIGURED'}`);
  console.log(`🎧 Navidrome: ${NAVIDROME_URL}`);
  console.log(`\n✅ Ready to accept tag updates!\n`);

  if (!MUSIC_LIBRARY_PATH) {
    console.warn('⚠️  WARNING: MUSIC_LIBRARY_PATH not set. Please configure in .env file');
  }
});
