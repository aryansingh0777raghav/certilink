/**
 * ─────────────────────────
 *  Page: Privacy Policy
 * ─────────────────────────
 */

const PrivacyPage = (() => {
  function render() {
    document.getElementById('app').innerHTML = `
      <div class="relative min-h-screen flex flex-col overflow-hidden">

        <!-- Background blobs -->
        <div class="blob w-64 h-64 top-[-40px] right-[-40px] opacity-10"
             style="background: radial-gradient(circle, #F5C842, transparent 70%)"></div>

        <!-- Nav -->
        <nav class="flex items-center justify-between px-5 pt-5 pb-2 max-w-3xl mx-auto w-full">
          <a href="#/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span class="text-xl">🎓</span>
            <span class="font-display font-800 text-lg tracking-tight text-gold">CertiLink</span>
          </a>
          <a href="#/" class="btn btn-ghost text-xs py-2 px-4">← Back to Home</a>
        </nav>

        <!-- Content -->
        <main class="flex-1 max-w-3xl mx-auto w-full px-5 py-10">

          <div class="fade-in delay-1">
            <div class="badge mb-4 text-xs">Legal</div>
            <h1 class="font-display font-extrabold text-3xl sm:text-4xl mb-2">Privacy Policy</h1>
            <p class="text-xs opacity-40 font-mono mb-8">Last updated: April 23, 2025</p>
          </div>

          <div class="fade-in delay-2 space-y-6 text-sm leading-relaxed opacity-80">

            <div class="glass-card p-5">
              <h2 class="font-display font-bold text-base mb-3 text-gold">TL;DR — The Simple Version</h2>
              <ul class="space-y-2 text-sm">
                <li>✅ Your files go <strong>directly to your Google Drive</strong> — we never store them on any server.</li>
                <li>✅ We don't have a database. We have <strong>zero access</strong> to your certificates.</li>
                <li>✅ We don't track you, sell your data, or show you ads.</li>
                <li>✅ You can revoke CertiLink's Google access anytime from your Google account settings.</li>
              </ul>
            </div>

            <section>
              <h2 class="font-display font-bold text-base mb-2">1. What is CertiLink?</h2>
              <p>CertiLink is a free, open-source web application that lets you upload your certificates to your own Google Drive and generate a shareable portfolio link. It runs entirely in your browser — there is no CertiLink server that receives or processes your files.</p>
            </section>

            <section>
              <h2 class="font-display font-bold text-base mb-2">2. What data do we collect?</h2>
              <p class="mb-2"><strong>We collect nothing.</strong> CertiLink does not have a backend server or database.</p>
              <p>When you sign in with Google, we receive a temporary access token issued by Google. This token is used only to:</p>
              <ul class="list-disc ml-5 mt-2 space-y-1 opacity-70">
                <li>Upload your certificate files to <em>your own</em> Google Drive folder called "CertiLink".</li>
                <li>Read your name and profile picture from your Google account (displayed on your portfolio page).</li>
                <li>Save a small JSON index file in your Drive to sync your portfolio across devices.</li>
              </ul>
              <p class="mt-2">This token is stored temporarily in your browser's memory and is never sent to any third-party server other than Google's own APIs.</p>
            </section>

            <section>
              <h2 class="font-display font-bold text-base mb-2">3. Your Google Drive Data</h2>
              <p>CertiLink requests the <strong>drive.file</strong> scope, which means it can only see and modify files that it creates. It cannot read any other files in your Google Drive.</p>
              <p class="mt-2">All files uploaded through CertiLink are stored in a folder called <strong>"CertiLink"</strong> in your Google Drive. You can delete this folder at any time to remove all data.</p>
            </section>

            <section>
              <h2 class="font-display font-bold text-base mb-2">4. Public Portfolio Links</h2>
              <p>When you share your portfolio link, the link contains your certificate metadata (name, issuer, tags) encoded directly in the URL. Files themselves remain in your Google Drive and are accessed via Google's own viewer. You control sharing permissions for each file through Google Drive.</p>
            </section>

            <section>
              <h2 class="font-display font-bold text-base mb-2">5. Local Storage</h2>
              <p>CertiLink uses your browser's localStorage to cache your certificate list and profile for fast loading. This data stays on your device and is never transmitted to any server. You can clear it at any time through your browser's settings.</p>
            </section>

            <section>
              <h2 class="font-display font-bold text-base mb-2">6. Third-Party Services</h2>
              <ul class="list-disc ml-5 space-y-1 opacity-70">
                <li><strong>Google Identity Services</strong> — handles authentication. Subject to <a href="https://policies.google.com/privacy" target="_blank" class="text-gold underline">Google's Privacy Policy</a>.</li>
                <li><strong>Google Drive API</strong> — used for file storage. Subject to <a href="https://policies.google.com/privacy" target="_blank" class="text-gold underline">Google's Privacy Policy</a>.</li>
                <li><strong>Google Fonts</strong> — for typography. May log font request metadata per Google's policy.</li>
              </ul>
            </section>

            <section>
              <h2 class="font-display font-bold text-base mb-2">7. Cookies & Tracking</h2>
              <p>CertiLink uses <strong>no cookies</strong> and <strong>no analytics trackers</strong>. We do not use Google Analytics, Facebook Pixel, or any similar tracking technology.</p>
            </section>

            <section>
              <h2 class="font-display font-bold text-base mb-2">8. Revoking Access</h2>
              <p>You can revoke CertiLink's Google access at any time by visiting <a href="https://myaccount.google.com/permissions" target="_blank" class="text-gold underline">myaccount.google.com/permissions</a> and removing "CertiLink" from the list of connected apps.</p>
            </section>

            <section>
              <h2 class="font-display font-bold text-base mb-2">9. Open Source</h2>
              <p>CertiLink's source code is fully open source. You can audit exactly what it does on <a href="https://github.com/aryansingh0777raghav/certilink" target="_blank" class="text-gold underline">GitHub</a>.</p>
            </section>

            <section>
              <h2 class="font-display font-bold text-base mb-2">10. Contact</h2>
              <p>If you have any questions, feedback, or issues, feel free to reach out directly:</p>
              <a href="mailto:aryansingh979211@gmail.com?subject=CertiLink%20Feedback%20/%20Issue&body=Hi%20Aryan%2C%0A%0A%5BDescribe%20your%20feedback%20or%20issue%20here%5D%0A%0AThanks!"
                class="inline-flex items-center gap-2 mt-3 text-gold underline hover:opacity-80 transition-opacity">
                ✉️ aryansingh979211@gmail.com
              </a>
              <br/>
              <a href="https://instagram.com/iam_aryannnn07" target="_blank"
                class="inline-flex items-center gap-2 mt-2 text-gold underline hover:opacity-80 transition-opacity">
                📷 @iam_aryannnn07
              </a>
              <p class="mt-3">Or open an issue on <a href="https://github.com/aryansingh0777raghav/certilink" target="_blank" class="text-gold underline">GitHub</a>.</p>
            </section>

          </div>

          <div class="fade-in delay-3 mt-10 text-center">
            <a href="#/" class="btn btn-gold px-8">← Back to CertiLink</a>
          </div>

        </main>

        <!-- Footer -->
        <footer class="text-center py-6 text-xs opacity-30 font-mono">
          CertiLink · Open Source · Made with ♥ by Aryan Singh ·
          <a href="https://instagram.com/iam_aryannnn07" target="_blank" class="underline hover:opacity-60 transition-opacity">Instagram</a>
        </footer>
      </div>
    `;
  }

  return { render };
})();
