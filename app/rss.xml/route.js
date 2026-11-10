import { site } from '@/content/site';
import { getFeedPosts } from '@/lib/sanity';
import { portableTextToHtml } from '@/lib/pt-html';
import { imageUrl } from '@/lib/image';
import { pillarOf } from '@/lib/pillars';
import { absolute } from '@/lib/site-url';

export const revalidate = 300;

const escape = (s) => String(s ?? '').replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);

// The text goes inside CDATA; a literal "]]>" is split so it can't end the section.
const cdata = (s) => `<![CDATA[${String(s).replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

// RSS 2.0 feed of the newest 20 posts, with the full text of each (content:encoded) for feed readers.
export async function GET() {
  const posts = await getFeedPosts(20);
  const items = posts.map((p) => {
    const url = absolute(`/posts/${p.slug}`);
    return `    <item>
      <title>${escape(p.title)}</title>
      <link>${escape(url)}</link>
      <guid isPermaLink="true">${escape(url)}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <category>${escape(pillarOf(p.pillar).label)}</category>
      <description>${escape(p.lead || p.excerpt)}</description>
      <dc:creator>${escape(p.author?.name || site.author.name)}</dc:creator>
      <content:encoded>${cdata((p.cover ? `<p><img src="${imageUrl(p.cover.url, 1200, { fit: 'max' })}" alt="${escape(p.cover.alt)}"></p>\n` : '') + portableTextToHtml(p.body) + `\n<p><a href="${url}">Leia no blog</a></p>`)}</content:encoded>
    </item>`;
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
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
