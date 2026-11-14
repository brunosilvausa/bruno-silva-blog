import { getMaterial } from '@/lib/sanity';
import { MATERIAL_KINDS } from '@/lib/materials';
import { ogResponse } from '@/lib/og-response';

// Link preview of a Central de Conteúdo material.
export async function GET(_req, { params }) {
  const m = await getMaterial((await params).slug);
  if (!m) return new Response('Not found', { status: 404 });
  return ogResponse({ kicker: MATERIAL_KINDS.find((k) => k.value === m.kind)?.label || 'Central', title: m.title });
}
