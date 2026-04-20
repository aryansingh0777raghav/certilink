# CertiLink — Setup & Deployment Guide

## 📁 Project Structure

```
certilink/
├── index.html          ← Single entry point (all routing via hash)
├── css/
│   └── app.css         ← Styles, glass cards, animations
└── js/
    ├── config.js       ← ⭐ YOUR CLIENT ID GOES HERE
    ├── auth.js         ← Google Identity Services (OAuth implicit flow)
    ├── drive.js        ← Google Drive REST API (no gapi)
    ├── router.js       ← Hash-based router (#/dashboard, #/user?id=X)
    ├── ui.js           ← Toast notifications, theme toggle
    ├── app.js          ← Bootstrap: auth init + route registration
    └── pages/
        ├── home.js     ← Login landing page
        ├── dashboard.js← Upload + manage certificates
        └── profile.js  ← Public shareable portfolio
```

---

## 🔐 Step 1: Google Cloud Console Setup

### 1.1 Create a Project
1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Name it `CertiLink` → **Create**

### 1.2 Enable Google Drive API
1. Go to **APIs & Services** → **Library**
2. Search for **Google Drive API** → Click **Enable**

### 1.3 Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. User Type: **External** → **Create**
3. Fill in:
   - App name: `CertiLink`
   - User support email: your email
   - Developer contact: your email
4. Click **Save and Continue**
5. On **Scopes** step, click **Add or Remove Scopes** and add:
   - `https://www.googleapis.com/auth/drive.file`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
6. Click **Save and Continue**
7. On **Test users** step, add your Gmail address (required while app is in "Testing" mode)
8. Click **Save and Continue** → **Back to Dashboard**

### 1.4 Create OAuth 2.0 Client ID
1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `CertiLink Web Client`
5. Under **Authorized JavaScript origins**, add:
   ```
   https://YOUR_GITHUB_USERNAME.github.io
   http://localhost:5500
   http://127.0.0.1:5500
   ```
   *(Replace YOUR_GITHUB_USERNAME with your actual GitHub username)*
6. Leave **Authorized redirect URIs** empty (not needed for implicit flow)
7. Click **Create**
8. Copy the **Client ID** — it looks like:
   ```
   123456789-abcdefghijklmnop.apps.googleusercontent.com
   ```

### 1.5 Update config.js
Open `js/config.js` and replace the placeholder:
```js
CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
```
with your actual Client ID:
```js
CLIENT_ID: '123456789-abcdefghijklmnop.apps.googleusercontent.com',
```

---

## 🚀 Step 2: Deploy to GitHub Pages

### 2.1 Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `certilink` (or any name you like)
3. Visibility: **Public**
4. **Do NOT** initialize with README (we'll push our files)
5. Click **Create repository**

### 2.2 Push the Code
```bash
cd certilink
git init
git add .
git commit -m "feat: initial CertiLink app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/certilink.git
git push -u origin main
```

### 2.3 Enable GitHub Pages
1. In your repository, go to **Settings** → **Pages**
2. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
3. Click **Save**
4. Your app will be live at:
   ```
   https://YOUR_USERNAME.github.io/certilink/
   ```
   *(GitHub Pages takes 1-2 minutes to deploy)*

### 2.4 Update OAuth Origins
After deploying, go back to Google Cloud Console:
1. **APIs & Services** → **Credentials** → click your OAuth client
2. Add your GitHub Pages URL to **Authorized JavaScript origins**:
   ```
   https://YOUR_USERNAME.github.io
   ```
3. Click **Save** (changes take ~5 minutes to propagate)

---

## 🏃 Step 3: Test Locally

### Option A — VS Code Live Server
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Open the `certilink/` folder in VS Code
3. Right-click `index.html` → **Open with Live Server**
4. App runs at `http://127.0.0.1:5500/`

### Option B — Python HTTP Server
```bash
cd certilink
python3 -m http.server 5500
# Visit http://localhost:5500
```

### Option C — Node.js serve
```bash
npx serve certilink -p 5500
# Visit http://localhost:5500
```

---

## 🔗 How Sharing Works

CertiLink uses a **localStorage-based sharing model**:

| Scenario | Works? | How |
|---|---|---|
| Same browser, same device | ✅ | Data read directly from localStorage |
| Share link to different device | ⚠️ | Only profile/cert metadata visible if stored in URL params |
| Demo mode | ✅ | Sample data embedded in the click handler |

### For true cross-device sharing:
The profile URL includes `?id=USER_ID`. For the recipient to see certificates:
- The owner must have shared their portfolio at least once from the same browser
- OR you can extend CertiLink with a **GitHub Gist** backend (see below)

### Optional: GitHub Gist Persistence
To enable cross-device certificate viewing, create a GitHub Personal Access Token and store certificate metadata in a Gist. This requires:
1. `POST https://api.github.com/gists` to create a Gist with certificate metadata
2. Encode the Gist ID in the share URL
3. `GET https://api.github.com/gists/{id}` on the profile page to load data

---

## 🛡️ Security Notes

- **No client_secret is used** — CertiLink uses the OAuth 2.0 implicit flow (token-based), safe for SPAs
- **Access tokens are stored in localStorage** — tokens expire in ~1 hour and are refreshed automatically
- **Drive scope is `drive.file`** — CertiLink can only access files it creates, not your entire Drive
- **Files are shared publicly** — certificates uploaded via CertiLink are set to "anyone with link can view" for portfolio sharing

---

## ✨ Features

- ☁️ **Google Drive storage** — your files, your Drive, forever
- 🔗 **One-click sharing** — portfolio URL + QR code
- 🌙 **Dark/light mode** — persisted in localStorage
- 🎯 **Drag & drop upload** — with upload progress bar
- 📎 **File support** — PDF, PNG, JPG, WebP, SVG (up to 20MB)
- 🏷️ **Tags & issuers** — organize certificates with metadata
- 🎨 **Custom icons** — pick an emoji for each certificate
- 📱 **Mobile-friendly** — responsive layout

---

## 🐛 Troubleshooting

| Issue | Fix |
|---|---|
| "Sign-in failed" | Check Client ID in `config.js`. Verify origins in Google Cloud Console. |
| "Upload failed 403" | Make sure Google Drive API is enabled in your project. |
| Blank page after deploy | Make sure GitHub Pages is set to `main` branch, root `/` |
| "redirect_uri_mismatch" | Add your exact GitHub Pages URL to Authorized JavaScript Origins (not redirect URIs) |
| OAuth popup blocked | Allow popups for your domain in browser settings |
| Certificates not visible on shared link | Sharing works on same browser by default. See "How Sharing Works" above. |

---

## 📄 License

MIT — free to use, fork, and deploy.
