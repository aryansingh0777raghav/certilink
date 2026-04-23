/**
 * ──────────────────────────────────────────
 *  Page: Public Profile  (#/user?id=XYZ)
 *  Reads data from localStorage by user ID.
 *  Works because the sharer's data is encoded
 *  in the URL or the viewer must be the owner.
 *
 *  For true cross-device sharing, data is also
 *  encoded into the URL as a compressed payload.
 * ──────────────────────────────────────────
 */

const ProfilePage = (() => {

  function render(params) {
    const userId = params.id;
    if (!userId) { Router.navigate('/'); return; }

    // Try to read data from localStorage (works if same browser, or demo)
    let certs   = _loadData(`certilink_certs_${userId}`);
    let profile = _loadData(`certilink_profile_${userId}`);

    // Decode from URL payload if available
    if (params.data) {
      try {
        const base64Data = decodeURIComponent(params.data);
        const decoded = JSON.parse(decodeURIComponent(escape(atob(base64Data))));
        if (decoded.certs)   certs   = decoded.certs;
        if (decoded.profile) profile = decoded.profile;
      } catch {}
    }

    const isOwner = Auth.getUserId() === userId;
    const profileUrl = window.location.href;

    document.getElementById('app').innerHTML = `
      <div class="min-h-screen relative overflow-hidden">

        <!-- Background blobs -->
        <div class="blob w-80 h-80 top-[-60px] right-[-60px] opacity-15"
             style="background: radial-gradient(circle, #F5C842, transparent 70%)"></div>
        <div class="blob w-64 h-64 bottom-20 left-[-40px] opacity-10"
             style="background: radial-gradient(circle, #FF8C42, transparent 70%); animation-delay:5s;"></div>

        <!-- Nav -->
        <nav class="flex items-center justify-between px-6 pt-6 pb-2 max-w-4xl mx-auto">
          <a href="#/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span class="text-xl">🎓</span>
            <span class="font-display font-800 text-lg text-gold">CertiLink</span>
          </a>
          <div class="flex gap-3">
            ${isOwner
              ? `<button onclick="Router.navigate('/dashboard')" class="btn btn-ghost text-xs py-2">← Dashboard</button>`
              : `<a href="#/" class="btn btn-gold text-xs py-2">Create yours →</a>`}
          </div>
        </nav>

        <main class="max-w-4xl mx-auto px-4 py-10">

          ${!profile && !certs?.length ? _notFound(userId) : `

          <!-- Profile header -->
          <div class="fade-in glass-card p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            ${profile?.picture
              ? `<img src="${profile.picture}" class="w-20 h-20 rounded-full object-cover ring-2 ring-gold/30" />`
              : `<div class="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center text-4xl">👤</div>`}
            <div class="flex-1 text-center sm:text-left">
              <h1 class="font-display font-extrabold text-3xl sm:text-4xl mb-1">${profile?.name || 'My Portfolio'}</h1>
              ${profile?.bio ? `<p class="text-sm opacity-60 mt-2 max-w-lg">${profile.bio}</p>` : ''}
              <div class="flex items-center gap-3 justify-center sm:justify-start mt-4 flex-wrap">
                <span class="badge">${(certs || []).length} certificate${(certs||[]).length !== 1 ? 's' : ''}</span>
                <button id="shareProfileBtn" class="badge cursor-pointer hover:opacity-80 transition-opacity">
                  🔗 Share
                </button>
              </div>
            </div>
          </div>

          <!-- Certificates grid -->
          <div class="fade-in delay-1">
            <h2 class="font-display font-bold text-lg mb-4 opacity-60 font-mono tracking-widest text-xs uppercase">Certificates</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${(certs || []).length === 0
                ? `<div class="sm:col-span-2 glass-card p-10 text-center opacity-50">
                     <p>No certificates uploaded yet.</p>
                   </div>`
                : (certs || []).map((cert, i) => _publicCertCard(cert, i)).join('')}
            </div>
          </div>

          <!-- Footer CTA (for non-owner) -->
          ${!isOwner ? `
          <div class="fade-in delay-3 mt-12 text-center glass-card p-8">
            <p class="font-display font-bold text-xl mb-2">Build your own certificate portfolio</p>
            <p class="text-sm opacity-50 mb-5">Free · No backend · Powered by Google Drive</p>
            <a href="#/" class="btn btn-gold">Get started with CertiLink →</a>
          </div>
          ` : ''}
          `}

        </main>
      </div>

      <!-- Share modal -->
      <div id="shareModal" class="modal-backdrop hidden">
        <div class="modal-box relative text-center">
          <button onclick="document.getElementById('shareModal').classList.add('hidden')"
            class="absolute top-4 right-4 opacity-40 hover:opacity-100 text-lg">✕</button>
          <h3 class="font-display font-bold text-xl mb-2">Share this portfolio</h3>
          <p class="text-sm opacity-50 mb-5">Copy the link below and share it with anyone.</p>
          <div class="flex gap-2 mb-4">
            <input value="${profileUrl}" readonly
              class="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono" />
            <button id="copyShareBtn" class="btn btn-gold text-xs py-2 px-4">Copy</button>
          </div>
          <a href="${profileUrl}" target="_blank" class="btn btn-ghost text-xs w-full justify-center">
            Open in new tab →
          </a>
        </div>
      </div>
    `;

    // Bind share button
    document.getElementById('shareProfileBtn')?.addEventListener('click', () => {
      document.getElementById('shareModal').classList.remove('hidden');
    });
    document.getElementById('copyShareBtn')?.addEventListener('click', () => {
      navigator.clipboard.writeText(profileUrl).then(() => UI.toast('Link copied!', 'success'));
    });
    document.getElementById('shareModal')?.addEventListener('click', e => {
      if (e.target.id === 'shareModal') e.target.classList.add('hidden');
    });
  }

  function _publicCertCard(cert, index) {
    const date = cert.uploadedAt
      ? new Date(cert.uploadedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : '';
    const tags = (cert.tags || []).map(t => `<span class="badge text-xs">${t}</span>`).join('');
    const delay = Math.min(index + 1, 5);
    const hasLink = cert.driveFileId;

    return `
      <div class="cert-card glass-card p-5 fade-in delay-${delay} flex gap-4">
        <div class="cert-icon bg-gold/10">${cert.emoji || '🏆'}</div>
        <div class="flex-1 min-w-0">
          <h3 class="font-display font-bold text-sm leading-snug">${cert.name}</h3>
          ${cert.issuer ? `<p class="text-xs opacity-50 mt-0.5">${cert.issuer}</p>` : ''}
          <div class="flex flex-wrap gap-1.5 mt-2 items-center">
            ${tags}
          </div>
          <div class="flex items-center justify-between mt-3">
            ${date ? `<span class="text-xs opacity-30 font-mono">${date}</span>` : '<span></span>'}
            ${hasLink
              ? `<a href="https://drive.google.com/file/d/${cert.driveFileId}/view" target="_blank"
                  class="text-xs text-gold hover:underline font-mono flex items-center gap-1">
                  View certificate ↗
                </a>`
              : `<span class="text-xs opacity-30 font-mono">Demo entry</span>`}
          </div>
        </div>
      </div>
    `;
  }

  function _notFound(userId) {
    return `
      <div class="text-center py-24">
        <div class="text-6xl mb-6">🔍</div>
        <h2 class="font-display font-bold text-2xl mb-3">Portfolio not found</h2>
        <p class="text-sm opacity-50 mb-2">No portfolio exists for ID: <code class="font-mono text-gold">${userId}</code></p>
        <p class="text-xs opacity-40 mb-8">This portfolio may only be viewable in the same browser where it was created,<br/>
        or the ID may be incorrect.</p>
        <a href="#/" class="btn btn-gold">Create your own portfolio</a>
      </div>
    `;
  }

  function _loadData(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  return { render };
})();
