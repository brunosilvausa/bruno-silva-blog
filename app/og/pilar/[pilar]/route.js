import { site } from '@/content/site';
import { pillarBySlug } from '@/lib/pillars';
import { ogResponse } from '@/lib/og-response';

// Link preview of a pillar page: the pillar in volt, its one-line description as the title.
export async function GET(_req, { params }) {
  const pillar = pillarBySlug((await params).pilar);
  if (!pillar) return new Response('Not found', { status: 404 });
  return ogResponse({ kicker: pillar.label, title: site.pillarPage.texts[pillar.slug] });
}
