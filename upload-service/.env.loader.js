// Loads environment variables from parent .env file
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load from parent directory's .env
config({ path: join(__dirname, '..', '.env') });

// Map prefixed variables to expected names
process.env.PORT = process.env.UPLOAD_PORT || '3002';
process.env.UPLOAD_DIR = process.env.UPLOAD_DIR || '/tmp/uploads';
process.env.MUSIC_LIBRARY_PATH = process.env.UPLOAD_MUSIC_PATH || '/music';
process.env.MAX_FILE_SIZE = process.env.UPLOAD_MAX_FILE_SIZE || '104857600';

// Also set Navidrome variables
process.env.NAVIDROME_URL = process.env.NAVIDROME_URL || 'http://localhost:4533';
process.env.NAVIDROME_USERNAME = process.env.NAVIDROME_USERNAME || '';
process.env.NAVIDROME_PASSWORD = process.env.NAVIDROME_PASSWORD || '';
