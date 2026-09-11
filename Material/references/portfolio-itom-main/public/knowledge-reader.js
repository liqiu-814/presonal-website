const params = new URLSearchParams(location.search);
const topic = params.get('topic') || '';
const article = document.getElementById('readerArticle');
const title = document.getElementById('readerTitle');
const nav = document.getElementById('readerNav');

const escapeHtml = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const docUrl = `/ai-interview-guide-main/docs/${topic}/README.md`;
const resolveUrl = value => {
  if (/^(?:https?:|mailto:|#|data:)/i.test(value)) return value;
  return new URL(value, new URL(docUrl, location.origin)).pathname;
};

function inline(text) {
  let value = escapeHtml(text);
  value = value.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, alt, src) => `<img src="${resolveUrl(src)}" alt="${alt}" loading="lazy">`);
  value = value.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, label, href) => `<a href="${resolveUrl(href)}">${label}</a>`);
  value = value.replace(/`([^`]+)`/g, '<code>$1</code>');
  value = value.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  value = value.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return value;
}

function slugify(text, index) {
  const slug = text.replace(/<[^>]+>/g, '').replace(/[^\w\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
  return slug || `section-${index}`;
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split('\n');
  const output = [];
  let index = 0;
  let headingIndex = 0;
  let inCode = false;
  let code = [];

  while (index < lines.length) {
    const line = lines[index];
    if (/^```/.test(line)) {
      if (inCode) { output.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`); code = []; inCode = false; }
      else inCode = true;
      index += 1;
      continue;
    }
    if (inCode) { code.push(line); index += 1; continue; }
    if (!line.trim()) { index += 1; continue; }

    const htmlImage = line.match(/<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*>/i);
    if (htmlImage) { output.push(`<figure><img src="${resolveUrl(htmlImage[1])}" alt="${escapeHtml(htmlImage[2] || '')}" loading="lazy"></figure>`); index += 1; continue; }
    if (/^<\/?(?:p|a|div|sub|table|tr|td|br)\b/i.test(line.trim())) { index += 1; continue; }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const content = inline(heading[2].replace(/^\p{Extended_Pictographic}\s*/u, ''));
      const id = slugify(content, headingIndex++);
      output.push(`<h${level} id="${id}">${content}</h${level}>`);
      index += 1; continue;
    }
    if (/^---+$/.test(line.trim())) { output.push('<hr>'); index += 1; continue; }
    if (/^>\s?/.test(line)) { output.push(`<blockquote>${inline(line.replace(/^>\s?/, ''))}</blockquote>`); index += 1; continue; }

    if (/^\|.*\|\s*$/.test(line)) {
      const rows = [];
      while (index < lines.length && /^\|.*\|\s*$/.test(lines[index])) {
        const cells = lines[index].trim().slice(1, -1).split('|').map(cell => cell.trim());
        if (!cells.every(cell => /^:?-{3,}:?$/.test(cell))) rows.push(cells);
        index += 1;
      }
      if (rows.length) output.push(`<table><thead><tr>${rows[0].map(cell => `<th>${inline(cell)}</th>`).join('')}</tr></thead><tbody>${rows.slice(1).map(row => `<tr>${row.map(cell => `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index])) { items.push(lines[index].replace(/^[-*]\s+/, '')); index += 1; }
      output.push(`<ul>${items.map(item => `<li>${inline(item)}</li>`).join('')}</ul>`); continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) { items.push(lines[index].replace(/^\d+\.\s+/, '')); index += 1; }
      output.push(`<ol>${items.map(item => `<li>${inline(item)}</li>`).join('')}</ol>`); continue;
    }

    const paragraph = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(?:#{1,4}\s|```|>|[-*]\s+|\d+\.\s+|\|.*\|\s*$|<)/.test(lines[index])) paragraph.push(lines[index++]);
    output.push(`<p>${inline(paragraph.join(' '))}</p>`);
  }
  return output.join('\n');
}

async function loadTopic() {
  if (!/^\d{2}-[a-z0-9-]+$/.test(topic)) throw new Error('专题地址无效');
  const response = await fetch(docUrl);
  if (!response.ok) throw new Error(`无法读取专题 (${response.status})`);
  const bytes = await response.arrayBuffer();
  const markdown = new TextDecoder('utf-8').decode(bytes);
  article.innerHTML = renderMarkdown(markdown);
  const heading = article.querySelector('h1');
  const displayTitle = heading?.textContent?.trim() || 'AI 面试知识专题';
  title.textContent = displayTitle;
  document.title = `${displayTitle} · AI 面试知识星系`;
  const headings = [...article.querySelectorAll('h2, h3')];
  nav.innerHTML = headings.slice(0, 36).map(item => `<a href="#${item.id}">${item.textContent}</a>`).join('');
}

loadTopic().catch(error => {
  article.innerHTML = `<div class="reader-error"><h1>知识档案读取失败</h1><p>${escapeHtml(error.message)}</p><p><a href="./index.html">返回知识星系</a></p></div>`;
});
