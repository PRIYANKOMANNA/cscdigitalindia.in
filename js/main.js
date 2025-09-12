// js/main.js (replace existing)
// Robust blog loader with helpful error messages

// --- EDIT THIS LIST: add your markdown files here ---
const posts = [
  { file: "nepal.md", title: "Welcome Post", date: "2025-09-13" },
  // { file: "2025-09-13-first-post", title: "ডেমো পোস্ট", date: "2025-09-14" }
];

function showMessage(html) {
  const list = document.getElementById('blog-list');
  if (!list) return;
  const col = document.createElement('div');
  col.className = 'col-12';
  col.innerHTML = `<div class="p-4 border bg-white text-danger">${html}</div>`;
  list.appendChild(col);
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
  list.innerHTML = ''; // clear

  // If opened via file:// protocol, give explicit instruction
  if (location.protocol === 'file:') {
    showMessage('Error: You opened the page with <code>file://</code>. Fetching local .md files is blocked by browser security. Run a local HTTP server (e.g. <code>python -m http.server 8000</code>) and open <code>http://localhost:8000</code>.');
    console.warn('Page opened with file:// — fetch will likely fail. Start a local server.');
    // continue to attempt fetches (but they will usually fail)
  }

  for (const p of posts) {
    const col = document.createElement('div');
    col.className = 'col-md-6';
    const card = document.createElement('div');
    card.className = 'p-4 border bg-white h-100';

    // Basic header
    card.innerHTML = `
      <h4 class="mb-2">${escapeHtml(p.title)}</h4>
      <div class="text-muted small mb-2">${escapeHtml(p.date || '')}</div>
      <div class="mb-3" id="preview-${escapeHtml(p.file)}">Loading preview...</div>
      <a class="btn btn-sm btn-primary" href="post.html?file=${encodeURIComponent(p.file)}&title=${encodeURIComponent(p.title)}">Read more</a>
    `;
    col.appendChild(card);
    list.appendChild(col);

    // Try fetch markdown
    try {
      const res = await fetch('posts/' + p.file);
      if (!res.ok) {
        const msg = `Error: Failed to load <code>posts/${p.file}</code> — server returned ${res.status} ${res.statusText}.`;
        console.warn(msg);
        const preview = card.querySelector('#preview-' + p.file);
        if (preview) preview.innerHTML = `<span class="text-danger">${msg}</span>`;
        continue;
      }
      const md = await res.text();

      // create a short preview by removing markdown markers and trimming
      const previewText = md.replace(/[#*_`\[\]\(\)>-]/g, '').trim().substring(0, 300);
      const preview = card.querySelector('#preview-' + p.file);
      if (preview) preview.innerHTML = escapeHtml(previewText) + (previewText.length >= 300 ? '...' : '');

    } catch (err) {
      console.error('Network/fetch error for', p.file, err);
      const preview = card.querySelector('#preview-' + p.file);
      if (preview) {
        preview.innerHTML = `<span class="text-danger">Error: NetworkError when attempting to fetch resource. ${escapeHtml(String(err.message || err))}</span>`;
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', loadPosts);
