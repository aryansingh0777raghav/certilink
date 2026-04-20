/**
 * ─────────────────────────────────────────
 *  CertiLink — Hash Router
 *  Works on static hosting (GitHub Pages)
 *  Routes: #/ | #/dashboard | #/user?id=X
 * ─────────────────────────────────────────
 */

const Router = (() => {
  const routes = {};
  let _currentRoute = null;

  /**
   * Register a route handler
   * @param {string} path - e.g. '/', '/dashboard', '/user'
   * @param {Function} handler - receives (params) → renders into #app
   */
  function on(path, handler) {
    routes[path] = handler;
  }

  /**
   * Parse the current hash into { path, params }
   */
  function _parse() {
    const raw = window.location.hash.replace(/^#/, '') || '/';
    const [pathPart, queryPart] = raw.split('?');
    const path = pathPart || '/';
    const params = {};
    if (queryPart) {
      queryPart.split('&').forEach((pair) => {
        const [k, v] = pair.split('=');
        params[decodeURIComponent(k)] = decodeURIComponent(v || '');
      });
    }
    return { path, params };
  }

  /**
   * Navigate to a path programmatically
   */
  function navigate(path, params = {}) {
    const query = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    window.location.hash = query ? `${path}?${query}` : path;
  }

  /**
   * Start listening to hash changes
   */
  function start() {
    const dispatch = () => {
      const { path, params } = _parse();
      _currentRoute = path;

      const handler = routes[path];
      if (handler) {
        handler(params);
      } else {
        // Fallback to home
        const fallback = routes['/'];
        if (fallback) fallback({});
      }
    };

    window.addEventListener('hashchange', dispatch);
    dispatch(); // handle initial load
  }

  function currentRoute() { return _currentRoute; }

  return { on, navigate, start, currentRoute };
})();
