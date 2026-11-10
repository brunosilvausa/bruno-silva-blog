import { ImageResponse } from 'next/og';
import { OG_SIZE, ogCard, ogFonts, ogMonogram } from './og-card';
import { siteUrl } from './site-url';

/** PNG link preview for one page; cached for a day at the edge. */
export async function ogResponse({ kicker, title }) {
  const [fonts, monogram] = await Promise.all([ogFonts(`${kicker || ''} ${title}`), ogMonogram(siteUrl())]);
  return new ImageResponse(ogCard({ kicker, title, monogram }), {
    ...OG_SIZE,
    fonts,
    headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' },
  });
}
