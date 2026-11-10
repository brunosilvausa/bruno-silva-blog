import { site } from '@/content/site';
import { ogResponse } from '@/lib/og-response';

// Default link preview (home, newsletter, legal pages).
export async function GET() {
  const t = site.home.title;
  return ogResponse({ kicker: 'Blog', title: `${t.before}${t.em}${t.after}` });
}
