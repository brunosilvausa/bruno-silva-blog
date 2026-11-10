import { FEED_TYPES } from '@/lib/feed';
import { site } from '@/content/site';
import { getPosts } from '@/lib/sanity';
import Shell from '@/components/Shell';
import NewsletterSignup from '@/components/NewsletterSignup';
import SectionHeader from '@/components/SectionHeader';
import BlogGrid from '@/components/BlogGrid';

export const revalidate = 60;

export const metadata = {
  title: site.newsletter.page.title,
  description: site.newsletter.text,
  alternates: { canonical: '/newsletter', types: FEED_TYPES },
};

// Newsletter page: NewsletterSignup → BlogCard grid of recent posts (DS "Newsletter page").
export default async function NewsletterPage() {
  const { posts } = await getPosts({ limit: 3 });
  const n = site.newsletter;
  return (
    <Shell current="/newsletter">
      <NewsletterSignup data={n} formId="email-newsletter" level={1} latestHref={posts[0] ? `/posts/${posts[0].slug}` : null} />
      {posts.length ? (
        <section className="bs-section" aria-labelledby="h-recentes">
          <div className="bs-container">
            <SectionHeader id="h-recentes" kicker={n.page.recentKicker} title={n.page.recentTitle} />
            <BlogGrid posts={posts} headingLevel={3} />
          </div>
        </section>
      ) : null}
    </Shell>
  );
}
