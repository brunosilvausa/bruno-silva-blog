import { subscribe } from '@/lib/subscribe';
import { normalizeEmail } from '@/lib/email';
import { allow, clientIp } from '@/lib/rate-limit';

const MAX_BODY_BYTES = 2048;

// Browsers send Origin on cross-site POSTs; compare its host with the host this request was made to
// (x-forwarded-host on Vercel and other proxies). Requests without Origin (curl, old browsers) pass.
function sameSite(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || new URL(request.url).host;
  try {
    return new URL(origin).host === host.split(',')[0].trim();
  } catch {
    return false;
  }
}

const reply = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request) {
  // Only JSON from this site: blocks plain HTML form posts and other sites calling the endpoint.
  if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) {
    return reply({ ok: false, error: 'invalid' }, 415);
  }
  if (!sameSite(request)) return reply({ ok: false, error: 'forbidden' }, 403);
  if (!allow(clientIp(request))) return reply({ ok: false, error: 'busy' }, 429);

  if (Number(request.headers.get('content-length') || 0) > MAX_BODY_BYTES) return reply({ ok: false, error: 'invalid' }, 413);
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return reply({ ok: false, error: 'invalid' }, 413);

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply({ ok: false, error: 'invalid' }, 400);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return reply({ ok: false, error: 'invalid' }, 400);

  // Honeypot: real people never fill the hidden "website" field. Answer as if it worked.
  if (body.website) return reply({ ok: true });

  const email = normalizeEmail(body.email);
  if (!email) return reply({ ok: false, error: 'email' }, 400);

  try {
    return reply(await subscribe(email));
  } catch (error) {
    // Log the reason without the visitor's address.
    console.error('[subscribe] provider error:', String(error?.message || error).replaceAll(email, '<email>'));
    return reply({ ok: false, error: 'provider' }, 502);
  }
}
