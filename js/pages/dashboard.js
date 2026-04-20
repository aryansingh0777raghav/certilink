/**
 * ────────────────────────────────
 *  Page: Dashboard
 *  Upload + manage certificates
 * ────────────────────────────────
 */

const DashboardPage = (() => {
  let _certs = [];
  let _profile = {};
  const CERT_KEY = () => `certilink_certs_${Auth.getUserId()}`;
  const PROFILE_KEY = () => `certilink_profile_${Auth.getUserId()}`;

  // ── Load / save helpers ──
  function _loadCerts()   { try { return JSON.parse(localStorage.getItem(CERT_KEY()) || '[]'); } catch { return []; } }
  function _saveCerts(c)  { localStorage.setItem(CERT_KEY(), JSON.stringify(c)); }
  function _loadProfile() { try { return JSON.parse(localStorage.getItem(PROFILE_KEY()) || '{}'); } catch { return {}; } }
  function _saveProfile(p){ localStorage.setItem(PROFILE_KEY(), JSON.stringify(p)); }

  const CERT_EMOJIS = ['🏆','🎓','📜','✅','⭐','🥇','🔑','💡','🚀','📊','☁️','💻','🛡️','📱','🎯'];

  function render() {
    if (!Auth.isSignedIn()) { Router.navigate('/'); return; }
    const user = Auth.getUser();
    _certs   = _loadCerts();
    _profile = _loadProfile();
    if (!_profile.name) _profile = { name: user?.name || 'My Portfolio', bio: '', picture: user?.picture || '' };

    const profileUrl = `${CONFIG.BASE_URL}/index.html#/user?id=${Auth.getUserId()}`;

    document.getElementById('app').innerHTML = `
      <div class="min-h-screen flex flex-col">

        <!-- Nav -->
        <nav class="glass-card m-4 px-5 py-3 flex items-center justify-between sticky top-4 z-40">
          <div class="flex items-center gap-2">
            <span class="text-xl">🎓</span>
            <span class="font-display font-800 text-lg text-gold">CertiLink</span>
          </div>
          <div class="flex items-center gap-3">
            <button id="shareBtn" class="btn btn-ghost text-xs py-2 px-4">
              🔗 Share Portfolio
            </button>
            <button id="signOutBtn" class="btn btn-ghost text-xs py-2 px-4">
              Sign out
            </button>
          </div>
        </nav>

        <div class="max-w-5xl mx-auto w-full px-4 py-6 flex-1">

          <!-- Profile header -->
          <div class="glass-card p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div class="relative">
              ${_profile.picture
                ? `<img src="${_profile.picture}" class="w-16 h-16 rounded-full object-cover" />`
                : `<div class="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center text-2xl">👤</div>`}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-3 flex-wrap">
                <h1 class="font-display font-bold text-2xl">${_profile.name}</h1>
                <span class="badge">${_certs.length} cert${_certs.length !== 1 ? 's' : ''}</span>
              </div>
              <p class="text-sm opacity-50 mt-1">${user?.email || ''}</p>
              ${_profile.bio ? `<p class="text-sm opacity-70 mt-2">${_profile.bio}</p>` : `<button id="addBioBtn" class="text-xs text-gold opacity-70 hover:opacity-100 mt-1">+ Add bio</button>`}
            </div>
            <button id="editProfileBtn" class="btn btn-ghost text-xs py-2">✏️ Edit Profile</button>
          </div>

          <!-- Stats row -->
          <div class="grid grid-cols-3 gap-4 mb-6">
            ${[
              { label: 'Certificates', val: _certs.length },
              { label: 'Shared views', val: '—' },
              { label: 'Drive folder', val: 'CertiLink' },
            ].map(s => `
              <div class="glass-card p-4 text-center">
                <div class="stat-num">${s.val}</div>
                <div class="text-xs opacity-40 mt-1 font-mono">${s.label}</div>
              </div>
            `).join('')}
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- Upload section -->
            <div class="lg:col-span-1">
              <h2 class="font-display font-bold text-lg mb-3">Upload Certificate</h2>

              <div id="dropZone" class="p-8 text-center cursor-pointer mb-4 rounded-xl transition-all">
                <div class="text-4xl mb-3" id="dropIcon">📎</div>
                <p class="text-sm font-medium mb-1">Drag & drop your certificate</p>
                <p class="text-xs opacity-40 mb-4">PDF, PNG, JPG — up to 20MB</p>
                <label class="btn btn-ghost text-xs cursor-pointer">
                  Browse file
                  <input type="file" id="fileInput" class="hidden" accept=".pdf,.png,.jpg,.jpeg,.webp,.svg" />
                </label>
              </div>

              <!-- Upload form (hidden until file selected) -->
              <div id="uploadForm" class="glass-card p-5 hidden">
                <div id="selectedFileInfo" class="flex items-center gap-3 mb-4 p-3 rounded-lg bg-white/5">
                  <span class="text-2xl">📄</span>
                  <div class="flex-1 min-w-0">
                    <div id="selectedFileName" class="text-sm font-medium truncate"></div>
                    <div id="selectedFileSize" class="text-xs opacity-40"></div>
                  </div>
                  <button id="clearFileBtn" class="text-xs opacity-40 hover:opacity-100">✕</button>
                </div>

                <div class="space-y-3 mb-4">
                  <div>
                    <label class="text-xs opacity-50 block mb-1">Certificate name</label>
                    <input id="certName" type="text" placeholder="e.g. AWS Solutions Architect"
                      class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50 transition-colors" />
                  </div>
                  <div>
                    <label class="text-xs opacity-50 block mb-1">Issuer / Organization</label>
                    <input id="certIssuer" type="text" placeholder="e.g. Amazon Web Services"
                      class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50 transition-colors" />
                  </div>
                  <div>
                    <label class="text-xs opacity-50 block mb-1">Tags (comma-separated)</label>
                    <input id="certTags" type="text" placeholder="Cloud, DevOps, AWS"
                      class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50 transition-colors" />
                  </div>
                  <div>
                    <label class="text-xs opacity-50 block mb-1">Icon</label>
                    <div id="emojiPicker" class="flex flex-wrap gap-2">
                      ${CERT_EMOJIS.map((e, i) => `
                        <button class="emoji-opt w-8 h-8 rounded-lg text-base hover:bg-white/10 transition-colors ${i === 0 ? 'bg-gold/20 ring-1 ring-gold' : ''}" data-emoji="${e}">${e}</button>
                      `).join('')}
                    </div>
                  </div>
                </div>

                <!-- Progress bar -->
                <div id="uploadProgressWrap" class="hidden mb-3">
                  <div class="flex justify-between text-xs opacity-50 mb-1">
                    <span>Uploading to Drive…</span>
                    <span id="uploadPct">0%</span>
                  </div>
                  <div class="w-full bg-white/10 rounded-full h-0.5">
                    <div id="uploadProgressBar" class="progress-bar" style="width:0%"></div>
                  </div>
                </div>

                <button id="uploadBtn" class="btn btn-gold w-full justify-center">
                  ☁️ Upload to Drive
                </button>
              </div>
            </div>

            <!-- Certificates list -->
            <div class="lg:col-span-2">
              <div class="flex items-center justify-between mb-3">
                <h2 class="font-display font-bold text-lg">My Certificates</h2>
                <button id="sharePortfolioBtn" class="text-xs text-gold font-mono hover:underline">
                  View public page →
                </button>
              </div>

              <div id="certsList">
                ${_certs.length === 0 ? _emptyState() : _certs.map(_certCard).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Share modal (hidden) -->
      <div id="shareModal" class="modal-backdrop hidden">
        <div class="modal-box">
          <h3 class="font-display font-bold text-xl mb-2">Share your portfolio</h3>
          <p class="text-sm opacity-50 mb-5">Anyone with this link can view your certificates.</p>

          <div class="flex gap-2 mb-5">
            <input id="shareUrlInput" value="${profileUrl}" readonly
              class="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none" />
            <button id="copyUrlBtn" class="btn btn-gold text-xs py-2 px-4">Copy</button>
          </div>

          <div class="flex items-center justify-center">
            <div id="qrCode" class="p-3 bg-white rounded-xl"></div>
          </div>

          <div class="mt-5 text-center">
            <a href="${profileUrl}" target="_blank" class="btn btn-ghost text-xs w-full justify-center">
              Open portfolio page →
            </a>
          </div>

          <button id="closeShareModal" class="absolute top-4 right-4 opacity-40 hover:opacity-100 text-lg">✕</button>
        </div>
      </div>
    `;

    _bindEvents(profileUrl);
  }

  function _emptyState() {
    return `
      <div class="glass-card p-10 text-center opacity-60">
        <div class="text-5xl mb-4">🎓</div>
        <p class="font-display font-bold mb-2">No certificates yet</p>
        <p class="text-sm opacity-60">Upload your first certificate using the panel on the left.</p>
      </div>
    `;
  }

  function _certCard(cert) {
    const date = cert.uploadedAt ? new Date(cert.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
    const tags = (cert.tags || []).map(t => `<span class="badge text-xs">${t}</span>`).join('');
    const hasLink = cert.driveFileId;
    return `
      <div class="cert-card glass-card p-5 mb-3 flex gap-4 items-start" data-id="${cert.id}">
        <div class="cert-icon bg-gold/10 text-2xl">${cert.emoji || '🏆'}</div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 class="font-display font-bold text-sm">${cert.name}</h3>
              ${cert.issuer ? `<p class="text-xs opacity-50 mt-0.5">${cert.issuer}</p>` : ''}
            </div>
            <div class="flex items-center gap-2">
              ${hasLink ? `<a href="https://drive.google.com/file/d/${cert.driveFileId}/view" target="_blank" class="text-xs text-gold hover:underline font-mono">View ↗</a>` : ''}
              <button class="delete-cert btn btn-danger text-xs py-1 px-2" data-id="${cert.id}">✕</button>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-wrap mt-2">
            ${tags}
            ${date ? `<span class="text-xs opacity-30 font-mono ml-auto">${date}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  function _bindEvents(profileUrl) {
    let _selectedFile = null;
    let _selectedEmoji = CERT_EMOJIS[0];

    // ── Drag & Drop ──
    const dropZone = document.getElementById('dropZone');
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) _setFile(file);
    });

    // ── File input ──
    document.getElementById('fileInput').addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) _setFile(file);
    });

    function _setFile(file) {
      _selectedFile = file;
      document.getElementById('selectedFileName').textContent = file.name;
      document.getElementById('selectedFileSize').textContent = _formatSize(file.size);
      const nameInput = document.getElementById('certName');
      if (!nameInput.value) nameInput.value = file.name.replace(/\.[^.]+$/, '');
      document.getElementById('uploadForm').classList.remove('hidden');
      document.getElementById('dropZone').classList.add('hidden');
    }

    document.getElementById('clearFileBtn').addEventListener('click', () => {
      _selectedFile = null;
      document.getElementById('uploadForm').classList.add('hidden');
      document.getElementById('dropZone').classList.remove('hidden');
      document.getElementById('fileInput').value = '';
    });

    // ── Emoji picker ──
    document.getElementById('emojiPicker').addEventListener('click', e => {
      const btn = e.target.closest('.emoji-opt');
      if (!btn) return;
      document.querySelectorAll('.emoji-opt').forEach(b => b.classList.remove('bg-gold/20', 'ring-1', 'ring-gold'));
      btn.classList.add('bg-gold/20', 'ring-1', 'ring-gold');
      _selectedEmoji = btn.dataset.emoji;
    });

    // ── Upload button ──
    document.getElementById('uploadBtn').addEventListener('click', async () => {
      if (!_selectedFile) { UI.toast('Please select a file first', 'error'); return; }

      const name   = document.getElementById('certName').value.trim() || _selectedFile.name;
      const issuer = document.getElementById('certIssuer').value.trim();
      const tags   = document.getElementById('certTags').value.split(',').map(t => t.trim()).filter(Boolean);

      const btn = document.getElementById('uploadBtn');
      btn.disabled = true;
      btn.textContent = 'Uploading…';

      document.getElementById('uploadProgressWrap').classList.remove('hidden');

      try {
        const driveFile = await Drive.uploadFile(_selectedFile, (pct) => {
          document.getElementById('uploadProgressBar').style.width = pct + '%';
          document.getElementById('uploadPct').textContent = pct + '%';
        });

        const cert = {
          id: 'cert_' + Date.now(),
          name,
          issuer,
          tags,
          emoji: _selectedEmoji,
          driveFileId: driveFile.id,
          uploadedAt: new Date().toISOString(),
        };

        _certs.unshift(cert);
        _saveCerts(_certs);

        UI.toast(`"${name}" uploaded successfully!`, 'success');
        render(); // re-render dashboard
      } catch (e) {
        UI.toast('Upload failed: ' + e.message, 'error');
        btn.disabled = false;
        btn.textContent = '☁️ Upload to Drive';
        document.getElementById('uploadProgressWrap').classList.add('hidden');
      }
    });

    // ── Delete cert ──
    document.querySelectorAll('.delete-cert').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = btn.dataset.id;
        const cert = _certs.find(c => c.id === id);
        if (!cert) return;

        if (!confirm(`Delete "${cert.name}"?\nThis will also remove it from Google Drive.`)) return;

        try {
          if (cert.driveFileId) await Drive.deleteFile(cert.driveFileId);
          _certs = _certs.filter(c => c.id !== id);
          _saveCerts(_certs);
          UI.toast('Certificate deleted', 'info');
          render();
        } catch (e) {
          UI.toast('Delete failed: ' + e.message, 'error');
        }
      });
    });

    // ── Share buttons ──
    const openShare = () => {
      document.getElementById('shareModal').classList.remove('hidden');
      document.getElementById('shareModal').style.position = 'fixed';
      // Generate QR code
      const qrEl = document.getElementById('qrCode');
      qrEl.innerHTML = '';
      try {
        new QRCode(qrEl, {
          text: profileUrl,
          width: 160, height: 160,
          colorDark: '#0D0D12',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M,
        });
      } catch (e) { qrEl.textContent = profileUrl; }
    };
    document.getElementById('shareBtn')?.addEventListener('click', openShare);
    document.getElementById('sharePortfolioBtn')?.addEventListener('click', () => window.open(profileUrl, '_blank'));

    document.getElementById('closeShareModal')?.addEventListener('click', () =>
      document.getElementById('shareModal').classList.add('hidden'));
    document.getElementById('shareModal')?.addEventListener('click', e => {
      if (e.target.id === 'shareModal') document.getElementById('shareModal').classList.add('hidden');
    });

    document.getElementById('copyUrlBtn')?.addEventListener('click', () => {
      navigator.clipboard.writeText(profileUrl).then(() => UI.toast('Link copied!', 'success'));
    });

    // ── Edit profile ──
    document.getElementById('editProfileBtn')?.addEventListener('click', _showProfileModal);
    document.getElementById('addBioBtn')?.addEventListener('click', _showProfileModal);

    // ── Sign out ──
    document.getElementById('signOutBtn').addEventListener('click', () => {
      Auth.signOut();
      Router.navigate('/');
    });
  }

  function _showProfileModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-box relative">
        <button id="closeProfile" class="absolute top-4 right-4 opacity-40 hover:opacity-100">✕</button>
        <h3 class="font-display font-bold text-xl mb-5">Edit Profile</h3>
        <div class="space-y-3">
          <div>
            <label class="text-xs opacity-50 block mb-1">Display name</label>
            <input id="profileName" value="${_profile.name || ''}" type="text"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50" />
          </div>
          <div>
            <label class="text-xs opacity-50 block mb-1">Bio</label>
            <textarea id="profileBio" rows="3" placeholder="Short bio about yourself…"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50 resize-none">${_profile.bio || ''}</textarea>
          </div>
        </div>
        <button id="saveProfile" class="btn btn-gold w-full justify-center mt-5">Save changes</button>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#closeProfile').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    modal.querySelector('#saveProfile').addEventListener('click', () => {
      _profile.name = modal.querySelector('#profileName').value.trim() || _profile.name;
      _profile.bio  = modal.querySelector('#profileBio').value.trim();
      _saveProfile(_profile);
      modal.remove();
      UI.toast('Profile updated', 'success');
      render();
    });
  }

  function _formatSize(bytes) {
    if (bytes < 1024)       return bytes + ' B';
    if (bytes < 1048576)    return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  return { render };
})();
