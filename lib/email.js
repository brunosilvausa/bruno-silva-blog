// Shared by the form (browser) and the API route (server), so both accept exactly the same addresses.
export const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
export const EMAIL_MAX_LENGTH = 254;

/**
 * Trims the value and returns it if it looks like an email address, otherwise ''.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeEmail(value) {
  if (typeof value !== 'string') return '';
  const email = value.trim();
  return email.length <= EMAIL_MAX_LENGTH && EMAIL_PATTERN.test(email) ? email : '';
}
