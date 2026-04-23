/**
 * ─────────────────
 *  Page: Home
 *  Login landing — Mobile-friendly & Motivating
 * ─────────────────
 */

const HomePage = (() => {
  function render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="relative min-h-screen flex flex-col">

        <!-- Background blobs -->
        <div class="blob w-96 h-96 top-[-80px] left-[-80px] opacity-20"
             style="background: radial-gradient(circle, #F5C842, transparent 70%); position:fixed;"></div>
        <div class="blob w-72 h-72 bottom-[-40px] right-[-40px] opacity-15"
             style="background: radial-gradient(circle, #FF8C42, transparent 70%); animation-delay: 4s; position:fixed;"></div>

        <!-- Nav -->
        <nav class="flex items-center justify-between px-5 pt-5 pb-2 max-w-5xl mx-auto w-full">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🎓</span>
            <span class="font-display font-800 text-xl tracking-tight text-gold">CertiLink</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="badge hidden sm:inline-flex">v${CONFIG.VERSION}</span>
            <a href="#/privacy" class="text-xs opacity-50 hover:opacity-100 transition-opacity font-mono">Privacy</a>
          </div>
        </nav>

        <!-- Hero -->
        <main class="flex-1 flex flex-col items-center justify-center text-center px-5 py-12">

          <!-- Trust badge -->
          <div class="fade-in delay-1 inline-flex items-center gap-2 badge mb-5 text-xs px-3 py-2" style="word-wrap: break-word;">
            <span>✦</span>Google Drive powered · 100% Free
          </div>

          <h1 class="fade-in delay-2 font-display font-extrabold leading-tight mb-5 w-full"
              style="font-size: clamp(1.8rem, 6vw, 4.5rem); word-wrap: break-word; overflow-wrap: break-word;">
            Your certificates,<br/>
            <span class="text-gold">one shareable link.</span>
          </h1>

          <p class="fade-in delay-3 opacity-60 max-w-md mb-4 leading-relaxed" style="font-size: clamp(0.9rem, 3vw, 1.1rem);">
            Upload your certificates to <strong>your own</strong> Google Drive.
            Share a beautiful portfolio link with recruiters, professors, or anyone — in seconds.
          </p>

          <!-- Motivational sub-text -->
          <p class="fade-in delay-3 text-xs opacity-40 max-w-sm mb-8 font-mono">
            No backend. No subscription. Your data lives in your own Google account forever.
          </p>

          <!-- Sign-in button -->
          <div class="fade-in delay-4 flex flex-col sm:flex-row gap-3 items-center w-full max-w-xs sm:max-w-none sm:w-auto">
            <button id="loginBtn" class="btn btn-gold text-base px-8 py-3 w-full sm:w-auto justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Get Started Free
            </button>

            <a href="#" id="viewDemoBtn" class="btn btn-ghost text-sm w-full sm:w-auto justify-center">
              View demo portfolio →
            </a>
          </div>

          <!-- Social proof -->
          <div class="fade-in delay-5 flex items-center gap-2 mt-6 opacity-40 text-xs font-mono">
            <span>🔒</span> Google-verified login · <span>☁️</span> Your Drive, your data
          </div>

          <!-- Features -->
          <div class="fade-in delay-5 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14 max-w-3xl w-full">
            ${[
              { icon: '🚀', title: 'Get noticed instantly', desc: 'Send one link to recruiters and let your portfolio speak for itself.' },
              { icon: '☁️', title: 'Zero cost, forever', desc: 'Files live in your Google Drive — no monthly fees, no limits, no vendor lock-in.' },
              { icon: '🔐', title: 'Private by default', desc: 'Only the files you upload are shared. Your Google account stays yours.' },
            ].map(f => `
              <div class="glass-card p-5 text-left">
                <div class="text-2xl mb-3">${f.icon}</div>
                <div class="font-display font-700 text-sm mb-1">${f.title}</div>
                <div class="text-xs opacity-50 leading-relaxed">${f.desc}</div>
              </div>
            `).join('')}
          </div>

          <!-- Steps -->
          <div class="fade-in delay-5 mt-14 max-w-xl w-full text-left">
            <h2 class="text-xs font-mono opacity-40 uppercase tracking-widest mb-5 text-center">How it works</h2>
            <div class="flex flex-col gap-3">
              ${[
                ['1', 'Sign in with Google', 'One click, no password to remember.'],
                ['2', 'Upload your certificates', 'PDF, PNG, JPG — drag & drop or browse.'],
                ['3', 'Share your portfolio link', 'Copy the link and send it to anyone.'],
              ].map(([n, t, d]) => `
                <div class="glass-card p-4 flex items-start gap-4">
                  <div class="w-8 h-8 rounded-full bg-gold/20 text-gold font-display font-bold text-sm flex items-center justify-center flex-shrink-0">${n}</div>
                  <div>
                    <div class="font-display font-bold text-sm">${t}</div>
                    <div class="text-xs opacity-50 mt-0.5">${d}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </main>

        <!-- Footer -->
        <footer class="text-center py-6 text-xs opacity-30 font-mono px-4">
          CertiLink · Open Source · Made with ♥ by Aryan Singh<br class="sm:hidden"/>
          <span class="hidden sm:inline"> · </span>
          <a href="https://instagram.com/iam_aryannnn07" target="_blank" class="underline hover:opacity-60 transition-opacity">Instagram</a> ·
          <a href="#/privacy" class="underline hover:opacity-60 transition-opacity">Privacy Policy</a>
        </footer>
      </div>
    `;

    // Bind login button
    document.getElementById('loginBtn').addEventListener('click', async () => {
      const btn = document.getElementById('loginBtn');
      btn.disabled = true;
      btn.innerHTML = `<span class="animate-spin inline-block">⟳</span> Signing in…`;
      try {
        await Auth.signIn();
        if (Auth.isSignedIn()) {
          Router.navigate('/dashboard');
        }
      } catch (e) {
        UI.toast('Sign-in failed. Check your Client ID in config.js', 'error');
        btn.disabled = false;
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg> Get Started Free`;
      }
    });

    // Demo button
    document.getElementById('viewDemoBtn').addEventListener('click', (e) => {
      e.preventDefault();
      _showDemoProfile();
    });
  }

  function _showDemoProfile() {
    const demoId = 'demo_user_certilink';
    const demoCerts = [
      { id: 'demo1', name: 'AWS Solutions Architect', driveFileId: '', uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString(), tags: ['Cloud', 'AWS'], issuer: 'Amazon Web Services', emoji: '☁️' },
      { id: 'demo2', name: 'Google Data Analytics Certificate', driveFileId: '', uploadedAt: new Date(Date.now() - 86400000 * 10).toISOString(), tags: ['Data', 'Google'], issuer: 'Google', emoji: '📊' },
      { id: 'demo3', name: 'Meta Front-End Developer Certificate', driveFileId: '', uploadedAt: new Date(Date.now() - 86400000 * 20).toISOString(), tags: ['Web Dev', 'React'], issuer: 'Meta', emoji: '💻' },
    ];
    const demoProfile = { name: 'Aryan Singh', bio: 'Full-Stack Developer & Cloud Enthusiast', picture: '' };
    localStorage.setItem(`certilink_profile_${demoId}`, JSON.stringify(demoProfile));
    localStorage.setItem(`certilink_certs_${demoId}`, JSON.stringify(demoCerts));
    Router.navigate('/user', { id: demoId });
  }

  return { render };
})();
