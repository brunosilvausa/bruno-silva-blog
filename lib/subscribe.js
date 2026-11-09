import { createHash } from 'node:crypto';

const TIMEOUT_MS = 8000;

/**
 * Adds an email to the mailing list of the configured provider.
 * Pick the provider with EMAIL_PROVIDER = kit | mailchimp | brevo | none (default: none).
 * With "none" nothing is stored and the form shows a demo message, so the page works before any account exists.
 *
 * @param {string} email - already trimmed and validated (see lib/email.js)
 * @returns {Promise<{ ok: true, demo?: true }>}
 */
export async function subscribe(email) {
  const provider = (process.env.EMAIL_PROVIDER || 'none').trim().toLowerCase();

  if (provider === 'kit') {
    // Kit (ConvertKit) API v4: upsert the subscriber, then add them to the form.
    const headers = { 'Content-Type': 'application/json', 'X-Kit-Api-Key': need('KIT_API_KEY') };
    const formId = need('KIT_FORM_ID', /^\d+$/);
    await call('https://api.kit.com/v4/subscribers', { method: 'POST', headers, body: JSON.stringify({ email_address: email }) });
    await call(`https://api.kit.com/v4/forms/${formId}/subscribers`, { method: 'POST', headers, body: JSON.stringify({ email_address: email }) });
    return { ok: true };
  }

  if (provider === 'mailchimp') {
    // Mailchimp Marketing API: idempotent upsert into the audience (list).
    const key = need('MAILCHIMP_API_KEY', /^[0-9a-f]+-[a-z]+\d+$/i);
    const dc = key.split('-').pop();
    const listId = need('MAILCHIMP_LIST_ID', /^[0-9a-z]+$/i);
    const hash = createHash('md5').update(email.toLowerCase()).digest('hex');
    await call(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${hash}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${Buffer.from(`any:${key}`).toString('base64')}` },
      body: JSON.stringify({ email_address: email, status_if_new: process.env.MAILCHIMP_DOUBLE_OPTIN === 'true' ? 'pending' : 'subscribed' }),
    });
    return { ok: true };
  }

  if (provider === 'brevo') {
    // Brevo API v3: create or update the contact in the list.
    await call('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': need('BREVO_API_KEY') },
      body: JSON.stringify({ email, listIds: [Number(need('BREVO_LIST_ID', /^\d+$/))], updateEnabled: true }),
    });
    return { ok: true };
  }

  if (provider !== 'none') throw new Error(`Unknown EMAIL_PROVIDER "${provider}" (use kit, mailchimp, brevo or none)`);
  return { ok: true, demo: true };
}

/** Reads a required environment variable, optionally checking its format. Never includes the value in errors. */
function need(name, format) {
  const value = (process.env[name] || '').trim();
  if (!value) throw new Error(`Missing environment variable ${name}`);
  if (format && !format.test(value)) throw new Error(`Environment variable ${name} has an unexpected format`);
  return value;
}

async function call(url, init) {
  const res = await fetch(url, { ...init, cache: 'no-store', signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`${new URL(url).host} answered ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res;
}
