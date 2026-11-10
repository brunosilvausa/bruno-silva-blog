// Sanity image helpers: the CDN resizes on the fly, so phones get small files and desktops sharp ones.

/** Original size from a Sanity asset URL (…-1600x900.jpg), or null for other URLs. */
export function imageSize(url) {
  const m = /-(\d+)x(\d+)\.[a-z]+$/i.exec(String(url || ''));
  return m ? { width: Number(m[1]), height: Number(m[2]) } : null;
}

/** URL for one width; `params` adds h/fit (e.g. { h: 540, fit: 'crop' }). */
export function imageUrl(url, width, params = {}) {
  const q = new URLSearchParams({ w: String(width), ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])), auto: 'format' });
  return `${url}?${q}`;
}

/** srcset for several widths. `ratio` (height/width) keeps crops consistent across sizes. */
export function imageSrcSet(url, widths, { ratio, fit = 'max' } = {}) {
  return widths
    .map((w) => `${imageUrl(url, w, ratio ? { h: Math.round(w * ratio), fit } : { fit })} ${w}w`)
    .join(', ');
}
