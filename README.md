# Aonsoku

A modern desktop and web client for Navidrome/Subsonic music servers with advanced features including music upload, YouTube integration, and comprehensive media management.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Feature Guides](#feature-guides)
  - [Music Upload System](#music-upload-system)
  - [YouTube Integration](#youtube-integration)
- [Development](#development)
- [Docker Deployment](#docker-deployment)
- [macOS Users](#macos-users)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Features

### Core Features
- Modern web and desktop client for Subsonic-compatible servers
- Support for Navidrome, Subsonic, and LMS servers
- Responsive design for all screen sizes
- Dark/light theme support
- Internet radio streaming
- Comprehensive playlist management
- Advanced search and filtering
- Keyboard shortcuts

### Music Upload System
- Drag and drop music file upload
- Automatic metadata detection from ID3 tags
- In-browser metadata editor
- Batch upload support
- Real-time upload progress tracking
- Automatic file organization by Artist/Album
- Supported formats: MP3, FLAC, M4A, OGG, OPUS, WAV, AAC
- Automatic Navidrome library scanning after upload

### YouTube Integration
- Browse YouTube channel videos and playlists
- Advanced search and filtering
- Sort by date, views, likes, comments, or duration
- Filter by time period and video length
- Statistics dashboard with channel metrics
- Grid and list view modes
- Split-screen video player with side panel
- Threaded comments with collapsible replies
- Smart caching (1-hour local storage)
- Trending badges for popular videos

## Installation

### Prerequisites
- Node.js 16+ and npm
- A running Navidrome or Subsonic-compatible server

### Setup

1. Clone the repository:
```bash
git clone https://github.com/onyxdagoat1/aonsoku-fork.git
cd aonsoku-fork
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (see [Configuration](#configuration)):
```bash
cp .env.example .env
# Edit .env with your settings
```

## Configuration

Copy `.env.example` to `.env` and configure the following variables:

### Core Application Settings

| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `PORT` | `8080` | Application port | No |
| `VITE_API_URL` | - | Navidrome/Subsonic server URL (e.g., `http://localhost:4533`) | Yes |
| `SERVER_URL` | - | Predefined server URL for automatic login | No |
| `HIDE_SERVER` | `false` | Hide server URL field on login page | No |
| `APP_USER` | - | Username for automatic login | No |
| `APP_PASSWORD` | - | Password for automatic login | No |
| `APP_AUTH_TYPE` | `token` | Authentication method: `token` or `password` | No |
| `SERVER_TYPE` | `subsonic` | Server type: `subsonic`, `navidrome`, or `lms` | No |
| `HIDE_RADIOS_SECTION` | `false` | Hide internet radios from sidebar | No |

### Optional Services

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_TAG_WRITER_URL` | - | Tag writer service URL (e.g., `http://localhost:3001`) |
| `VITE_UPLOAD_SERVICE_URL` | - | Upload service URL (e.g., `http://localhost:3002`) |
| `VITE_YOUTUBE_API_KEY` | - | YouTube Data API v3 key for YouTube integration |

### Upload Service Configuration

If using the music upload feature, configure `upload-service/.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Upload service port |
| `UPLOAD_DIR` | `/tmp/uploads` | Temporary upload directory |
| `MUSIC_LIBRARY_PATH` | `/music` | Navidrome music folder path |
| `MAX_FILE_SIZE` | `104857600` | Maximum file size in bytes (100MB) |
| `NAVIDROME_URL` | `http://localhost:4533` | Navidrome server URL |
| `NAVIDROME_USERNAME` | - | Navidrome admin username |
| `NAVIDROME_PASSWORD` | - | Navidrome admin password |

### Security Notes

**Automatic Login**: Only use `APP_USER` and `APP_PASSWORD` in secure local environments to prevent password compromise.

**YouTube API Key**: Always restrict your API key:
1. Go to Google Cloud Console
2. Set HTTP referrer restrictions (e.g., `http://localhost:*`, `https://yourdomain.com/*`)
3. Restrict to YouTube Data API v3 only
4. Never commit API keys to version control

## Running the Application

### Web Application

```bash
npm run dev
```

Access at `http://localhost:3000`

### Desktop Application

```bash
npm run electron:dev
```

### With Upload Service

**Terminal 1 - Upload Service:**
```bash
cd upload-service
npm install
npm start
```

**Terminal 2 - Main Application:**
```bash
npm run dev
```

### Production Build

**Web:**
```bash
npm run build
npm run preview
```

**Desktop:**
```bash
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## Feature Guides

### Music Upload System

#### Quick Start

1. Start the upload service (see [Running the Application](#running-the-application))
2. Navigate to the Upload page in the sidebar
3. Drag and drop music files or click to browse
4. Review auto-detected metadata
5. Click "Edit Metadata" to modify tags if needed
6. Click "Upload" to transfer files to your Navidrome server

#### Batch Upload Mode

Enable "Batch Upload Mode" to upload entire albums or folders at once without individual metadata editing:

1. Toggle "Batch Upload Mode" checkbox
2. Select multiple files or entire folders
3. Files upload with existing metadata
4. Automatically organized by Artist/Album structure

#### File Organization

Files are automatically organized in your music library:

```
/music/
  Artist Name/
    Album Name/
      01 - Track Title.mp3
      02 - Another Track.mp3
    Another Album/
      ...
  Another Artist/
    ...
```

#### Docker Deployment

Use the provided docker-compose.yml:

```bash
cd upload-service
docker-compose up -d
```

Edit `upload-service/docker-compose.yml` to configure environment variables.

### YouTube Integration

#### Setup

1. Get a YouTube Data API v3 key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project and enable YouTube Data API v3
   - Create credentials (API key)
   - Restrict the API key (see [Security Notes](#security-notes))

2. Add the key to `.env`:
```env
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
```

3. Navigate to Library > YouTube in the application

#### Features

**Search and Filter:**
- Real-time search by title or description
- Sort by: Latest, Most Viewed, Most Liked, Most Comments, Duration, Title
- Time filters: All Time, This Week, This Month, This Year, Popular (10K+ views)
- Duration filters: Any Length, Short (<4 min), Medium (4-20 min), Long (>20 min)

**View Modes:**
- Grid View: 2-6 columns based on screen size
- List View: Single column with detailed cards

**Video Player:**
- Split-screen layout with video on left
- Side panel with Description and Comments tabs
- Collapsible comment threads
- Formatted timestamps and user avatars

**Statistics Dashboard:**
- Total videos and playlists
- Aggregate views, likes, and comments
- Average metrics per video
- Manual refresh button

**Performance:**
- 1-hour local caching (saves 90% of API quota)
- Client-side filtering (no extra API calls)
- Lazy loading for comments

#### API Quota

YouTube Data API v3 is completely free with 10,000 quota units per day (default).

**Usage with caching:**
- Initial page load: ~104 units
- Cached loads: 0 units
- Daily capacity: ~96-240 loads/day

**Adjust cache duration** in `src/app/pages/youtube/index.tsx`:
```typescript
const cacheExpiry = 6 * 60 * 60 * 1000; // 6 hours instead of 1
```

#### Changing Channel

Edit `src/service/youtube.ts`:
```typescript
const CHANNEL_HANDLE = 'YourChannelName';
// or
const CHANNEL_ID = 'UCxxxxxxxxxxxxxx';
```

## Development

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Biome.js](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) extension

### Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run linter
npm run lint:fix         # Fix linting issues
npm run lint:format      # Format code
npm run test             # Run tests
npm run electron:dev     # Start electron in dev mode
npm run electron:build   # Build electron app
```

### Technology Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Desktop**: Electron
- **Backend Services**: Node.js, Express

## Docker Deployment

### Main Application

```yaml
version: '3.8'

services:
  aonsoku:
    container_name: aonsoku
    image: ghcr.io/victoralvesf/aonsoku:latest
    restart: unless-stopped
    ports:
      - 8080:8080
    environment:
      - SERVER_URL=http://your-navidrome:4533
      - VITE_UPLOAD_SERVICE_URL=http://upload-service:3001
```

### Podman Quadlet

```ini
[Unit]
Description=Aonsoku Container

[Container]
ContainerName=aonsoku
Image=ghcr.io/victoralvesf/aonsoku:latest
PublishPort=8080:8080
AutoUpdate=registry

[Service]
Restart=always

[Install]
WantedBy=multi-user.target default.target
```

## macOS Users

### "App cannot be opened" or Crash on Launch

Since this application is not signed and notarized by Apple, macOS Gatekeeper may block it.

**Solution:**

1. Move Aonsoku to `/Applications` folder

2. Open Terminal and run:
```bash
# Remove quarantine attribute
sudo xattr -cr /Applications/Aonsoku.app

# Re-sign the application locally
sudo codesign --force --deep --sign - /Applications/Aonsoku.app
```

3. Launch Aonsoku normally

## Troubleshooting

### Upload Service Issues

**Service won't start:**
- Check if port 3001 is already in use
- Verify Docker is running (if using Docker)
- Check logs: `docker logs aonsoku-upload`

**Files not appearing in Navidrome:**
- Verify `MUSIC_LIBRARY_PATH` matches Navidrome's music folder
- Check Navidrome has read/write permissions
- Manually trigger scan in Navidrome settings
- Check Navidrome logs for errors

**Metadata not saving:**
- Only MP3 files support metadata writing currently
- Check file isn't read-only
- Verify sufficient disk space

**CORS errors:**
- Ensure `VITE_UPLOAD_SERVICE_URL` is correct
- Check upload service is running
- Verify CORS is enabled in upload service

### YouTube Integration Issues

**"Invalid API key" error:**
- Verify API key is correct in `.env`
- Check YouTube Data API v3 is enabled in Google Cloud Console
- Ensure API key restrictions allow your domain

**Videos not loading:**
- Check browser console for errors
- Verify API quota hasn't been exceeded
- Clear browser cache and try again

**Translation key missing in sidebar:**
- The app uses i18n - `sidebar.upload` key may need to be added
- To fix: Add to i18n files or update sidebar component to use plain text

### General Issues

**Cannot connect to Navidrome:**
- Verify `VITE_API_URL` is correct
- Check Navidrome server is running
- Verify network connectivity
- Check CORS settings in Navidrome

**Desktop app won't start:**
- Check system requirements (Node.js 16+)
- Try rebuilding: `npm run electron:build`
- Check console for error messages

## License

MIT License - see [LICENSE.txt](LICENSE.txt)

## Credits

- Original Aonsoku by [Victor Alves](https://github.com/victoralvesf/aonsoku)
- Integrates with [Navidrome](https://www.navidrome.org/)
- Uses [music-metadata](https://github.com/Borewit/music-metadata) for tag reading
- Uses [node-id3](https://github.com/Zazama/node-id3) for tag writing
- YouTube integration via [YouTube Data API v3](https://developers.google.com/youtube/v3)

## Repository

https://github.com/onyxdagoat1/aonsoku-fork
