import { SAMPLE_POSTS } from '@/content/sample-posts';
import { SAMPLE_SERIES } from '@/content/sample-series';
import { SAMPLE_TERMS } from '@/content/sample-terms';
import { portableTextToPlain, readingMinutes } from './format';
import { matchesTerm } from './terms';

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
const READING_BODY = 'body[]{ _type, children[]{ text }, title, label, text, caption, items }';
const CARD = `{ _id, title, "slug": slug.current, pillar, excerpt, publishedAt, "cover": coverImage{ alt, "url": asset->url }, ${READING_BODY} }`;
const POST = `{
  _id, title, "slug": slug.current, pillar, excerpt, lead, seoTitle, seoDescription, publishedAt, _updatedAt,
  "cover": coverImage{ alt, caption, "url": asset->url },
  "ogImage": ogImage{ alt, "url": asset->url },
  body[]{ ..., _type == "image" => { ..., "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height } },
  author->{ name, bio, "image": image.asset->url },
  "series": *[_type == "series" && references(^._id)][0]{ title, "slug": slug.current, "parts": (posts[]->)[${LIVE}]{ title, "slug": slug.current, _id } }
}`;
const TERM = '{ _id, term, "slug": slug.current, fullName, short, aliases }';
const SERIES = `{ _id, title, "slug": slug.current, description, "cover": cover{ alt, "url": asset->url }, "count": count((posts[]->)[${LIVE}]) }`;

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
    series: seriesOf(doc),
  };
}

// The series block of a post: index is 1-based among the series' published parts; null when the post is in no series.
function seriesOf(doc) {
  const s = doc.series;
  const parts = (s?.parts || []).filter((p) => p?.slug);
  const at = parts.findIndex((p) => p._id === doc._id || p.slug === doc.slug);
  if (!s?.slug || at < 0) return null;
  return { title: s.title || 'Sem título', slug: s.slug, index: at + 1, total: parts.length, parts: parts.map((p) => ({ title: p.title || 'Sem título', slug: p.slug })) };
}

const byName = (a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' });

function term(doc) {
  return {
    id: doc._id,
    term: doc.term || '',
    slug: doc.slug,
    fullName: doc.fullName || '',
    short: doc.short || '',
    aliases: Array.isArray(doc.aliases) ? doc.aliases.filter(Boolean) : [],
  };
}

function seriesCard(doc, count) {
  return {
    id: doc._id,
    title: doc.title || 'Sem título',
    slug: doc.slug,
    description: doc.description || '',
    cover: doc.cover?.url ? { url: doc.cover.url, alt: doc.cover.alt || '' } : null,
    count,
  };
}

/** Sample posts of a sample series that are already published, in the series' order. */
function sampleParts(series) {
  const now = new Date().toISOString();
  return series.posts.map((slug) => SAMPLE_POSTS.find((p) => p.slug === slug)).filter((p) => p && p.publishedAt <= now);
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
    if (!doc) return null;
    const owner = SAMPLE_SERIES.find((s) => s.posts.includes(slug));
    const parts = owner ? sampleParts(owner) : [];
    return full({ ...doc, series: owner ? { title: owner.title, slug: owner.slug, parts: parts.map((p) => ({ title: p.title, slug: p.slug, _id: p._id })) } : null });
  }
  const doc = await query(`*[${LIVE} && slug.current == $slug][0] ${POST}`, { slug });
  return doc ? full(doc) : null;
}

/** The current address of a post that used to live at `slug` (kept in "Endereços antigos" by the Studio), or null. */
export async function getRedirect(slug) {
  if (typeof slug !== 'string' || !slug || !usingSanity()) return null;
  const doc = await query(`*[${LIVE} && $slug in oldSlugs][0]{ "slug": slug.current }`, { slug });
  return doc?.slug && doc.slug !== slug ? doc.slug : null;
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

/** Glossary terms, A-Z (pt-BR, accent-insensitive). */
export async function getTerms() {
  const docs = usingSanity()
    ? await query(`*[_type == "term" && defined(slug.current)] ${TERM}`)
    : SAMPLE_TERMS;
  return (docs || []).map(term).sort((a, b) => byName(a.term, b.term));
}

/** One glossary term with its body, or null. */
export async function getTerm(slug) {
  if (typeof slug !== 'string' || !slug) return null;
  const doc = usingSanity()
    ? await query(`*[_type == "term" && slug.current == $slug][0]{ _id, term, "slug": slug.current, fullName, short, aliases, body }`, { slug })
    : SAMPLE_TERMS.find((t) => t.slug === slug);
  return doc ? { ...term(doc), body: doc.body || [] } : null;
}

/** Up to 6 published posts whose text mentions the term (or an alias), newest first, as cards. */
export async function getTermPosts(termDoc) {
  if (!termDoc?.term) return [];
  const docs = usingSanity()
    ? await query(`*[${LIVE}] | order(publishedAt desc) [0...500] ${CARD}`)
    : samples();
  return (docs || [])
    .filter((d) => matchesTerm(portableTextToPlain(d.body), termDoc))
    .slice(0, 6)
    .map(card);
}

/** Every series that has at least one published part, with that number of parts. */
export async function getSeriesList() {
  if (!usingSanity()) {
    return SAMPLE_SERIES.map((s) => seriesCard(s, sampleParts(s).length)).filter((s) => s.count > 0).sort((a, b) => byName(a.title, b.title));
  }
  const docs = await query(`*[_type == "series" && defined(slug.current)] ${SERIES}`);
  return (docs || []).map((d) => seriesCard(d, d.count || 0)).filter((s) => s.count > 0).sort((a, b) => byName(a.title, b.title));
}

/** One series with its published parts (cards, in the order set in the Studio), or null. */
export async function getSeries(slug) {
  if (typeof slug !== 'string' || !slug) return null;
  if (!usingSanity()) {
    const doc = SAMPLE_SERIES.find((s) => s.slug === slug);
    if (!doc) return null;
    const parts = sampleParts(doc).map(card);
    return { ...seriesCard(doc, parts.length), parts };
  }
  const doc = await query(
    `*[_type == "series" && slug.current == $slug][0]{ _id, title, "slug": slug.current, description, "cover": cover{ alt, "url": asset->url }, "parts": (posts[]->)[${LIVE}] ${CARD} }`,
    { slug },
  );
  if (!doc) return null;
  const parts = (doc.parts || []).filter(Boolean).map(card);
  return { ...seriesCard(doc, parts.length), parts };
}

/** How many displayable glossary terms (with a slug) and series (with a published part) exist: { terms, series }. */
export async function getContentCounts() {
  if (!usingSanity()) {
    return {
      terms: SAMPLE_TERMS.filter((t) => t.slug).length,
      series: SAMPLE_SERIES.filter((s) => sampleParts(s).length > 0).length,
    };
  }
  const result = await query(`{ "terms": count(*[_type == "term" && defined(slug.current)]), "series": count(*[_type == "series" && defined(slug.current) && count((posts[]->)[${LIVE}]) > 0]) }`);
  return { terms: result?.terms || 0, series: result?.series || 0 };
}
