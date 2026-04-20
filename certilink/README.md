# 🎓 CertiLink

> **Your certificates, one shareable link.**  
> Upload to Google Drive · Share anywhere · Zero backend

[![Static](https://img.shields.io/badge/hosting-GitHub%20Pages-blue?style=flat-square)](https://pages.github.com)
[![No Backend](https://img.shields.io/badge/backend-none-green?style=flat-square)](#)
[![OAuth](https://img.shields.io/badge/auth-Google%20OAuth%202.0-red?style=flat-square)](#)

CertiLink is a fully client-side certificate portfolio app. Upload your certifications directly to your Google Drive, then share your beautiful public portfolio with a single link — no server, no database, no subscription.

## ⚡ Quick Start

1. Clone this repo
2. Edit `js/config.js` — add your Google OAuth Client ID
3. Open `index.html` in a browser (or run a local server)
4. Sign in with Google and start uploading!

**[→ Full Setup Guide](SETUP.md)**

## ✨ Features

| Feature | Detail |
|---|---|
| 🔐 Auth | Google OAuth 2.0 implicit flow (no client_secret) |
| ☁️ Storage | Google Drive (`drive.file` scope only) |
| 🔗 Sharing | Hash-based URL + QR code |
| 🌙 Theme | Dark / light mode toggle |
| 📎 Upload | Drag & drop with progress bar |
| 📱 Responsive | Mobile-first layout |

## 🗂️ Stack

- Pure HTML + CSS + Vanilla JavaScript  
- Tailwind CSS (CDN)
- Google Identity Services (GIS)
- Google Drive REST API (via `fetch()`)
- QRCode.js

## 🚀 Deploy

```bash
git init && git add . && git commit -m "CertiLink"
git remote add origin https://github.com/YOU/certilink.git
git push -u origin main
# Enable GitHub Pages → Settings → Pages → main / root
```

## 📄 License

MIT
