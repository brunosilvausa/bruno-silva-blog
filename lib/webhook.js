import { createHmac, timingSafeEqual } from 'node:crypto';

const TOLERANCE_MS = 5 * 60 * 1000;

/**
 * Checks a Sanity webhook signature. Header "sanity-webhook-signature": "t=<ms timestamp>,v1=<signature>",
 * where the signature is base64url(HMAC-SHA256(secret, `${t}.${rawBody}`)). Rejects old timestamps (replays).
 * @returns {boolean}
 */
export function isValidSanitySignature(rawBody, header, secret, now = Date.now()) {
  if (!secret || typeof header !== 'string') return false;
  const parts = Object.fromEntries(
    header.split(',').map((p) => p.trim().split('=')).filter((kv) => kv.length === 2),
  );
  const t = Number(parts.t);
  const given = parts.v1;
  if (!Number.isFinite(t) || !given || Math.abs(now - t) > TOLERANCE_MS) return false;
  const expected = createHmac('sha256', secret).update(`${parts.t}.${rawBody}`).digest('base64url');
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}
