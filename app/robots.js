import { absolute } from '@/lib/site-url';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: absolute('/sitemap.xml'),
  };
}
