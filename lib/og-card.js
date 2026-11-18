// Link-preview image (Open Graph, 1200×630) in the brand look: dark ground, muted flag stripes, the </> divider,
// the kicker in volt and the title in Orbitron. Built as plain element objects, so it needs no JSX.
// Used by the /og/* routes for pages without a cover photo.

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const OG_SIZE = { width: 1200, height: 630 };

const VOID = '#02070b';
const VOLT = '#e1fa03';
const STEEL = '#47494d';
const WHITE = '#f8f8f8';
const SILVER = '#b0b0b0';

function h(type, style, ...children) {
  const kids = children.flat().filter((c) => c !== null && c !== undefined && c !== false);
  // Satori counts an empty children array as "several children": leave it out when there are none.
  if (!kids.length) return { type, props: { style } };
  return { type, props: { style, children: kids.length === 1 ? kids[0] : kids } };
}

/** Title size that keeps long titles inside three lines. */
function titleSize(title) {
  const n = String(title || '').length;
  if (n > 70) return 42;
  if (n > 40) return 50;
  return 62;
}

/**
 * @param {{ kicker?: string, title: string, monogram?: string }} p  monogram: a data: URL of the BS monogram (optional)
 */
export function ogCard({ kicker, title, monogram }) {
  const stripes = [40, 130, 220, 310, 400, 490, 580].map((top) =>
    h('div', { position: 'absolute', left: 0, top, width: 360, height: 26, background: STEEL, opacity: 0.35 }));
  const rule = (w, c) => h('div', { width: w, height: 2, background: c });
  const dots = h('div', { display: 'flex', gap: 8 }, [0, 1, 2, 3].map(() => h('div', { width: 5, height: 5, borderRadius: 5, background: VOLT })));
  return h('div', { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: VOID, padding: '64px 80px', fontFamily: 'Orbitron' },
    h('div', { position: 'absolute', right: 0, top: 0, width: 360, height: 630, display: 'flex' }, stripes),
    h('div', { display: 'flex', alignItems: 'center', gap: 14, color: VOLT },
      rule(56, '#283038'), rule(90, VOLT), dots,
      h('div', { fontSize: 36, fontWeight: 800, color: VOLT, display: 'flex' }, '</>'),
      dots, rule(90, VOLT)),
    kicker ? h('div', { marginTop: 48, fontFamily: 'Barlow Condensed', fontSize: 30, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', color: VOLT, display: 'flex' }, kicker) : null,
    h('div', { marginTop: kicker ? 18 : 56, maxWidth: 740, fontSize: titleSize(title), fontWeight: 800, lineHeight: 1.08, textTransform: 'uppercase', color: WHITE, display: 'block', lineClamp: 4 }, String(title || '')),
    h('div', { position: 'absolute', left: 80, bottom: 56, display: 'flex', alignItems: 'center', gap: 18 },
      monogram ? { type: 'img', props: { src: monogram, width: 76, height: 50, style: { width: 76, height: 50 } } } : null,
      h('div', { display: 'flex', alignItems: 'baseline', gap: 12, fontSize: 26, fontWeight: 800, color: WHITE, letterSpacing: 1 },
        'BRUNO SILVA', h('div', { color: VOLT, fontSize: 22, letterSpacing: 6, display: 'flex' }, 'USA')),
      h('div', { marginLeft: 18, fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 600, letterSpacing: 3, color: SILVER, display: 'flex' }, 'BLOG')));
}

/** OG-only brand fonts; local read errors must surface instead of silently rendering without fonts. */
export async function ogFonts() {
  const [orbitron, barlow] = await Promise.all([
    readFile(join(process.cwd(), 'assets/fonts/og/Orbitron-ExtraBold.ttf')),
    readFile(join(process.cwd(), 'assets/fonts/og/BarlowCondensed-SemiBold.ttf')),
  ]);
  return [
    { name: 'Orbitron', data: orbitron, weight: 800, style: 'normal' },
    { name: 'Barlow Condensed', data: barlow, weight: 600, style: 'normal' },
  ];
}

/** The monogram as a data: URL, read from the site itself; null if it can't be fetched. */
export async function ogMonogram(origin) {
  try {
    const res = await fetch(new URL('/img/monogram.png', origin), { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    return `data:image/png;base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}`;
  } catch {
    return null;
  }
}

/**
 * Link preview with a cover: the photo full-bleed, a dark gradient from the bottom, the kicker chip and the title on top.
 * @param {{ kicker?: string, title: string, monogram?: string, cover: string, accent?: string }} p  cover: a data: URL
 */
export function ogCoverCard({ kicker, title, monogram, cover, accent = VOLT }) {
  return h('div', { width: '100%', height: '100%', display: 'flex', position: 'relative', background: VOID, fontFamily: 'Orbitron' },
    { type: 'img', props: { src: cover, width: 1200, height: 630, style: { position: 'absolute', left: 0, top: 0, width: 1200, height: 630, objectFit: 'cover' } } },
    h('div', { position: 'absolute', left: 0, top: 0, width: 1200, height: 630, display: 'flex', backgroundImage: 'linear-gradient(to bottom, rgba(2,7,11,0) 0%, rgba(2,7,11,0.55) 30%, rgba(2,7,11,0.93) 58%, rgba(2,7,11,0.96) 100%)' }),
    h('div', { position: 'absolute', left: 80, right: 80, bottom: 56, display: 'flex', flexDirection: 'column' },
      kicker ? h('div', { display: 'flex', alignSelf: 'flex-start', padding: '4px 16px', background: 'rgba(2,7,11,0.7)', border: `2px solid ${accent}`, borderRadius: 10, fontFamily: 'Barlow Condensed', fontSize: 28, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', color: accent }, kicker) : null,
      h('div', { marginTop: 18, fontSize: titleSize(title), fontWeight: 800, lineHeight: 1.08, textTransform: 'uppercase', color: WHITE, display: 'block', lineClamp: 3 }, String(title || '')),
      h('div', { marginTop: 28, display: 'flex', alignItems: 'center', gap: 18 },
        monogram ? { type: 'img', props: { src: monogram, width: 57, height: 38, style: { width: 57, height: 38 } } } : null,
        h('div', { display: 'flex', alignItems: 'baseline', gap: 10, fontSize: 22, fontWeight: 800, color: WHITE, letterSpacing: 1 },
          'BRUNO SILVA', h('div', { color: VOLT, fontSize: 18, letterSpacing: 5, display: 'flex' }, 'USA')))));
}

/** Landscape crop of the same hotspot, always JPEG (satori has no WebP): `auto=format` would override fm, so drop it. */
export function forceJpeg(u) {
  u.searchParams.delete('auto');
  u.searchParams.set('w', '1200'); u.searchParams.set('h', '630'); u.searchParams.set('fm', 'jpg');
  return u;
}

/** The cover as a data: URL (satori needs the bytes, not a relative path); null if it can't be fetched or isn't PNG/JPEG. */
export async function ogCoverImage(url, origin) {
  try {
    const u = new URL(url, origin);
    if (u.hostname === 'cdn.sanity.io') forceJpeg(u);
    const res = await fetch(u, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const type = (res.headers.get('content-type') || '').split(';')[0];
    if (type !== 'image/png' && type !== 'image/jpeg') return null;
    return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}`;
  } catch {
    return null;
  }
}
