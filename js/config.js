/**
 * ─────────────────────────────────────────────────────────
 *  CertiLink — Configuration
 *  Edit this file with your own Google Cloud credentials.
 * ─────────────────────────────────────────────────────────
 *
 *  HOW TO GET YOUR CLIENT ID:
 *  1. Go to https://console.cloud.google.com/
 *  2. Create a project (or select existing)
 *  3. APIs & Services → Enable API → Enable "Google Drive API"
 *  4. APIs & Services → OAuth consent screen
 *     - User type: External
 *     - Add scopes: drive.file, userinfo.email, userinfo.profile
 *  5. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
 *     - Application type: Web application
 *     - Authorized JavaScript origins: https://YOUR_GITHUB_USERNAME.github.io
 *     - Also add: http://localhost:5500 (for local dev)
 *  6. Copy the Client ID (ends in .apps.googleusercontent.com)
 *  7. Paste it below ↓
 */

const CONFIG = {
  // ← PASTE YOUR GOOGLE OAUTH CLIENT ID HERE
  CLIENT_ID: '165826842046-0k618s6kuvc3olmat8aj1gru0t87p62b.apps.googleusercontent.com',

  // Scopes needed — DO NOT change
  SCOPES: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ].join(' '),

  // The Drive folder where certificates are stored
  DRIVE_FOLDER_NAME: 'CertiLink',

  // App info
  APP_NAME: 'CertiLink',
  VERSION: '1.0.0',

  // Base URL — auto-detected, handles GitHub Pages subdirectory
  get BASE_URL() {
    return window.location.origin + window.location.pathname.replace(/\/$/, '').replace(/\/index\.html$/, '');
  },
};

// Freeze so it can't be mutated at runtime
Object.freeze(CONFIG);
