import { notFound } from 'next/navigation';
import { site } from '@/content/site';
import { getPillarCounts, getPosts } from '@/lib/sanity';
import Shell from './Shell';
import BlogGrid from './BlogGrid';
import Pagination from './Pagination';
import NewsletterSignup from './NewsletterSignup';
import PillarTabs from './PillarTabs';
import ListHero from './ListHero';
import { PILLARS } from '@/lib/pillars';

/** A page number from the URL: a positive integer, or null. */
export function parsePage(value) {
  if (value === undefined) return 1;
  return /^[1-9]\d{0,3}$/.test(String(value)) ? Number(value) : null;
}

/** SectionHeader texts for a pillar page. */
export function pillarHeader(pillar) {
  return { title: { before: '', em: pillar.label, after: '' }, text: site.pillarPage.texts[pillar.slug] };
}

/**
 * The blog index and the pillar pages: ListHero (SectionHeader + pillar ticker) → BlogCard grid (newest featured on page 1)
 * → pagination → NewsletterSignup. Unknown pages give a 404.
 */
export default async function PostList({ page, pillar, header, current, base = '' }) {
  if (!page) notFound();
  const perPage = site.home.perPage;
  const [{ posts, total }, counts] = await Promise.all([
    getPosts({ offset: (page - 1) * perPage, limit: perPage, pillar: pillar?.value ?? null }),
    getPillarCounts(PILLARS.map((p) => p.value)).catch(() => ({})),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (page > totalPages) notFound();
  return (
    <Shell current={current}>
      <ListHero header={header} />
      <section className="bs-section blog-posts" id="posts" aria-label="Posts">
        <div className="bs-container">
          <PillarTabs current={pillar ? `/pilar/${pillar.slug}` : '/'} counts={counts} />
          {posts.length ? (
            <BlogGrid posts={posts} featureFirst={page === 1} headingLevel={2} spotlight />
          ) : (
            <p className="blog-empty">{site.home.empty}</p>
          )}
          <Pagination page={page} totalPages={totalPages} base={base} />
        </div>
      </section>
      <NewsletterSignup data={site.newsletter} latestHref={posts[0] ? `/posts/${posts[0].slug}` : null} />
    </Shell>
  );
}
