# Navidrome Tag Writer Service

A microservice that writes ID3 tags to your music files and triggers Navidrome library rescans.

## Why This Service?

Navidrome is read-only with respect to file metadata. This service bridges that gap by:
- Writing tags directly to your audio files using `node-id3`
- Automatically triggering Navidrome rescans after updates
- Providing a REST API for your frontend to edit tags seamlessly

## Features

✅ Write ID3v2.4 tags to MP3 files  
✅ Update all common metadata fields (title, artist, album, year, genre, etc.)  
✅ Embed cover artwork  
✅ Add lyrics to files  
✅ Support for track/disc numbers  
✅ Auto-trigger Navidrome library rescan  
🔜 FLAC support (coming soon)  
🔜 M4A/AAC support (coming soon)  

## Installation

### Prerequisites

- Node.js 18+ installed
- Navidrome instance running
- Access to your music library folder

### Setup

1. **Navigate to the service directory:**
```bash
cd tag-writer-service
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
# Your Navidrome URL
NAVIDROME_URL=http://localhost:4533

# Navidrome admin credentials
NAVIDROME_USERNAME=admin
NAVIDROME_PASSWORD=your_password

# Path to your music library (MUST match Navidrome's music folder)
MUSIC_LIBRARY_PATH=/path/to/your/music

# Service port
PORT=3001

# Frontend URL for CORS
CORS_ORIGIN=http://localhost:3000
```

4. **Start the service:**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Update Song Tags

**POST** `/api/update-tags`

Update metadata tags for a song file.

**Request Body (multipart/form-data):**
```javascript
{
  songId: "song-123",
  metadata: {
    title: "Song Title",
    artist: "Artist Name",
    album: "Album Name",
    albumArtist: "Album Artist",
    year: 2025,
    genre: "Rock",
    track: 1,
    disc: 1,
    composer: "Composer Name",
    bpm: 120,
    comment: "My comment",
    lyrics: "Song lyrics here..."
  },
  navidromeAuth: {
    u: "username",
    t: "token",
    s: "salt",
    v: "1.16.0",
    c: "aonsoku",
    f: "json"
  },
  coverArt: <File> // Optional cover art file
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tags updated successfully",
  "filePath": "/music/Artist/Album/track.mp3",
  "scanTriggered": true
}
```

### Health Check

**GET** `/health`

Check service status and configuration.

**Response:**
```json
{
  "status": "ok",
  "musicLibraryPath": "/path/to/music",
  "navidromeUrl": "http://localhost:4533"
}
```

## How It Works

1. **Frontend** sends tag update request with song ID and new metadata
2. **Service** queries Navidrome API to get the file path
3. **Service** writes tags directly to the audio file using `node-id3`
4. **Service** triggers Navidrome library rescan via API
5. **Navidrome** re-reads the file and updates its database
6. **Frontend** sees updated metadata after rescan completes

## Security Notes

⚠️ **Important:** This service requires write access to your music library. Consider:

- Running it on the same server as Navidrome
- Using firewall rules to restrict access
- Not exposing it to the public internet
- Using strong Navidrome credentials

## Supported File Formats

### Currently Supported
- **MP3** (ID3v2.4 tags)

### Coming Soon
- **FLAC** (Vorbis comments)
- **M4A/AAC** (iTunes-style tags)
- **OGG** (Vorbis comments)
- **OPUS** (Vorbis comments)

## Troubleshooting

### Tags not updating in Navidrome

1. Check that `MUSIC_LIBRARY_PATH` matches Navidrome's music folder exactly
2. Verify file permissions (service needs write access)
3. Wait for Navidrome scan to complete (check scan status in Navidrome)
4. Check service logs for errors

### "File not found" error

- Ensure `MUSIC_LIBRARY_PATH` is correctly set
- Check that the path is absolute, not relative
- Verify Navidrome can access the same files

### Permission denied

- Run service as user with write access to music folder
- Check file ownership and permissions

## Development

### Project Structure

```
tag-writer-service/
├── server.js          # Main Express server
├── package.json       # Dependencies
├── .env              # Configuration (create from .env.example)
├── .env.example      # Example configuration
├── README.md         # This file
└── uploads/          # Temporary upload folder (auto-created)
```

### Adding Support for New Formats

To add support for FLAC, M4A, or other formats:

1. Install appropriate library (e.g., `flac-metadata` for FLAC)
2. Add format detection in `server.js`
3. Implement tag writing function for that format
4. Update README supported formats list

## License

MIT
