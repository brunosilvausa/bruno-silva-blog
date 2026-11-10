// Link-preview image (Open Graph, 1200×630) in the brand look: dark ground, muted flag stripes, the </> divider,
// the kicker in volt and the title in Orbitron. Built as plain element objects, so it needs no JSX.
// Used by the /og/* routes for pages without a cover photo.

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

async function googleFont(family, weight, text) {
  const q = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(q, { signal: AbortSignal.timeout(4000) })).text();
  const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error('font url not found');
  const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
  if (!res.ok) throw new Error(`font ${res.status}`);
  return res.arrayBuffer();
}

/** The brand fonts for the characters used; without network the image falls back to the built-in font. */
export async function ogFonts(text) {
  const chars = `${text} </>BRUNOSILVAUSABLOG0123456789`;
  const wanted = [['Orbitron', 800, 'Orbitron'], ['Barlow Condensed', 600, 'Barlow Condensed']];
  const out = await Promise.all(wanted.map(async ([family, weight, name]) => {
    try { return { name, data: await googleFont(family, weight, chars), weight, style: 'normal' }; } catch { return null; }
  }));
  return out.filter(Boolean);
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
