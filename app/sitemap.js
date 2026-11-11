import { getAllPosts, getTerms, getSeriesList } from '@/lib/sanity';
import { PILLARS } from '@/lib/pillars';
import { absolute } from '@/lib/site-url';

export const revalidate = 300;

export default async function sitemap() {
  const [posts, terms, series] = await Promise.all([getAllPosts(), getTerms().catch(() => []), getSeriesList().catch(() => [])]);
  const newest = posts[0]?.updatedAt;
  return [
    { url: absolute('/'), lastModified: newest, changeFrequency: 'weekly', priority: 1 },
    { url: absolute('/newsletter'), changeFrequency: 'monthly', priority: 0.6 },
    { url: absolute('/sobre'), changeFrequency: 'monthly', priority: 0.6 },
    { url: absolute('/privacidade'), changeFrequency: 'yearly', priority: 0.2 },
    { url: absolute('/termos'), changeFrequency: 'yearly', priority: 0.2 },
    ...(terms.length ? [{ url: absolute('/glossario'), changeFrequency: 'weekly', priority: 0.6 }] : []),
    ...terms.map((t) => ({ url: absolute(`/glossario/${t.slug}`), changeFrequency: 'monthly', priority: 0.5 })),
    ...(series.length ? [{ url: absolute('/series'), changeFrequency: 'weekly', priority: 0.6 }] : []),
    ...series.map((s) => ({ url: absolute(`/series/${s.slug}`), changeFrequency: 'weekly', priority: 0.7 })),
    ...PILLARS.map((p) => ({ url: absolute(`/pilar/${p.slug}`), lastModified: newest, changeFrequency: 'weekly', priority: 0.7 })),
    ...posts.map((p) => ({ url: absolute(`/posts/${p.slug}`), lastModified: p.updatedAt, changeFrequency: 'monthly', priority: 0.8 })),
  ];
}
