# Music Upload Feature Setup

This guide explains how to set up the music upload feature for Aonsoku.

## Overview

The upload system consists of two parts:
1. **Backend Upload Service** - Node.js microservice handling file uploads and metadata
2. **Frontend Upload UI** - React components integrated into Aonsoku

## Quick Start with Docker

### 1. Start the Upload Service

```bash
cd upload-service
docker-compose up -d
```

Edit the `docker-compose.yml` file to configure:
- Your music library path
- Navidrome URL and credentials

### 2. Configure Aonsoku Frontend

Add to your `.env` file:

```env
VITE_UPLOAD_SERVICE_URL=http://localhost:3001
```

### 3. Access the Upload Page

Navigate to `/upload` in Aonsoku to start uploading music!

## Manual Setup

### Backend Service

1. **Install dependencies:**
```bash
cd upload-service
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=3001
UPLOAD_DIR=/tmp/uploads
MUSIC_LIBRARY_PATH=/path/to/your/music
MAX_FILE_SIZE=104857600
NAVIDROME_URL=http://localhost:4533
NAVIDROME_USERNAME=admin
NAVIDROME_PASSWORD=your_password
```

3. **Start the service:**
```bash
npm start
```

### Frontend Integration

1. **Add upload service URL to environment:**
```bash
echo "VITE_UPLOAD_SERVICE_URL=http://localhost:3001" >> .env
```

2. **Rebuild Aonsoku:**
```bash
npm run build
```

## Features

### 🎵 Automatic Metadata Detection
- Automatically reads ID3 tags from uploaded files
- Supports MP3, FLAC, M4A, OGG, OPUS, WAV, AAC

### ✏️ Metadata Editing
- Edit song title, artist, album, year, track number, genre
- Add album artist and comments
- Changes are written to the file before uploading

### 📦 Batch Upload
- Upload multiple files at once
- Progress tracking for each file
- Automatic library organization by Artist/Album

### 🔄 Navidrome Integration
- Automatically triggers library scan after upload
- Files are immediately available in Navidrome

## File Organization

Uploaded files are organized as:
```
/music/
  Artist Name/
    Album Name/
      Track Title.mp3
```

## API Endpoints

### Health Check
```bash
curl http://localhost:3001/health
```

### Extract Metadata
```bash
curl -X POST http://localhost:3001/api/upload/metadata \
  -F "file=@song.mp3"
```

### Upload File
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "file=@song.mp3" \
  -F 'metadata={"title":"Song Name","artist":"Artist Name"}'
```

### Batch Upload
```bash
curl -X POST http://localhost:3001/api/upload/batch \
  -F "files=@song1.mp3" \
  -F "files=@song2.mp3"
```

## Troubleshooting

### Upload service not connecting
- Verify the service is running: `curl http://localhost:3001/health`
- Check CORS settings if running on different domains
- Ensure `VITE_UPLOAD_SERVICE_URL` is set correctly

### Files not appearing in Navidrome
- Check that `MUSIC_LIBRARY_PATH` matches your Navidrome music folder
- Verify Navidrome credentials in `.env`
- Check Navidrome logs for scan errors
- Manually trigger a scan in Navidrome settings

### Metadata not saving
- Currently, only MP3 files support metadata writing
- For other formats, files are uploaded with existing tags
- Check file permissions in the music directory

### File size limits
- Default limit is 100MB per file
- Adjust `MAX_FILE_SIZE` in `.env` (in bytes)
- Example: 200MB = `MAX_FILE_SIZE=209715200`

## Security Considerations

### For Production Use:

1. **Add authentication** to the upload service
2. **Use HTTPS** for all connections
3. **Restrict file types** to prevent malicious uploads
4. **Set disk quotas** to prevent storage abuse
5. **Use environment variables** for sensitive data (never commit `.env`)
6. **Run behind a reverse proxy** (nginx, traefik)

### Example nginx configuration:

```nginx
location /upload-api/ {
    proxy_pass http://localhost:3001/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    client_max_body_size 100M;
}
```

## Performance Tips

- Increase `MAX_FILE_SIZE` for high-quality FLAC files
- Use SSD storage for faster uploads
- Enable gzip compression in nginx
- Consider using a CDN for the frontend
- Batch process multiple small files together

## Development

### Run in development mode:

```bash
cd upload-service
npm run dev
```

This uses `nodemon` for auto-reload on code changes.

### Add custom metadata fields:

Edit `src/types/upload.ts` to add new fields, then update:
- `MetadataEditor.tsx` - Add form inputs
- `uploadService.ts` - Handle new fields
- Backend `index.js` - Write to ID3 tags

## License

MIT
