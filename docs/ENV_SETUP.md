# Environment Setup Guide

After the unified `.env` configuration changes, all services now use a single `.env` file in the root directory.

## Quick Start

```bash
# 1. Create .env from template
cp .env.example .env

# 2. Edit .env with your values
nano .env  # or use your preferred editor

# 3. Verify configuration
node check-env.js

# 4. Start all services
npm run dev
```

## Important: Vite Environment Variables

### The Problem

Vite (the frontend bundler) only exposes environment variables that start with `VITE_` to your browser code. This is a **security feature** to prevent accidental exposure of backend secrets.

### What This Means

In your `.env` file:

```env
# ✅ These work in the frontend (browser)
VITE_YOUTUBE_API_KEY=AIza...your_key
VITE_API_URL=http://localhost:4533
VITE_SERVER_URL=http://localhost:4533

# ❌ These do NOT work in the frontend
NAVIDROME_URL=http://localhost:4533  # Backend only
NAVIDROME_USERNAME=admin              # Backend only
NAVIDROME_PASSWORD=secret             # Backend only
```

### How to Access in Code

**Frontend (React/TypeScript):**
```typescript
// ✅ Correct - uses VITE_ prefix
const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

// ❌ Wrong - won't work (undefined)
const username = import.meta.env.NAVIDROME_USERNAME;
```

**Backend Services:**
```javascript
// ✅ Correct - loaded via .env.loader.cjs
const username = process.env.NAVIDROME_USERNAME;
const apiUrl = process.env.VITE_API_URL;  // Also available here
```

## Troubleshooting

### YouTube Not Working

**Symptom:** "Failed to load YouTube data. Please check your API key."

**Checklist:**

1. **API Key in .env?**
   ```bash
   grep VITE_YOUTUBE_API_KEY .env
   ```
   Should show: `VITE_YOUTUBE_API_KEY=AIza...`

2. **Not Default Value?**
   - Not `your_youtube_api_key_here`
   - Not empty

3. **Dev Server Restarted?**
   ```bash
   # Stop with Ctrl+C, then:
   npm run dev
   ```
   **Critical:** Vite only loads `.env` at startup!

4. **Check Browser Console**
   Open DevTools (F12), Console tab:
   ```
   [YouTube] Service initialized with API key  ✅ Good
   [YouTube] API key not configured            ❌ Bad
   ```

5. **Verify in Browser**
   In browser console (F12):
   ```javascript
   import.meta.env.VITE_YOUTUBE_API_KEY
   ```
   Should show your key, not `undefined`

### Images Not Loading

**Symptom:** Album/artist images show as broken or load very slowly

**Causes:**

1. **Not Logged In**
   - Images require authentication
   - Check you're logged into Navidrome

2. **Wrong Navidrome URL**
   ```env
   VITE_API_URL=http://localhost:4533  # Must match where Navidrome runs
   ```

3. **Navidrome Not Running**
   ```bash
   curl http://localhost:4533/rest/ping
   ```

4. **CORS Issues**
   Add to Navidrome config:
   ```
   ND_CORS_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

### Changes Not Taking Effect

**Always restart after `.env` changes:**

```bash
# 1. Stop server
Ctrl+C

# 2. Verify .env
node check-env.js

# 3. Clear browser cache (optional but recommended)
# Hard reload: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

# 4. Restart server
npm run dev
```

## Environment Variable Reference

### Frontend Variables (VITE_*)

These are exposed to the browser and used by the React app:

| Variable | Required | Description | Example |
|----------|----------|-------------|----------|
| `VITE_YOUTUBE_API_KEY` | Yes* | YouTube Data API v3 key | `AIzaSyB...` |
| `VITE_API_URL` | Yes | Navidrome server URL | `http://localhost:4533` |
| `VITE_SERVER_URL` | Yes | Navidrome server URL | `http://localhost:4533` |
| `VITE_TAG_WRITER_URL` | Yes | Tag writer service URL | `http://localhost:3001` |
| `VITE_UPLOAD_SERVICE_URL` | Yes | Upload service URL | `http://localhost:3002` |
| `VITE_ACCOUNT_API_URL` | No | Auth service URL (not implemented yet) | `http://localhost:3005/api` |
| `PORT` | No | Frontend dev server port | `3000` |

*Required only if using YouTube features

### Backend Variables

These are used by backend Node.js services and NOT exposed to the browser:

