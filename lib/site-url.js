// Public address of the site, for absolute links (previews, RSS, sitemap). Vercel fills
// VERCEL_PROJECT_PRODUCTION_URL automatically; set NEXT_PUBLIC_SITE_URL when the blog gets its own domain.
export function siteUrl() {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  for (const candidate of [process.env.NEXT_PUBLIC_SITE_URL, vercel && `https://${vercel}`]) {
    try {
      if (candidate) return new URL(candidate);
    } catch {
      // Malformed value (e.g. missing https://): try the next one instead of failing the build.
    }
  }
  return new URL('http://localhost:3000');
}

/** Absolute URL for a path on this site. */
export function absolute(path) {
  return new URL(path, siteUrl()).toString();
}
