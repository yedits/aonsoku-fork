# YouTube Integration Setup

This guide explains how to set up YouTube integration for the YeditsCommunity channel.

## Features

- Display all videos from YeditsCommunity channel
- Browse channel playlists
- Embedded video player
- View video descriptions and metadata
- Read and display comments with replies
- Responsive grid layout

## Setup Instructions

### 1. Get a YouTube Data API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

### 2. Configure the Application

1. Create a `.env` file in the root directory (if it doesn't exist)
2. Add your YouTube API key:
   ```
   VITE_YOUTUBE_API_KEY=your_api_key_here
   ```
3. Restart your development server

### 3. Update Channel ID (Optional)

The app is configured for the YeditsCommunity channel by default. To use a different channel:

1. Open `src/service/youtube.ts`
2. Find the `CHANNEL_ID` constant
3. Replace it with your channel ID

To find a channel ID:
- Go to the channel's page on YouTube
- View the page source (Ctrl+U)
- Search for "channelId" or "externalId"

## Usage

1. Navigate to `/library/youtube` in the app
2. Browse videos and playlists
3. Click on any video to:
   - Watch the video in an embedded player
   - Read the description
   - View comments and replies
4. Click on playlists to see all videos in that playlist

## API Quota Limits

YouTube Data API has daily quota limits:
- Each request costs quota units
- Default quota: 10,000 units per day
- Typical costs:
  - List videos: ~100 units per 50 videos
  - Get comments: ~5 units per 100 comments
  - List playlists: ~1 unit

If you exceed the quota, the API will return an error. Consider:
- Caching responses locally
- Reducing `maxResults` parameters
- Implementing pagination instead of loading all at once

## Troubleshooting

### "YouTube API key not configured"
- Make sure `.env` file exists in the root directory
- Verify the variable is named exactly `VITE_YOUTUBE_API_KEY`
- Restart your development server after adding the key

### No videos/playlists showing
- Check browser console for API errors
- Verify your API key is valid
- Ensure YouTube Data API v3 is enabled in Google Cloud Console
- Check if you've exceeded your daily quota

### Comments not loading
- Some videos have comments disabled
- Check if the video allows comments on YouTube
- Verify your API key has proper permissions

## Security Notes

- **Never commit your API key to version control**
- The `.env` file is already in `.gitignore`
- For production, use environment variables instead of `.env` files
- Consider implementing server-side proxying for better security
- Restrict your API key to specific domains in Google Cloud Console

## Future Improvements

- Add infinite scroll/pagination
- Implement local caching
- Add search functionality
- Support for multiple channels
- Video upload integration
- Live stream support
