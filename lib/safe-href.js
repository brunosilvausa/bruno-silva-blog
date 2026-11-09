/**
 * Returns the link from an environment variable only when it is an http(s) address, an in-page anchor (#...)
 * or a path on this site (/...). Anything else (empty, a typo without https://, javascript:...) uses the fallback.
 * @param {string | undefined} value
 * @param {string} fallback
 */
export function safeHref(value, fallback) {
  const href = (value || '').trim();
  return /^(https?:\/\/[^\s]+|#[\w-]*|\/(?!\/)[^\s]*)$/i.test(href) ? href : fallback;
}
