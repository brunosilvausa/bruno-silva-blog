// Automatic glossary links: turns the first mention of each glossary term in a post into a `termLink` annotation.

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// "All caps" (an acronym) means case-sensitive matching.
const isAcronym = (s) => s === s.toUpperCase() && /\p{L}/u.test(s);

/** One candidate per spelling (term + aliases), longest first so "Single-Member LLC" wins over "LLC". */
function candidates(terms, exclude) {
  const out = [];
  for (const term of terms || []) {
    if (!term?.slug || term.slug === exclude) continue;
    for (const text of [term.term, ...(term.aliases || [])]) {
      if (typeof text !== 'string' || !text.trim()) continue;
      const flags = isAcronym(text) ? 'gu' : 'giu';
      out.push({ term, length: text.length, re: new RegExp(`(?<![\\p{L}\\p{N}])(${escapeRe(text)})(?![\\p{L}\\p{N}])`, flags) });
    }
  }
  return out.sort((a, b) => b.length - a.length);
}

/** @param {string} text @param {{ term: string, aliases?: string[] }} term */
export function matchesTerm(text, term) {
  return candidates([{ slug: '_', ...term }]).some((c) => { c.re.lastIndex = 0; return c.re.test(String(text ?? '')); });
}

const ELIGIBLE_STYLES = new Set(['normal', 'blockquote']);

/**
 * Returns a copy of `blocks` where the first mention of each term (across the whole post) is wrapped in a
 * `termLink` mark. `exclude` is a term slug that must not be linked (the term's own page).
 */
export function linkTerms(blocks, terms, { exclude } = {}) {
  const cands = candidates(terms, exclude);
  if (!cands.length) return blocks;
  const done = new Set();

  return (blocks || []).map((block) => {
    if (block?._type !== 'block' || (!block.listItem && !ELIGIBLE_STYLES.has(block.style || 'normal'))) return block;
    const defs = block.markDefs || [];
    const skipKeys = new Set(defs.filter((d) => d._type === 'link' || d._type === 'termLink').map((d) => d._key));
    const added = [];
    const children = [];

    for (const span of block.children || []) {
      const marks = span.marks || [];
      const text = span.text;
      if (span._type !== 'span' || typeof text !== 'string' || marks.includes('code') || marks.some((m) => skipKeys.has(m))) { children.push(span); continue; }
      let pos = 0;
      let part = 0;
      const push = (chunk, extra = []) => {
        if (!chunk) return;
        children.push({ ...span, _key: part === 0 ? span._key : `${span._key}-t${part}`, text: chunk, marks: [...marks, ...extra] });
        part += 1;
      };
      for (;;) {
        let best = null;
        for (const c of cands) {
          if (done.has(c.term.slug)) continue;
          c.re.lastIndex = pos;
          const m = c.re.exec(text);
          if (m && (!best || m.index < best.index)) best = { index: m.index, text: m[1], term: c.term };
        }
        if (!best) break;
        const key = `term-${best.term.slug}`;
        push(text.slice(pos, best.index));
        push(best.text, [key]);
        added.push({ _key: key, _type: 'termLink', slug: best.term.slug, short: best.term.short });
        done.add(best.term.slug);
        pos = best.index + best.text.length;
      }
      if (part === 0) children.push(span); else push(text.slice(pos));
    }
    return added.length ? { ...block, children, markDefs: [...defs, ...added] } : block;
  });
}
