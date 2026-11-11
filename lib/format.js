const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

/** "31 de outubro de 2026" (Brazilian order, as the Copy kit asks). Uses the date as published, in UTC. */
export function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getUTCDate()} de ${MONTHS[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

/** Reading time at about 200 words a minute, rounded up, at least 1. */
export function readingMinutes(text) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Plain text of a Portable Text array (blocks' spans, callouts and image captions). */
export function portableTextToPlain(blocks = []) {
  return blocks
    .map((b) => {
      if (b?._type === 'block') return (b.children || []).map((c) => c.text || '').join('');
      if (b?._type === 'callout' || b?._type === 'prompt') return b.text || '';
      if (b?._type === 'image') return b.caption || '';
      return '';
    })
    .join('\n');
}
