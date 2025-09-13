// js/main.js - safer version

const posts = [
  { file: "demo.md", title: "Welcome Post", date: "2025-09-13" },
  { file: "nepal.md", title: "Nepal", date: "2025-09-14" }
];

function showMessage(html) {
  const list = document.getElementById('blog-list');
  if (!list) return;
  const col = document.createElement('div');
  col.className = 'col-12';
  col.innerHTML = `<div class="p-4 border bg-white text-danger">${html}</div>`;
  list.appendChild(col);
}

function safeId(name) {
  // replace anything not alphanumeric, hyphen or underscore with underscore
  return 'preview-' + String(name).replace(/[^a-z0-9\-_]/gi, '_');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

async function loadPosts() {
  const list = document.getElementById('blog-list');
  if (!list) {
    console.error('No #blog-list element found in DOM.');
    return;
  }
  list.innerHTML = '';

  if (location.protocol === 'file:') {
    showMessage('Error: You opened the page with <code>file://</code>. Fetching local .md files is blocked. Run a local server: <code>python -m http.server 8000</code> and open <code>http://localhost:8000</code>.');
    console.warn('file:// protocol detected — start a local server.');
  }

  for (const p of posts) {
    const col = document.createElement('div');
    col.className = 'col-md-6';

    const card = document.createElement('div');
    card.className = 'p-4 border bg-white h-100';

    const id = safeId(p.file);

    card.innerHTML = `
      <h4 class="mb-2">${escapeHtml(p.title)}</h4>
      <div class="text-muted small mb-2">${escapeHtml(p.date || '')}</div>
      <div class="mb-3" id="${id}">Loading preview...</div>
      <a class="btn btn-sm btn-primary" href="post.html?file=${encodeURIComponent(p.file)}&title=${encodeURIComponent(p.title)}">Read more</a>
    `;

    col.appendChild(card);
    list.appendChild(col);

    // fetch markdown
    try {
      const res = await fetch('posts/' + p.file);
      if (!res.ok) {
        const msg = `Error: Not found: posts/${p.file} (status ${res.status})`;
        console.warn(msg);
        const previewElem = document.getElementById(id);
        if (previewElem) previewElem.innerHTML = `<span class="text-danger">${escapeHtml(msg)}</span>`;
        continue;
      }
      const md = await res.text();
      const previewText = md.replace(/[#*_`\[\]\(\)>-]/g, '').trim().substring(0, 300);
      const previewElem = document.getElementById(id);
      if (previewElem) previewElem.innerHTML = escapeHtml(previewText) + (previewText.length >= 300 ? '...' : '');
    } catch (err) {
      console.error('Fetch error for', p.file, err);
      const previewElem = document.getElementById(id);
      if (previewElem) previewElem.innerHTML = `<span class="text-danger">Network error: ${escapeHtml(String(err.message || err))}</span>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', loadPosts);
