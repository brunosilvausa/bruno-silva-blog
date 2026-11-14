import { ImageResponse } from 'next/og';
import { OG_SIZE, ogCard, ogCoverCard, ogCoverImage, ogFonts, ogMonogram } from './og-card';
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

/** Same as ogResponse, with the cover photo full-bleed under a dark gradient; null when the cover can't be fetched. */
export async function ogCoverResponse({ kicker, title, coverUrl, accent }) {
  const [cover, fonts, monogram] = await Promise.all([ogCoverImage(coverUrl, siteUrl()), ogFonts(`${kicker || ''} ${title}`), ogMonogram(siteUrl())]);
  if (!cover) return null;
  return new ImageResponse(ogCoverCard({ kicker, title, monogram, cover, accent }), {
    ...OG_SIZE,
    fonts,
    headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800' },
  });
}
