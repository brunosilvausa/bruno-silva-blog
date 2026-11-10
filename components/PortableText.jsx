import { safeHref } from '@/lib/safe-href';
import { imageSrcSet } from '@/lib/image';

// Renders the post body (Portable Text from Sanity) into the design system's .bs-prose markup.
// Supported: paragraphs, h2/h3 (h4 shows as h3), quotes, bullet and numbered lists, bold, italic, code,
// underline, strike-through, links, images with caption and the "callout" box (Dica / Atenção).
// Unknown block types are skipped instead of breaking the page.

const DECORATORS = {
  strong: (c, k) => <strong key={k}>{c}</strong>,
  em: (c, k) => <em key={k}>{c}</em>,
  code: (c, k) => <code key={k}>{c}</code>,
  underline: (c, k) => <u key={k}>{c}</u>,
  'strike-through': (c, k) => <s key={k}>{c}</s>,
};

function withBreaks(text, key) {
  const lines = String(text ?? '').split('\n');
  return lines.map((line, i) => (i === 0 ? line : [<br key={`${key}-br${i}`} />, line]));
}

function Spans({ block }) {
  const defs = Object.fromEntries((block.markDefs || []).map((d) => [d._key, d]));
  return (block.children || []).map((span, i) => {
    const key = span._key || i;
    let node = withBreaks(span.text, key);
    for (const mark of span.marks || []) {
      if (DECORATORS[mark]) { node = DECORATORS[mark](node, `${key}-${mark}`); continue; }
      const def = defs[mark];
      if (def?._type === 'link') {
        const href = safeHref(def.href, '');
        if (!href) continue;
        const external = /^https?:\/\//i.test(href);
        node = <a key={`${key}-${mark}`} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{node}</a>;
      }
    }
    return <span key={key}>{node}</span>;
  });
}

function Block({ block, id }) {
  const content = <Spans block={block} />;
  switch (block.style) {
    case 'h2': return <h2 id={id} data-mask="words">{content}</h2>;
    case 'h3':
    case 'h4': return <h3>{content}</h3>;
    case 'blockquote': return <blockquote>{content}</blockquote>;
    default: return <p>{content}</p>;
  }
}

function Figure({ value }) {
  if (!value?.url) return null;
  const src = `${value.url}?w=1360&fit=max&auto=format`;
  return (
    <figure>
      <img
        src={src}
        srcSet={imageSrcSet(value.url, [640, 960, 1360])}
        sizes="(max-width: 728px) calc(100vw - 48px), 680px"
        alt={value.alt || ''}
        width={value.width}
        height={value.height}
        loading="lazy"
        decoding="async"
      />
      {value.caption ? <figcaption>{value.caption}</figcaption> : null}
    </figure>
  );
}

function Callout({ value }) {
  if (!value?.text) return null;
  return <div className="bs-callout"><b>{value.tone === 'atencao' ? 'Atenção' : 'Dica'}</b>{withBreaks(value.text, value._key)}</div>;
}

/** Groups consecutive list items into <ul>/<ol>; nested levels are shown flat. */
function group(blocks) {
  const out = [];
  for (const b of blocks || []) {
    if (b?._type === 'block' && b.listItem) {
      const last = out[out.length - 1];
      if (last?.list === b.listItem) last.items.push(b);
      else out.push({ list: b.listItem, items: [b], _key: `list-${b._key}` });
    } else out.push(b);
  }
  return out;
}

/** `ids` (optional) maps H2 blocks to anchor ids, from lib/headings.js. */
export default function PortableText({ value, ids }) {
  return group(value).map((node, i) => {
    const key = node?._key || i;
    if (node?.list) {
      const Tag = node.list === 'number' ? 'ol' : 'ul';
      return <Tag key={key}>{node.items.map((item, j) => <li key={item._key || j}><Spans block={item} /></li>)}</Tag>;
    }
    if (node?._type === 'block') return <Block key={key} block={node} id={ids?.get(node)} />;
    if (node?._type === 'image') return <Figure key={key} value={node} />;
    if (node?._type === 'callout') return <Callout key={key} value={node} />;
    return null;
  });
}
