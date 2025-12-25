# 🚀 Upload Feature - Quick Start

## What's New

**Upload to Sidebar** - You'll now see an "Upload" option in the sidebar navigation

**Batch Upload Mode** - Toggle between:
- **Single Mode**: Upload files one-by-one with metadata editing
- **Batch Mode**: Upload entire albums/folders at once

## Setup (5 minutes)

### 1. Pull Latest Changes

```bash
cd /mnt/d/website_2.0/aonsoku-fork
git pull origin testing
```

### 2. Configure Upload Service

Edit `upload-service/.env`:

```env
PORT=3002
UPLOAD_DIR=/tmp/uploads
MUSIC_LIBRARY_PATH=/mnt/d/website_2.0/aonsoku-fork/music
MAX_FILE_SIZE=104857600

NAVIDROME_URL=http://localhost:4533
NAVIDROME_USERNAME=onyx
NAVIDROME_PASSWORD=onyx123
```

### 3. Configure Frontend

Edit `.env` in the main directory:

```env
VITE_UPLOAD_SERVICE_URL=http://localhost:3002
```

### 4. Start Both Services

**Terminal 1 - Upload Service:**
```bash
cd upload-service
npm start
```

**Terminal 2 - Aonsoku:**
```bash
cd ..
npm run dev
```

## Usage

### Upload Single Files

1. Click **Upload** in the sidebar
2. Drag and drop music files
3. Review auto-detected metadata
4. Click **Edit Metadata** to modify tags
5. Click **Upload X Files**

### Upload Full Albums

1. Click **Upload** in the sidebar  
2. **Enable "Batch Upload Mode"** checkbox
3. Select entire folder of music files
4. Files upload all at once with existing metadata
5. Auto-organized by Artist/Album

## Features

✅ **Drag & Drop** - Easy file selection
✅ **Auto Metadata** - Reads existing ID3 tags
✅ **Edit Tags** - Modify before uploading
✅ **Batch Mode** - Upload many files at once
✅ **Progress Tracking** - See upload status
✅ **Smart Organization** - Files sorted by Artist/Album
✅ **Navidrome Sync** - Auto library scan

## File Formats Supported

- MP3 (with metadata editing)
- FLAC
- M4A
- OGG
- OPUS
- WAV
- AAC

## Troubleshooting

**"Upload failed"**
- Check upload service is running on port 3002
- Verify `MUSIC_LIBRARY_PATH` is correct
- Check disk space

**"Translation key missing" in sidebar**
- The app uses i18n - sidebar.upload key may need to be added to translation files
- For now, it will display as "sidebar.upload"
- To fix: Add to your i18n files or update the sidebar.tsx to use plain text

**"Files not in Navidrome"**
- Wait a few seconds for scan
- Check Navidrome credentials in `.env`
- Manually scan in Navidrome settings

## Next Steps

- Configure Navidrome to scan `/mnt/d/website_2.0/aonsoku-fork/music`
- Set up production deployment with Docker
- Add authentication to upload service
- See `README_UPLOAD.md` for full documentation
