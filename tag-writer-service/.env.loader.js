// Loads environment variables from parent .env file
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load from parent directory's .env
config({ path: join(__dirname, '..', '.env') });

// Map prefixed variables to expected names
process.env.PORT = process.env.TAG_WRITER_PORT || '3001';
process.env.MUSIC_LIBRARY_PATH = process.env.TAG_WRITER_MUSIC_PATH || '';
process.env.CORS_ORIGINS = process.env.TAG_WRITER_CORS_ORIGINS || 'http://localhost:3000';

// Also set Navidrome variables
process.env.NAVIDROME_URL = process.env.NAVIDROME_URL || 'http://localhost:4533';
process.env.NAVIDROME_USERNAME = process.env.NAVIDROME_USERNAME || '';
process.env.NAVIDROME_PASSWORD = process.env.NAVIDROME_PASSWORD || '';
