import { site } from '@/content/site';
import { getAllPosts } from '@/lib/sanity';
import { pillarOf } from '@/lib/pillars';
import { absolute } from '@/lib/site-url';

export const revalidate = 300;

const escape = (s) => String(s ?? '').replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);

// RSS 2.0 feed of the newest 30 posts.
export async function GET() {
  const posts = (await getAllPosts()).slice(0, 30);
  const items = posts.map((p) => {
    const url = absolute(`/posts/${p.slug}`);
    return `    <item>
      <title>${escape(p.title)}</title>
      <link>${escape(url)}</link>
      <guid isPermaLink="true">${escape(url)}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <category>${escape(pillarOf(p.pillar).label)}</category>
      <description>${escape(p.excerpt)}</description>
    </item>`;
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.meta.title)}</title>
    <link>${escape(absolute('/'))}</link>
    <description>${escape(site.meta.description)}</description>
    <language>pt-BR</language>
    <atom:link href="${escape(absolute('/rss.xml'))}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
