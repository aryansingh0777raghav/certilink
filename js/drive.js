/**
 * ─────────────────────────────────────────
 *  CertiLink — Google Drive Module
 *  All Drive API calls via fetch() only.
 *  No gapi. No backend.
 * ─────────────────────────────────────────
 */

const Drive = (() => {
  const BASE = 'https://www.googleapis.com/drive/v3';
  const UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';
  const FOLDER_MIME = 'application/vnd.google-apps.folder';
  const DATA_FILE_NAME = 'certilink_data.json';

  let _folderId = null;
  const FOLDER_ID_KEY = 'certilink_folder_id';

  /**
   * Authorized fetch wrapper
   */
  async function _fetch(url, options = {}) {
    const token = await Auth.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Drive API error ${res.status}`);
    }
    return res.json();
  }

  /**
   * Find folder by name in Drive root
   */
  async function _findFolder(name) {
    const q = encodeURIComponent(`name='${name}' and mimeType='${FOLDER_MIME}' and trashed=false`);
    const data = await _fetch(`${BASE}/files?q=${q}&fields=files(id,name)&spaces=drive`);
    return data.files?.[0] || null;
  }

  /**
   * Create folder in Drive root
   */
  async function _createFolder(name) {
    const data = await _fetch(`${BASE}/files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        mimeType: FOLDER_MIME,
        parents: ['root'],
      }),
    });
    return data;
  }

  /**
   * Get or create the CertiLink folder
   */
  async function ensureFolder() {
    // Check cache first
    const cached = localStorage.getItem(FOLDER_ID_KEY);
    if (cached) { _folderId = cached; return _folderId; }

    let folder = await _findFolder(CONFIG.DRIVE_FOLDER_NAME);
    if (!folder) folder = await _createFolder(CONFIG.DRIVE_FOLDER_NAME);

    _folderId = folder.id;
    localStorage.setItem(FOLDER_ID_KEY, _folderId);
    return _folderId;
  }

  /**
   * Upload a file to the CertiLink folder (multipart upload)
   * Returns the Drive file object
   */
  async function uploadFile(file, onProgress) {
    const folderId = await ensureFolder();

    // Step 1: Initiate resumable upload session
    const token = await Auth.getToken();
    const initRes = await fetch(`${UPLOAD_BASE}/files?uploadType=resumable`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Upload-Content-Type': file.type,
        'X-Upload-Content-Length': file.size,
      },
      body: JSON.stringify({
        name: file.name,
        parents: [folderId],
      }),
    });

    if (!initRes.ok) throw new Error('Failed to initiate upload');
    const uploadUrl = initRes.headers.get('Location');

    // Step 2: Upload file with XHR for progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const fileData = JSON.parse(xhr.responseText);

          // Make file publicly readable (link sharing)
          await _makePublic(fileData.id);

          resolve(fileData);
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(file);
    });
  }

  /**
   * Set file permissions to "anyone with the link can view"
   */
  async function _makePublic(fileId) {
    const token = await Auth.getToken();
    await fetch(`${BASE}/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: 'reader', type: 'anyone' }),
    });
  }

  /**
   * Get a viewable web link for a Drive file
   */
  function getViewLink(fileId) {
    return `https://drive.google.com/file/d/${fileId}/view`;
  }

  /**
   * Get a direct embed/thumbnail link
   */
  function getThumbnailLink(fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
  }

  /**
   * List files in the CertiLink folder
   */
  async function listFiles() {
    const folderId = await ensureFolder();
    const q = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
    const fields = 'files(id,name,mimeType,createdTime,size,webViewLink,thumbnailLink)';
    const data = await _fetch(`${BASE}/files?q=${q}&fields=${fields}&orderBy=createdTime desc`);
    return data.files || [];
  }

  /**
   * Delete a file from Drive
   */
  async function deleteFile(fileId) {
    const token = await Auth.getToken();
    const res = await fetch(`${BASE}/files/${fileId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok && res.status !== 204) throw new Error('Delete failed');
  }

  /**
   * Load JSON app data from the CertiLink folder
   */
  async function loadAppData() {
    try {
      const folderId = await ensureFolder();
      const q = encodeURIComponent(`name='${DATA_FILE_NAME}' and '${folderId}' in parents and trashed=false`);
      const search = await _fetch(`${BASE}/files?q=${q}&fields=files(id)`);
      if (!search.files || search.files.length === 0) return null;

      const fileId = search.files[0].id;
      const token = await Auth.getToken();
      const res = await fetch(`${BASE}/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return null;
      return res.json();
    } catch (e) {
      console.error('Error loading app data from Drive:', e);
      return null;
    }
  }

  /**
   * Save JSON app data to the CertiLink folder
   */
  async function saveAppData(data) {
    const folderId = await ensureFolder();
    const q = encodeURIComponent(`name='${DATA_FILE_NAME}' and '${folderId}' in parents and trashed=false`);
    const search = await _fetch(`${BASE}/files?q=${q}&fields=files(id)`);

    const fileContent = JSON.stringify(data);
    const token = await Auth.getToken();

    if (search.files && search.files.length > 0) {
      // Update existing file content
      const fileId = search.files[0].id;
      const res = await fetch(`${UPLOAD_BASE}/files/${fileId}?uploadType=media`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: fileContent
      });
      if (!res.ok) throw new Error('Failed to update app data on Drive');
    } else {
      // Create metadata first
      const meta = await _fetch(`${BASE}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: DATA_FILE_NAME, parents: [folderId], mimeType: 'application/json' })
      });
      // Then upload content
      const res = await fetch(`${UPLOAD_BASE}/files/${meta.id}?uploadType=media`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: fileContent
      });
      if (!res.ok) throw new Error('Failed to save new app data to Drive');
    }
  }

  return { uploadFile, listFiles, deleteFile, getViewLink, getThumbnailLink, ensureFolder, loadAppData, saveAppData };
})();
