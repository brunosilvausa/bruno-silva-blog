import { notFound } from 'next/navigation';
import { site } from '@/content/site';
import { getPosts } from '@/lib/sanity';
import Shell from './Shell';
import SectionHeader from './SectionHeader';
import BlogGrid from './BlogGrid';
import Pagination from './Pagination';
import NewsletterSignup from './NewsletterSignup';
import PillarTabs from './PillarTabs';
import Ticker from './Ticker';
import CodeDivider from './CodeDivider';

const STRIPES = [13, 59, 105, 150, 196, 242, 288];
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
 * The blog index and the pillar pages: SectionHeader → BlogCard grid (newest featured on page 1)
 * → pagination → NewsletterSignup. Unknown pages give a 404.
 */
export default async function PostList({ page, pillar, header, current, base = '' }) {
  if (!page) notFound();
  const perPage = site.home.perPage;
  const { posts, total } = await getPosts({ offset: (page - 1) * perPage, limit: perPage, pillar: pillar?.value ?? null });
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (page > totalPages) notFound();
  return (
    <Shell current={current}>
      {/* Header over the flag with CodeReveal in its gaps, then the pillar ticker, then the posts. */}
      <section className="bs-section blog-hero bs-backdrop bs-backdrop--code" aria-labelledby="titulo">
        <svg className="bs-flag" viewBox="0 0 1200 320" preserveAspectRatio="none" aria-hidden="true">
          {STRIPES.map((y) => <rect key={y} x="0" y={y} width="1200" height="15" />)}
        </svg>
        <div className="bs-code" aria-hidden="true"></div>
        <div className="bs-container">
          <CodeDivider className="bs-shead-divider" />
          <SectionHeader level={1} id="titulo" kicker={header.kicker} title={header.title} text={header.text} />
          <PillarTabs current={pillar ? `/pilar/${pillar.slug}` : '/'} />
        </div>
      </section>
      <Ticker label="Pilares do blog" speed={32} items={PILLARS.map((p) => ({ label: p.label, href: `/pilar/${p.slug}` }))} />
      <section className="bs-section blog-posts" aria-label="Posts">
        <div className="bs-container">
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
