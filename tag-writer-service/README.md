# Navidrome Tag Writer Service

A Node.js backend service that writes ID3 tags to music files and triggers Navidrome rescans automatically.

## Features

- ✅ Write ID3v2.4 tags to MP3 files using `node-id3`
- ✅ Update metadata: title, artist, album, year, genre, track#, disc#, composer, BPM, lyrics
- ✅ Update cover art (JPEG, PNG, WebP)
- ✅ Automatically trigger Navidrome library rescan after updates
- ✅ CORS support for frontend integration
- ✅ File validation and error handling

## Installation

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

4. **Edit `.env` file:**
   ```env
   PORT=3001
   NAVIDROME_URL=http://localhost:4533
   NAVIDROME_USERNAME=your_username
   NAVIDROME_PASSWORD=your_password
   MUSIC_LIBRARY_PATH=/path/to/your/music
   CORS_ORIGINS=http://localhost:3000
   ```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

### Update Song Metadata
**POST** `/api/update-tags`

```json
{
  "songId": "navidrome-song-id",
  "metadata": {
    "title": "New Title",
    "artist": "New Artist",
    "album": "New Album",
    "albumArtist": "Album Artist",
    "year": 2025,
    "genre": "Rock",
    "track": 1,
    "disc": 1,
    "composer": "Composer Name",
    "bpm": 120,
    "comment": "Comments here",
    "lyrics": "Song lyrics here"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tags updated successfully",
  "path": "Artist/Album/01 - Song.mp3"
}
```

### Update Cover Art
**POST** `/api/update-cover-art`

**Form Data:**
- `songId`: Navidrome song ID
- `coverArt`: Image file (JPEG, PNG, WebP)

**Response:**
```json
{
  "success": true,
  "message": "Cover art updated successfully"
}
```

### Get Current Tags
**GET** `/api/get-tags/:songId`

**Response:**
```json
{
  "success": true,
  "tags": {
    "title": "Song Title",
    "artist": "Artist Name",
    ...
  },
  "path": "Artist/Album/01 - Song.mp3"
}
```

### Trigger Manual Rescan
**POST** `/api/rescan`

**Response:**
```json
{
  "success": true,
  "message": "Rescan triggered"
}
```

### Health Check
**GET** `/health`

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

## Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t navidrome-tag-writer .
docker run -d \
  -p 3001:3001 \
  -v /path/to/music:/music \
  -e NAVIDROME_URL=http://navidrome:4533 \
  -e NAVIDROME_USERNAME=admin \
  -e NAVIDROME_PASSWORD=yourpassword \
  -e MUSIC_LIBRARY_PATH=/music \
  --name tag-writer \
  navidrome-tag-writer
```

## Docker Compose

Add to your `docker-compose.yml`:

```yaml
services:
  navidrome:
    image: deluan/navidrome:latest
    ports:
      - "4533:4533"
    volumes:
      - ./data:/data
      - /path/to/music:/music
    environment:
      ND_SCANSCHEDULE: "@every 1m"
  
  tag-writer:
    build: ./tag-writer-service
    ports:
      - "3001:3001"
    volumes:
      - /path/to/music:/music
    environment:
      - NAVIDROME_URL=http://navidrome:4533
      - NAVIDROME_USERNAME=admin
      - NAVIDROME_PASSWORD=yourpassword
      - MUSIC_LIBRARY_PATH=/music
      - CORS_ORIGINS=http://localhost:3000
    depends_on:
      - navidrome
```

## Important Notes

1. **File Access**: The service must have read/write access to the music library path
2. **Path Matching**: `MUSIC_LIBRARY_PATH` must match Navidrome's music folder mount
3. **Permissions**: Ensure the service runs with appropriate file permissions
4. **Backups**: Always backup your music library before bulk tag editing
5. **Rescan**: Automatic rescans are triggered after each tag update

## Troubleshooting

### "Music file not found on disk"
- Check that `MUSIC_LIBRARY_PATH` is correctly set
- Verify the path matches Navidrome's music folder
- Ensure the service has read/write permissions

### "Failed to trigger Navidrome rescan"
- Verify `NAVIDROME_URL` is accessible
- Check Navidrome credentials are correct
- Ensure Navidrome API is enabled

### Tags not updating in Navidrome
- Wait for the rescan to complete (check Navidrome logs)
- Manually trigger a rescan from Navidrome UI
- Check file permissions

## License

MIT
