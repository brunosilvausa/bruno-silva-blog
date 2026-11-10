// Anchors for the post's H2 subtitles (e.g. #o-que-comparar) and the "Neste post" index built from them.

/** URL-safe id from a heading: no accents, lowercase, words joined by "-". */
export function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '') || 'secao';
}

const blockText = (block) => (block.children || []).map((c) => c.text || '').join('').trim();

/**
 * @param {Array} body - Portable Text blocks
 * @returns {{ ids: Map<object, string>, items: { id: string, text: string }[] }}
 *   `ids` maps each H2 block to its unique id (passed to PortableText); `items` is the index, in order.
 */
export function tableOfContents(body) {
  const ids = new Map();
  const items = [];
  const used = new Map();
  for (const block of body || []) {
    if (block?._type !== 'block' || block.style !== 'h2' || block.listItem) continue;
    const text = blockText(block);
    if (!text) continue;
    const base = slugify(text);
    const n = (used.get(base) || 0) + 1;
    used.set(base, n);
    const id = n === 1 ? base : `${base}-${n}`;
    ids.set(block, id);
    items.push({ id, text });
  }
  return { ids, items };
}
