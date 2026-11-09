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
const CARD = `{ _id, title, "slug": slug.current, pillar, excerpt, publishedAt, "cover": coverImage{ alt, "url": asset->url }, "text": pt::text(body) }`;
const POST = `{
  _id, title, "slug": slug.current, pillar, excerpt, lead, seoDescription, publishedAt, _updatedAt,
  "cover": coverImage{ alt, caption, "url": asset->url },
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
    minutes: readingMinutes(doc.text ?? portableTextToPlain(doc.body)),
  };
}

function full(doc) {
  return {
    ...card({ ...doc, text: portableTextToPlain(doc.body) }),
    lead: doc.lead || doc.excerpt || '',
    description: doc.seoDescription || doc.excerpt || doc.lead || '',
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

/** Every published post, newest first, for the sitemap, RSS and static generation. */
export async function getAllPosts(limit = 500) {
  const end = Math.min(500, Math.max(1, Math.trunc(Number(limit) || 1)));
  if (!usingSanity()) return samples().slice(0, end).map((p) => ({ ...card(p), updatedAt: p.publishedAt }));
  const docs = await query(
    `*[${LIVE}] | order(publishedAt desc) [0...${end}] { _id, _updatedAt, title, "slug": slug.current, pillar, excerpt, publishedAt, "text": pt::text(body) }`,
  );
  return (docs || []).map((d) => ({ ...card(d), updatedAt: d._updatedAt || d.publishedAt }));
}
