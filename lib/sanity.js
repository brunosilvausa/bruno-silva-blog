import { SAMPLE_POSTS } from '@/content/sample-posts';
import { portableTextToPlain, readingMinutes } from './format';

// Reads published posts from Sanity's HTTP query API (no SDK needed). Without NEXT_PUBLIC_SANITY_PROJECT_ID the
// blog shows the sample posts in content/sample-posts.js, so it builds and runs before Sanity is set up.
const API_VERSION = 'v2025-02-19'; // published content only by default
const REVALIDATE_SECONDS = 60; // fallback refresh; the /api/revalidate webhook makes updates instant
export const CACHE_TAG = 'sanity';

function config() {
  const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '').trim();
  const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || 'production').trim();
  if (!projectId) return null;
  if (!/^[a-z0-9-]+$/.test(projectId) || !/^[a-z0-9_-]+$/.test(dataset)) {
    throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET has an unexpected format');
  }
  return { projectId, dataset };
}

/** True when the posts come from Sanity; false while the sample posts are shown. */
export function usingSanity() {
  return Boolean(config());
}

async function query(groq, params = {}) {
  const { projectId, dataset } = config();
  const url = new URL(`https://${projectId}.apicdn.sanity.io/${API_VERSION}/data/query/${dataset}`);
  url.searchParams.set('query', groq);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(`$${key}`, JSON.stringify(value));
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAG] } });
  if (!res.ok) throw new Error(`Sanity answered ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()).result;
}

// --- GROQ ---------------------------------------------------------------------------------------------------
const LIVE = '_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()';
// Project only body text fields for cards; share extraction with full articles without body image assets.
const READING_BODY = 'body[]{ _type, children[]{ text }, title, label, text, caption }';
const CARD = `{ _id, title, "slug": slug.current, pillar, excerpt, publishedAt, "cover": coverImage{ alt, "url": asset->url }, ${READING_BODY} }`;
const POST = `{
  _id, title, "slug": slug.current, pillar, excerpt, lead, seoTitle, seoDescription, publishedAt, _updatedAt,
  "cover": coverImage{ alt, caption, "url": asset->url },
  "ogImage": ogImage{ alt, "url": asset->url },
  body[]{ ..., _type == "image" => { ..., "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height } },
  author->{ name, bio, "image": image.asset->url }
}`;

// --- Normalising (Sanity and sample posts end up in the same shape) ------------------------------------------
function card(doc) {
  return {
    id: doc._id,
    title: doc.title || 'Sem título',
    slug: doc.slug,
    pillar: doc.pillar,
    excerpt: doc.excerpt || '',
    publishedAt: doc.publishedAt,
    cover: doc.cover?.url ? { url: doc.cover.url, alt: doc.cover.alt || '' } : null,
    minutes: readingMinutes(portableTextToPlain(doc.body)),
  };
}

function full(doc) {
  return {
    ...card(doc),
    lead: doc.lead || doc.excerpt || '',
    description: doc.seoDescription || doc.excerpt || doc.lead || '',
    seoTitle: (doc.seoTitle || '').trim() || doc.title || 'Sem título',
    ogImage: doc.ogImage?.url ? { url: doc.ogImage.url, alt: doc.ogImage.alt || '' } : null,
    updatedAt: doc._updatedAt || doc.publishedAt,
    cover: doc.cover?.url ? { url: doc.cover.url, alt: doc.cover.alt || '', caption: doc.cover.caption || '' } : null,
    body: doc.body || [],
    author: doc.author || null,
  };
}

const samples = () => SAMPLE_POSTS.slice().sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

/** Validated, constant slice bounds (GROQ slices can't take parameters). */
function bounds(offset, limit) {
  const start = Math.max(0, Math.trunc(Number(offset) || 0));
  const size = Math.min(50, Math.max(1, Math.trunc(Number(limit) || 1)));
  return [start, start + size];
}

// --- Public API -----------------------------------------------------------------------------------------------

/** Newest posts, optionally of one pillar: { posts, total }. */
export async function getPosts({ offset = 0, limit = 12, pillar = null } = {}) {
  const [start, end] = bounds(offset, limit);
  if (!usingSanity()) {
    const all = samples().filter((p) => !pillar || p.pillar === pillar);
    return { posts: all.slice(start, end).map(card), total: all.length };
  }
  const filter = `${LIVE} && ($pillar == null || pillar == $pillar)`;
  const result = await query(
    `{ "posts": *[${filter}] | order(publishedAt desc) [${start}...${end}] ${CARD}, "total": count(*[${filter}]) }`,
    { pillar },
  );
  return { posts: (result?.posts || []).map(card), total: result?.total || 0 };
}

/** How many published posts there are in all and per pillar: { all, <pillar value>: n }. */
export async function getPillarCounts(values) {
  if (!usingSanity()) {
    const all = samples();
    return Object.fromEntries([['all', all.length], ...values.map((v) => [v, all.filter((p) => p.pillar === v).length])]);
  }
  const safe = values.filter((v) => /^[a-z0-9-]+$/.test(v));
  const parts = safe.map((v) => `"${v}": count(*[${LIVE} && pillar == "${v}"])`);
  const result = await query(`{ "all": count(*[${LIVE}]), ${parts.join(', ')} }`);
  return result || {};
}

/** One published post by slug, or null. */
export async function getPost(slug) {
  if (typeof slug !== 'string' || !slug) return null;
  if (!usingSanity()) {
    const doc = samples().find((p) => p.slug === slug);
    return doc ? full(doc) : null;
  }
  const doc = await query(`*[${LIVE} && slug.current == $slug][0] ${POST}`, { slug });
  return doc ? full(doc) : null;
}

/** Up to `n` other posts: same pillar first, then the newest. */
export async function getRelated(post, n = 3) {
  let same; let recent;
  if (!usingSanity()) {
    const others = samples().filter((p) => p.slug !== post.slug);
    same = others.filter((p) => p.pillar === post.pillar);
    recent = others;
  } else {
    const filter = `${LIVE} && slug.current != $slug`;
    const result = await query(
      `{ "same": *[${filter} && pillar == $pillar] | order(publishedAt desc) [0...${n}] ${CARD},
         "recent": *[${filter}] | order(publishedAt desc) [0...${n + 1}] ${CARD} }`,
      { slug: post.slug, pillar: post.pillar },
    );
    same = result?.same || [];
    recent = result?.recent || [];
  }
  const seen = new Set();
  return [...same, ...recent]
    .filter((p) => p.slug !== post.slug && (seen.has(p.slug) ? false : seen.add(p.slug)))
    .slice(0, n)
    .map(card);
}

/** The published post just before (older) and just after (newer) this one: { prev, next }, each a card or null. */
export async function getAdjacent(post) {
  if (!usingSanity()) {
    const all = samples();
    const i = all.findIndex((p) => p.slug === post.slug);
    if (i < 0) return { prev: null, next: null };
    return { prev: all[i + 1] ? card(all[i + 1]) : null, next: i > 0 ? card(all[i - 1]) : null };
  }
  const result = await query(
    `{ "prev": *[${LIVE} && slug.current != $slug && publishedAt < $date] | order(publishedAt desc) [0] ${CARD},
       "next": *[${LIVE} && slug.current != $slug && publishedAt > $date] | order(publishedAt asc) [0] ${CARD} }`,
    { slug: post.slug, date: post.publishedAt },
  );
  return { prev: result?.prev ? card(result.prev) : null, next: result?.next ? card(result.next) : null };
}

/** The newest posts with their full body, for the RSS feed. */
export async function getFeedPosts(limit = 20) {
  const end = Math.min(50, Math.max(1, Math.trunc(Number(limit) || 1)));
  if (!usingSanity()) return samples().slice(0, end).map(full);
  const docs = await query(`*[${LIVE}] | order(publishedAt desc) [0...${end}] ${POST}`);
  return (docs || []).map(full);
}

/** Every published post, newest first, for the sitemap, RSS and static generation. */
export async function getAllPosts(limit = 500) {
  const end = Math.min(500, Math.max(1, Math.trunc(Number(limit) || 1)));
  if (!usingSanity()) return samples().slice(0, end).map((p) => ({ ...card(p), updatedAt: p.publishedAt }));
  const docs = await query(
    `*[${LIVE}] | order(publishedAt desc) [0...${end}] { _id, _updatedAt, title, "slug": slug.current, pillar, excerpt, publishedAt, ${READING_BODY} }`,
  );
  return (docs || []).map((d) => ({ ...card(d), updatedAt: d._updatedAt || d.publishedAt }));
}
