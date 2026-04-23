/**
 * ──────────────────────────────────────────────
 *  CertiLink — App Bootstrap
 *  Initializes auth, registers routes, starts router
 * ──────────────────────────────────────────────
 */

(async () => {
  // Initialize theme
  UI.initTheme();

  // Guard: warn if Client ID not configured
  if (CONFIG.CLIENT_ID.startsWith('YOUR_GOOGLE')) {
    console.warn(
      '%c⚠️ CertiLink: Set your Google Client ID in js/config.js',
      'color: #F5C842; font-size: 14px; font-weight: bold;'
    );
  }

  // Initialize auth (waits for GIS to load)
  await Auth.init();

  // Register routes
  Router.on('/', () => {
    if (Auth.isSignedIn()) {
      Router.navigate('/dashboard');
    } else {
      HomePage.render();
    }
  });

  Router.on('/dashboard', () => {
    if (!Auth.isSignedIn()) {
      Router.navigate('/');
      return;
    }
    DashboardPage.render();
  });

  Router.on('/user', (params) => {
    ProfilePage.render(params);
  });

  Router.on('/privacy', () => {
    PrivacyPage.render();
  });

  // Start routing
  Router.start();
})();
