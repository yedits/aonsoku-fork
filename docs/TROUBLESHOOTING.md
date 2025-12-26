# Troubleshooting Guide

This guide helps you diagnose and fix common issues with yedits.net.

## Table of Contents

- [YouTube Integration Issues](#youtube-integration-issues)
- [Image Loading Performance](#image-loading-performance)
- [Development Environment](#development-environment)
- [Network Issues](#network-issues)

## YouTube Integration Issues

### YouTube Page Shows "Failed to load YouTube data"

**Symptoms:**
- YouTube page displays an error message
- Console shows API key warnings
- Videos/playlists don't load

**Solution Steps:**

1. **Verify API Key is Set**
   ```bash
   # Check your .env file
   cat .env | grep VITE_YOUTUBE_API_KEY
   ```

   Should show:
   ```
   VITE_YOUTUBE_API_KEY=AIza...your_actual_key
   ```

2. **Ensure API Key is Valid**
   - Not `your_youtube_api_key_here`
   - Not empty or missing
   - Copied correctly from Google Cloud Console

3. **Check Browser Console**
   Open DevTools (F12) and look for:
   ```
   [YouTube] Service initialized with API key
   ```

   If you see:
   ```
   [YouTube] API key not configured
   ```
   The environment variable isn't loading.

4. **Restart Development Server**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart
   npm run dev
   ```

   **Important:** Vite only loads environment variables at startup. Changes to `.env` require a restart.

5. **Clear Browser Cache**
   - Hard reload: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or clear site data in DevTools

6. **Verify API Key Permissions**
   In Google Cloud Console:
   - YouTube Data API v3 is **enabled**
   - API key has proper **restrictions** (HTTP referrers)
   - Quota hasn't been exceeded

7. **Test API Key Directly**
   ```bash
   # Replace YOUR_API_KEY with your actual key
   curl "https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=YeditsCommunity&key=YOUR_API_KEY"
   ```

   Should return JSON with channel info, not an error.

### YouTube Videos Load But Show Wrong Content

**Solution:**
- Clear localStorage cache:
  ```javascript
  // In browser console (F12)
  localStorage.removeItem('youtube_cache')
  localStorage.removeItem('youtube_cache_time')
  location.reload()
  ```

### API Quota Exceeded

**Symptoms:**
- Error: "quotaExceeded"
- YouTube features stop working

**Solution:**
- Wait 24 hours (quota resets daily at midnight Pacific Time)
- Check usage: [Google Cloud Console → APIs & Services → Quotas](https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas)
- Free tier: 10,000 units/day
- Caching reduces usage by 90%

## Image Loading Performance

### Album/Artist Images Load Slowly

**Recent Fix Applied:**
- URL caching implemented in `httpClient.ts`
- Authentication parameters now cached per image
- Should significantly improve performance

**If Still Slow:**

1. **Check Network Tab**
   - Open DevTools → Network tab
   - Filter by "Img"
   - Look for:
     - Many requests to same image?
     - Slow server responses?
     - Large file sizes?

2. **Verify Navidrome is Running**
   ```bash
   curl http://localhost:4533/ping
   ```

3. **Check Navidrome Performance**
   - Is Navidrome scanning library?
   - Large music library?
   - Slow disk I/O?

4. **Clear Browser Cache**
   Images might be cached incorrectly.

### Images Don't Load At All

**Check:**

1. **Authentication**
   - Are you logged in?
   - Check console for 401/403 errors

2. **CORS Issues**
   - Check console for CORS errors
   - Verify `VITE_API_URL` in `.env` matches Navidrome URL

3. **Navidrome Configuration**
   - Navidrome has access to music folder
   - Cover art files exist

## Development Environment

### Changes to .env Not Reflecting

**Solution:**
```bash
# Always restart after .env changes
Ctrl+C  # Stop server
npm run dev  # Restart
```

### Service Not Starting

**Port Already in Use:**
```bash
# Find what's using port 3000
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or change port in .env
PORT=3001
```

### "Module not found" Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Network Issues

### Cannot Connect to Navidrome

1. **Verify Navidrome is Running**
   ```bash
   curl http://localhost:4533/rest/ping
   ```

2. **Check URL in .env**
   ```env
   VITE_API_URL=http://localhost:4533
   NAVIDROME_URL=http://localhost:4533
   ```

3. **Firewall/Network**
   - Localhost blocked?
   - VPN interfering?
   - Docker networking issues?

### CORS Errors

**Symptoms:**
```
Access to fetch at 'http://localhost:4533' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solution:**

Add to Navidrome config:
```
ND_CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Debug Mode

### Enable Verbose Logging

**Browser Console:**
```javascript
// See all YouTube API calls
localStorage.setItem('debug', 'youtube')
location.reload()
```

**Check Logs:**
- Browser console (F12)
- Network tab for API calls
- Terminal where `npm run dev` is running

### Useful Console Commands

```javascript
// Check environment variables
import.meta.env

// Check YouTube service state
import { youtubeService } from '@/service/youtube'
youtubeService.getChannelInfo()

// Clear all caches
localStorage.clear()
sessionStorage.clear()
location.reload()
```

## Getting Help

If issues persist:

1. **Check Console Logs**
   - Browser DevTools (F12) → Console tab
   - Look for `[YouTube]` prefixed messages
   - Copy any error messages

2. **Check Network Tab**
   - Failed requests?
   - Status codes?
   - Response bodies?

3. **Verify Configuration**
   ```bash
   # Check .env file exists
   ls -la .env
   
   # Check Navidrome is reachable
   curl http://localhost:4533/rest/ping
   
   # Check services are running
   lsof -i :3000,3001,3002
   ```

4. **Create an Issue**
   Include:
   - Error messages from console
   - Steps to reproduce
   - Environment (OS, Node version)
   - Whether YouTube API key is configured

## Recent Fixes (Dec 26, 2025)

### Changes Made:

1. **YouTube Service**
   - Added API key validation
   - Better error messages
   - Console logging with `[YouTube]` prefix
   - Throws clear errors when API key missing

2. **Image Loading**
   - Implemented URL caching in `httpClient.ts`
   - Auth params no longer regenerated per image
   - Cache clears on login/logout
   - Should improve performance significantly

3. **.env.example**
   - Updated branding from "Aonsoku" to "yedits.net"
   - Clarified YouTube API key setup

### Testing the Fixes:

```bash
# Pull latest changes
git pull origin testing

# Restart development server
npm run dev

# Check browser console for:
[YouTube] Service initialized with API key
[httpClient] Cover art cache cleared
```