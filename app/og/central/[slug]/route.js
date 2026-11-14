import { getMaterial } from '@/lib/sanity';
import { MATERIAL_KINDS, kindAccent } from '@/lib/materials';
import { ogResponse, ogCoverResponse } from '@/lib/og-response';

// Link preview of a Central de Conteúdo material: the cover full-bleed under a dark gradient, or the brand card without a cover.
export async function GET(_req, { params }) {
  const m = await getMaterial((await params).slug);
  if (!m) return new Response('Not found', { status: 404 });
  const kicker = MATERIAL_KINDS.find((k) => k.value === m.kind)?.label || 'Central';
  if (m.cover?.url) {
    const res = await ogCoverResponse({ kicker, title: m.title, coverUrl: m.cover.url, accent: kindAccent(m.kind) });
    if (res) return res;
  }
  return ogResponse({ kicker, title: m.title });
}
