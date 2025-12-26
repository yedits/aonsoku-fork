require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configuration
const NAVIDROME_URL = process.env.NAVIDROME_URL || 'http://localhost:4533';
const ADMIN_USER = process.env.NAVIDROME_ADMIN_USER;
const ADMIN_PASSWORD = process.env.NAVIDROME_ADMIN_PASSWORD;
const PORT = process.env.PORT || 3005;

console.log('[AUTH] [Auth Service] Configuration:');
console.log(`[AUTH]   Navidrome URL: ${NAVIDROME_URL}`);
console.log(`[AUTH]   Admin User: ${ADMIN_USER ? '✓ Set' : '✗ Missing'}`);
console.log('[AUTH]');

// Helper function to get Navidrome auth token
async function getNavidromeToken() {
  try {
    console.log('[AUTH] [Auth Service] Attempting to authenticate with Navidrome as admin');
    const response = await axios.post(`${NAVIDROME_URL}/auth/login`, {
      username: ADMIN_USER,
      password: ADMIN_PASSWORD
    });
    console.log('[AUTH] [Auth Service] Successfully authenticated with Navidrome');
    return response.data.token;
  } catch (error) {
    console.error('[AUTH] [Auth Service] Error authenticating with Navidrome:');
    console.error('[AUTH]   Message:', error.response?.data?.message || error.message);
    console.error('[AUTH]   Status:', error.response?.status);
    throw new Error('Failed to authenticate with Navidrome as admin');
  }
}

// Registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    console.log('[AUTH] [Auth Service] Registration request received:', { username, email });

    // Validation
    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        error: 'Username, password, and email are required'
      });
    }

    // Get admin auth token
    const token = await getNavidromeToken();

    // Create user via Navidrome internal API
    console.log('[AUTH] [Auth Service] Creating Navidrome user:', username);
    const userData = {
      userName: username,
      name: username,
      email: email,
      password: password,
      isAdmin: false  // Regular user, not admin
    };

    const response = await axios.post(
      `${NAVIDROME_URL}/api/user`,
      userData,
      {
        headers: {
          'X-ND-Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('[AUTH] [Auth Service] User created successfully:', username);
    return res.json({
      success: true,
      message: 'Account created successfully',
      username: username
    });

  } catch (error) {
    console.error('[AUTH] [Auth Service] Error creating Navidrome user:');
    console.error('[AUTH]   Message:', error.response?.data?.message || error.message);
    console.error('[AUTH]   Status:', error.response?.status);
    
    if (error.response?.status === 409) {
      return res.status(400).json({
        success: false,
        error: 'Username already exists'
      });
    }

    if (error.message.includes('authenticate with Navidrome')) {
      return res.status(500).json({
        success: false,
        error: 'Failed to authenticate with Navidrome. Check admin credentials.'
      });
    }

    return res.status(500).json({
      success: false,
      error: error.response?.data?.message || 'Failed to create user'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    navidromeUrl: NAVIDROME_URL 
  });
});

app.listen(PORT, () => {
  console.log('[AUTH] 🔐 Aonsoku Auth Service');
  console.log(`[AUTH]    Running on port ${PORT}`);
  console.log(`[AUTH]    Navidrome: ${NAVIDROME_URL}`);
  console.log(`[AUTH]    Registration endpoint: http://localhost:${PORT}/api/auth/register`);
  console.log('[AUTH]');
});
