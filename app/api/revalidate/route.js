import { revalidateTag } from 'next/cache';
import { CACHE_TAG } from '@/lib/sanity';
import { isValidSanitySignature } from '@/lib/webhook';

const MAX_BODY_BYTES = 64 * 1024;
const reply = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

// Sanity webhook: when a post or author is published, changed or deleted, refresh every page that reads Sanity.
// Set it up in sanity.io/manage → API → Webhooks (see README). Without SANITY_REVALIDATE_SECRET the route is off
// and pages still refresh on their own within 60 seconds.
export async function POST(request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return reply({ ok: false, error: 'disabled' }, 404);
  if (Number(request.headers.get('content-length') || 0) > MAX_BODY_BYTES) return reply({ ok: false, error: 'too-large' }, 413);
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return reply({ ok: false, error: 'too-large' }, 413);
  if (!isValidSanitySignature(raw, request.headers.get('sanity-webhook-signature'), secret)) {
    return reply({ ok: false, error: 'invalid-signature' }, 401);
  }
  revalidateTag(CACHE_TAG);
  return reply({ ok: true, revalidated: CACHE_TAG });
}
