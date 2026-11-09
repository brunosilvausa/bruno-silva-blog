// Best-effort limit per visitor IP, kept in the memory of each server instance.
// It stops bursts from a single client; for a hard, shared limit use Vercel Firewall rate limiting.
const WINDOW_MS = 60_000;
const MAX_HITS = 5;
const MAX_KEYS = 5_000;
const hits = new Map(); // ip -> { count, resetAt }

/** @returns {boolean} true when the request may go through */
export function allow(ip, now = Date.now()) {
  const entry = hits.get(ip);
  if (!entry || entry.resetAt <= now) {
    if (hits.size >= MAX_KEYS) prune(now);
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_HITS;
}

function prune(now) {
  for (const [key, entry] of hits) if (entry.resetAt <= now) hits.delete(key);
  // Still full (many distinct IPs inside one window): drop the oldest entries.
  for (const key of hits.keys()) {
    if (hits.size < MAX_KEYS) break;
    hits.delete(key);
  }
}

/** Client IP as reported by Vercel (x-real-ip) or the first x-forwarded-for hop. */
export function clientIp(request) {
  return (request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown').trim();
}
