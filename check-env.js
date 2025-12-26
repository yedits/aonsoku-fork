#!/usr/bin/env node

// Quick script to check if environment variables are properly configured
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

console.log('🔍 Environment Configuration Checker\n');

// Check if .env exists
if (!fs.existsSync(envPath)) {
  console.error('❌ ERROR: .env file not found!');
  console.log('\nPlease create .env from .env.example:');
  console.log('  cp .env.example .env');
  process.exit(1);
}

console.log('✅ .env file exists\n');

// Read and parse .env
const envContent = fs.readFileSync(envPath, 'utf-8');
const lines = envContent.split('\n');

const variables = {
  // Frontend (Vite)
  'VITE_YOUTUBE_API_KEY': null,
  'VITE_API_URL': null,
  'VITE_SERVER_URL': null,
  'PORT': null,
  
  // Backend services
  'NAVIDROME_URL': null,
  'NAVIDROME_USERNAME': null,
  'NAVIDROME_PASSWORD': null,
  'TAG_WRITER_PORT': null,
  'UPLOAD_PORT': null,
};

lines.forEach(line => {
  line = line.trim();
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=');
    if (key && variables.hasOwnProperty(key.trim())) {
      variables[key.trim()] = value || '';
    }
  }
});

// Check each variable
console.log('📋 Configuration Status:\n');

let hasErrors = false;

Object.entries(variables).forEach(([key, value]) => {
  const prefix = key.startsWith('VITE_') ? '[Frontend]' : '[Backend] ';
  
  if (value === null) {
    console.log(`${prefix} ${key}: ⚠️  NOT SET`);
    if (key === 'VITE_YOUTUBE_API_KEY') {
      hasErrors = true;
    }
  } else if (!value || value === '' || value === 'your_youtube_api_key_here') {
    console.log(`${prefix} ${key}: ⚠️  EMPTY OR DEFAULT VALUE`);
    if (key === 'VITE_YOUTUBE_API_KEY') {
      hasErrors = true;
    }
  } else {
    // Mask sensitive values
    let displayValue = value;
    if (key.includes('PASSWORD') || key.includes('API_KEY') || key.includes('SECRET')) {
      displayValue = value.substring(0, 10) + '...';
    }
    console.log(`${prefix} ${key}: ✅ ${displayValue}`);
  }
});

if (hasErrors) {
  console.log('\n❌ YouTube API Key Issues Detected!');
  console.log('\nTo fix:');
  console.log('1. Get API key from: https://console.cloud.google.com/');
  console.log('2. Enable YouTube Data API v3');
  console.log('3. Add to .env: VITE_YOUTUBE_API_KEY=your_actual_key');
  console.log('4. Restart dev server: npm run dev');
}

console.log('\n💡 Important Notes:');
console.log('- After changing .env, you MUST restart the dev server');
console.log('- Vite only loads VITE_* variables to the frontend');
console.log('- Backend services load all variables via .env.loader.cjs');
console.log('\nTo test if changes are applied:');
console.log('- Stop server (Ctrl+C)');
console.log('- Run: node check-env.js');
console.log('- Start server: npm run dev');
console.log('- Check browser console for: [YouTube] Service initialized');
