import { safeHref } from './safe-href';
import { imageUrl } from './image';

// Portable Text → plain HTML for the RSS feed (same blocks as components/PortableText.jsx, without React).

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const MARKS = { strong: 'strong', em: 'em', code: 'code', underline: 'u', 'strike-through': 's' };

function spans(block) {
  const defs = Object.fromEntries((block.markDefs || []).map((d) => [d._key, d]));
  return (block.children || []).map((span) => {
    let out = esc(span.text).replace(/\n/g, '<br>');
    for (const mark of span.marks || []) {
      if (MARKS[mark]) { out = `<${MARKS[mark]}>${out}</${MARKS[mark]}>`; continue; }
      const def = defs[mark];
      if (def?._type === 'termLink') continue; // glossary links are plain text in the feed
      if (def?._type === 'link') {
        const href = safeHref(def.href, '');
        if (href) out = `<a href="${esc(href)}">${out}</a>`;
      }
    }
    return out;
  }).join('');
}

/** @param {Array} blocks @returns {string} */
export function portableTextToHtml(blocks) {
  const out = [];
  let list = null;
  const close = () => { if (list) { out.push(`</${list}>`); list = null; } };
  for (const b of blocks || []) {
    if (b?._type === 'block' && b.listItem) {
      const tag = b.listItem === 'number' ? 'ol' : 'ul';
      if (list !== tag) { close(); out.push(`<${tag}>`); list = tag; }
      out.push(`<li>${spans(b)}</li>`);
      continue;
    }
    close();
    if (b?._type === 'block') {
      const tag = { h2: 'h2', h3: 'h3', h4: 'h3', blockquote: 'blockquote' }[b.style] || 'p';
      out.push(`<${tag}>${spans(b)}</${tag}>`);
    } else if (b?._type === 'image' && b.url) {
      out.push(`<figure><img src="${esc(imageUrl(b.url, 1200, { fit: 'max' }))}" alt="${esc(b.alt || '')}">${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ''}</figure>`);
    } else if (b?._type === 'prompt' && typeof b.text === 'string' && b.text.trim()) {
      out.push(`<p><strong>${esc(b.title?.trim() || b.label?.trim() || 'Prompt')}:</strong><br>${esc(b.text).replace(/\n/g, '<br>')}</p>`);
    } else if (b?._type === 'callout' && b.text) {
      out.push(`<p><strong>${b.tone === 'atencao' ? 'Atenção' : 'Dica'}:</strong> ${esc(b.text).replace(/\n/g, '<br>')}</p>`);
    } else if (b?._type === 'checklist' && b.items?.length) {
      out.push(`<p><strong>${esc((b.title || '').trim() || 'Checklist')}:</strong></p><ul>${b.items.filter(Boolean).map((t) => `<li>☐ ${esc(t)}</li>`).join('')}</ul>`);
    }
  }
  close();
  return out.join('\n');
}
