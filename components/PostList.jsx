import { notFound } from 'next/navigation';
import { site } from '@/content/site';
import { getPosts } from '@/lib/sanity';
import Shell from './Shell';
import SectionHeader from './SectionHeader';
import BlogGrid from './BlogGrid';
import Pagination from './Pagination';
import NewsletterSignup from './NewsletterSignup';

/** A page number from the URL: a positive integer, or null. */
export function parsePage(value) {
  if (value === undefined) return 1;
  return /^[1-9]\d{0,3}$/.test(String(value)) ? Number(value) : null;
}

/** SectionHeader texts for a pillar page. */
export function pillarHeader(pillar) {
  return { kicker: site.pillarPage.kicker, title: { before: '', em: pillar.label, after: '' }, text: site.pillarPage.texts[pillar.slug] };
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
      <section className="bs-section" aria-labelledby="titulo">
        <div className="bs-container">
          <SectionHeader level={1} id="titulo" kicker={header.kicker} title={header.title} text={header.text} />
          {posts.length ? (
            <BlogGrid posts={posts} featureFirst={page === 1} headingLevel={2} />
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