| Variable | Service | Description |
|----------|---------|-------------|
| `NAVIDROME_URL` | All | Navidrome server URL |
| `NAVIDROME_USERNAME` | All | Navidrome admin username |
| `NAVIDROME_PASSWORD` | All | Navidrome admin password |
| `TAG_WRITER_PORT` | Tag Writer | Service port (default: 3001) |
| `TAG_WRITER_MUSIC_PATH` | Tag Writer | Path to music library |
| `TAG_WRITER_CORS_ORIGINS` | Tag Writer | Allowed CORS origins |
| `UPLOAD_PORT` | Upload | Service port (default: 3002) |
| `UPLOAD_DIR` | Upload | Temporary upload directory |
| `UPLOAD_MUSIC_PATH` | Upload | Destination for uploads |
| `UPLOAD_MAX_FILE_SIZE` | Upload | Max file size in bytes |

## Getting a YouTube API Key

1. **Go to Google Cloud Console**
   https://console.cloud.google.com/

2. **Create/Select Project**
   - Click "Select a project" → "New Project"
   - Name it (e.g., "yedits-youtube")

3. **Enable YouTube Data API v3**
   - APIs & Services → Library
   - Search "YouTube Data API v3"
   - Click "Enable"

4. **Create API Key**
   - APIs & Services → Credentials
   - Create Credentials → API Key
   - Copy the key

5. **Restrict the Key (Recommended)**
   - Edit API key
   - Application restrictions → HTTP referrers
   - Add: `http://localhost:3000/*` and `http://localhost:5173/*`
   - API restrictions → Restrict key
   - Select "YouTube Data API v3"
   - Save

6. **Add to .env**
   ```env
   VITE_YOUTUBE_API_KEY=AIzaSyB...your_key_here
   ```

7. **Restart Dev Server**
   ```bash
   # Critical step!
   npm run dev
   ```

## Testing Your Setup

### Run Diagnostics

```bash
node check-env.js
```

This will show:
- Which variables are set
- Which are missing
- Which have default/placeholder values

### Test Each Service

**Frontend (Vite):**
```bash
npm run dev
# Visit http://localhost:3000
# Open browser console (F12)
# Look for: [YouTube] Service initialized with API key
```

**Tag Writer Service:**
```bash
cd tag-writer-service
node server.js
# Should start on port 3001
```

**Upload Service:**
```bash
cd upload-service
node server.js
# Should start on port 3002
```

**All Services at Once:**
```bash
npm run dev:all
```

## Common Mistakes

### ❌ Forgetting VITE_ Prefix

```env
# Wrong
YOUTUBE_API_KEY=AIza...

# Correct
VITE_YOUTUBE_API_KEY=AIza...
```

### ❌ Not Restarting Server

```bash
# You edit .env but don't restart
# Changes won't be loaded!

# Must do:
Ctrl+C
npm run dev
```

### ❌ Using process.env in Frontend

```typescript
// Wrong - won't work in browser
const key = process.env.VITE_YOUTUBE_API_KEY;

// Correct
const key = import.meta.env.VITE_YOUTUBE_API_KEY;
```

### ❌ Committing .env to Git

```bash
# .env should be in .gitignore
# Never commit it!

# If you accidentally did:
git rm --cached .env
git commit -m "Remove .env from git"
```

## Migration from Old Setup

If you had separate `.env` files before:

### Old Structure
```
.env.local              # Frontend vars
tag-writer-service/.env # Tag writer vars  
upload-service/.env     # Upload vars
```

### New Structure (Unified)
```
.env                    # All vars in one file!
```

### Migration Steps

1. **Backup old files** (just in case)
   ```bash
   cp .env.local .env.local.backup
   cp tag-writer-service/.env tag-writer-service/.env.backup
   cp upload-service/.env upload-service/.env.backup
   ```

2. **Create new .env**
   ```bash
   cp .env.example .env
   ```

3. **Copy values from old files**
   - Frontend values from `.env.local`
   - Tag writer values (with `TAG_WRITER_` prefix)
   - Upload values (with `UPLOAD_` prefix)

4. **Test**
   ```bash
   node check-env.js
   npm run dev
   ```

5. **Delete old files**
   ```bash
   rm .env.local
   rm tag-writer-service/.env
   rm upload-service/.env
   ```

## Need Help?

If problems persist:

1. Run diagnostics: `node check-env.js`
2. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
3. Look at browser console (F12) for error messages
4. Check GitHub Issues
