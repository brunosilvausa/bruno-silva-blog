import { notFound } from 'next/navigation';
import { site } from '@/content/site';
import { getPillarCounts, getPosts } from '@/lib/sanity';
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
  const [{ posts, total }, counts] = await Promise.all([
    getPosts({ offset: (page - 1) * perPage, limit: perPage, pillar: pillar?.value ?? null }),
    getPillarCounts(PILLARS.map((p) => p.value)).catch(() => ({})),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (page > totalPages) notFound();
  return (
    <Shell current={current}>
      {/* Header over the flag with CodeReveal in its gaps (title, text, buttons only), then the pillar ticker, then the pillar filter and the posts. */}
      <section className="bs-section blog-hero bs-backdrop bs-backdrop--code" aria-labelledby="titulo">
        <svg className="bs-flag" viewBox="0 0 1200 320" preserveAspectRatio="none" aria-hidden="true">
          {STRIPES.map((y) => <rect key={y} x="0" y={y} width="1200" height="15" />)}
        </svg>
        <div className="bs-code" aria-hidden="true"></div>
        <div className="bs-container">
          <CodeDivider className="bs-shead-divider" />
          <SectionHeader level={1} id="titulo" kicker={header.kicker} title={header.title} text={header.text} />
          {header.actions?.length ? (
            <div className="blog-hero__actions" data-reveal="load" style={{ '--i': 2 }}>
              {header.actions.map((a) => <a key={a.href} className={`bs-btn ${a.primary ? 'bs-btn--primary' : 'bs-btn--ghost'}`} href={a.href}>{a.label}</a>)}
            </div>
          ) : null}
        </div>
      </section>
      <Ticker label="Pilares do blog" speed={32} items={PILLARS.map((p) => ({ label: p.label, href: `/pilar/${p.slug}` }))} />
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
