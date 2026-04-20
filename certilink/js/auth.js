/**
 * ─────────────────────────────────────────
 *  CertiLink — Auth Module
 *  Google Identity Services (implicit flow)
 *  No client_secret. No backend.
 * ─────────────────────────────────────────
 */

const Auth = (() => {
  let _tokenClient = null;
  let _accessToken = null;
  let _tokenExpiry = null;
  let _resolveTokenPromise = null;

  // ── Storage keys ──
  const KEYS = {
    TOKEN:   'certilink_access_token',
    EXPIRY:  'certilink_token_expiry',
    USER:    'certilink_user',
    USER_ID: 'certilink_user_id',
  };

  /**
   * Load persisted token from localStorage (valid for this session)
   */
  function _loadPersistedToken() {
    const token  = localStorage.getItem(KEYS.TOKEN);
    const expiry = parseInt(localStorage.getItem(KEYS.EXPIRY) || '0', 10);
    if (token && Date.now() < expiry) {
      _accessToken = token;
      _tokenExpiry = expiry;
      return true;
    }
    _clearToken();
    return false;
  }

  function _persistToken(token, expiresIn) {
    _accessToken = token;
    _tokenExpiry = Date.now() + (expiresIn - 60) * 1000; // 60s buffer
    localStorage.setItem(KEYS.TOKEN, _accessToken);
    localStorage.setItem(KEYS.EXPIRY, String(_tokenExpiry));
  }

  function _clearToken() {
    _accessToken = null;
    _tokenExpiry = null;
    localStorage.removeItem(KEYS.TOKEN);
    localStorage.removeItem(KEYS.EXPIRY);
  }

  /**
   * Initialize GIS token client (call once GIS script is loaded)
   */
  function init() {
    return new Promise((resolve) => {
      // Wait for GIS to load
      const check = () => {
        if (window.google && window.google.accounts) {
          _tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CONFIG.CLIENT_ID,
            scope: CONFIG.SCOPES,
            callback: (response) => {
              if (response.error) {
                console.error('Auth error:', response.error);
                if (_resolveTokenPromise) _resolveTokenPromise(null);
                return;
              }
              _persistToken(response.access_token, parseInt(response.expires_in, 10));
              _fetchUserInfo().then(() => {
                if (_resolveTokenPromise) _resolveTokenPromise(_accessToken);
              });
            },
          });
          _loadPersistedToken();
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  /**
   * Request a new access token (shows Google popup)
   */
  function signIn() {
    return new Promise((resolve, reject) => {
      if (!_tokenClient) { reject(new Error('Auth not initialized')); return; }

      _resolveTokenPromise = resolve;

      if (_accessToken && Date.now() < _tokenExpiry) {
        // Already have a valid token — fetch user info if missing
        _fetchUserInfo().then(() => resolve(_accessToken));
        return;
      }

      // Trigger the OAuth popup
      _tokenClient.requestAccessToken({ prompt: 'consent' });
    });
  }

  /**
   * Sign out — revoke token and clear storage
   */
  function signOut() {
    if (_accessToken) {
      google.accounts.oauth2.revoke(_accessToken, () => {});
    }
    _clearToken();
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.USER_ID);
  }

  /**
   * Get a valid access token (refreshes silently if needed)
   */
  async function getToken() {
    if (_accessToken && Date.now() < _tokenExpiry) return _accessToken;

    // Token expired — prompt for new one (non-intrusive if session cookie valid)
    return new Promise((resolve) => {
      _resolveTokenPromise = resolve;
      _tokenClient.requestAccessToken({ prompt: '' }); // '' = no prompt if session alive
    });
  }

  /**
   * Fetch logged-in user profile from Google
   */
  async function _fetchUserInfo() {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${_accessToken}` },
      });
      if (!res.ok) return;
      const data = await res.json();

      const user = {
        id:      data.sub,
        name:    data.name,
        email:   data.email,
        picture: data.picture,
      };

      localStorage.setItem(KEYS.USER,    JSON.stringify(user));
      localStorage.setItem(KEYS.USER_ID, user.id);
      return user;
    } catch (e) {
      console.warn('Could not fetch user info', e);
    }
  }

  /**
   * Return cached user object (or null)
   */
  function getUser() {
    try { return JSON.parse(localStorage.getItem(KEYS.USER)); }
    catch { return null; }
  }

  function isSignedIn() {
    return !!(_accessToken && Date.now() < _tokenExpiry) ||
           !!localStorage.getItem(KEYS.USER);
  }

  function getUserId() {
    return localStorage.getItem(KEYS.USER_ID);
  }

  // Public API
  return { init, signIn, signOut, getToken, getUser, isSignedIn, getUserId };
})();
