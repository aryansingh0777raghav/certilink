/**
 * ─────────────────────────────
 *  CertiLink — UI Utilities
 * ─────────────────────────────
 */

const UI = (() => {

  /**
   * Toast notification
   * @param {string} message
   * @param {'success'|'error'|'info'} type
   * @param {number} duration  ms
   */
  function toast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = { success: '✅', error: '❌', info: '💡' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span>${icons[type] || '💡'}</span><span>${message}</span>`;
    container.appendChild(el);

    setTimeout(() => {
      el.style.animation = 'none';
      el.style.opacity = '0';
      el.style.transform = 'translateX(20px)';
      el.style.transition = 'all 0.3s ease';
      setTimeout(() => el.remove(), 300);
    }, duration);
  }

  /**
   * Theme toggle
   */
  function initTheme() {
    const saved = localStorage.getItem('certilink_theme') || 'dark';
    _applyTheme(saved);

    document.getElementById('themeToggle')?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      _applyTheme(next);
      localStorage.setItem('certilink_theme', next);
    });
  }

  function _applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0D0D12';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#F4F1EB';
    }
    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }

  /**
   * Loading spinner overlay
   */
  function showLoader(message = 'Loading…') {
    const existing = document.getElementById('globalLoader');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.id = 'globalLoader';
    el.className = 'fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm';
    el.innerHTML = `
      <div class="glass-card p-8 text-center">
        <div class="text-3xl mb-3 animate-spin inline-block">⟳</div>
        <p class="text-sm opacity-60">${message}</p>
      </div>
    `;
    document.body.appendChild(el);
  }

  function hideLoader() {
    document.getElementById('globalLoader')?.remove();
  }

  return { toast, initTheme, showLoader, hideLoader };
})();
