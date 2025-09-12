// js/main.js
// এখানে posts তালিকা ম্যানুয়ালি আপডেট করবে যখন নতুন পোস্ট যোগ করবে
const posts = [
  { file: "2025-09-13-first-post.md", title: "আমার প্রথম ব্লগ পোস্ট", date: "2025-09-13" }
  // নতুন পোস্ট হলে এখানে আরেকটি আইটেম যোগ করো:
  // , { file: "2025-09-14-another.md", title: "দ্বিতীয় পোস্ট", date: "2025-09-14" }
];

async function loadPosts() {
  const list = document.getElementById('blog-list');
  if (!list) return;

  // clear
  list.innerHTML = '';

  for (let p of posts) {
    try {
      const res = await fetch('posts/' + p.file);
      if (!res.ok) {
        // যদি পোস্ট না মিলে, skip করো
        console.warn('Missing post file:', p.file);
        continue;
      }
      const md = await res.text();
      // preview: প্রথম 250 ক্যারেক্টার টেক্সট (strip markdown)
      const preview = md.replace(/[#*_`\[\]\(\)>-]/g, '').trim().substring(0, 250);

      const col = document.createElement('div');
      col.className = 'col-md-6';

      const card = document.createElement('div');
      card.className = 'p-4 border bg-white h-100';

      card.innerHTML = `
        <h4 class="mb-2">${escapeHtml(p.title)}</h4>
        <div class="text-muted small mb-2">${p.date}</div>
        <p class="mb-3">${escapeHtml(preview)}...</p>
        <a class="btn btn-sm btn-primary" href="post.html?file=${encodeURIComponent(p.file)}&title=${encodeURIComponent(p.title)}">Read more</a>
      `;

      col.appendChild(card);
      list.appendChild(col);

    } catch (err) {
      console.error('Error loading post', p.file, err);
    }
  }
}

// small helper to avoid XSS in title/preview (these are from local trusted files but safe)
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, function(m) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
  });
}

document.addEventListener('DOMContentLoaded', loadPosts);
