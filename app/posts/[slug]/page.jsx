import { notFound } from 'next/navigation';
import { site } from '@/content/site';
import { getAdjacent, getAllPosts, getPost, getRelated } from '@/lib/sanity';
import { pillarOf } from '@/lib/pillars';
import { absolute } from '@/lib/site-url';
import { FEED_TYPES } from '@/lib/feed';
import Shell from '@/components/Shell';
import Article from '@/components/Article';
import NewsletterSignup from '@/components/NewsletterSignup';
import SectionHeader from '@/components/SectionHeader';
import BlogGrid from '@/components/BlogGrid';

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const post = await getPost((await params).slug);
  if (!post) return {};
  const image = post.cover ? `${post.cover.url}?w=1200&h=630&fit=crop&auto=format` : site.meta.image;
  return {
    title: `${post.title} | Bruno Silva USA`,
    description: post.description,
    alternates: { canonical: `/posts/${post.slug}`, types: FEED_TYPES },
    openGraph: {
      type: 'article',
      locale: 'pt_BR',
      siteName: 'Bruno Silva USA',
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      section: pillarOf(post.pillar).label,
      images: [{ url: image, alt: post.cover?.alt || '' }],
    },
    twitter: { card: post.cover ? 'summary_large_image' : 'summary', title: post.title, description: post.description, images: [image] },
  };
}

function jsonLd(post) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: 'pt-BR',
    articleSection: pillarOf(post.pillar).label,
    author: { '@type': 'Person', name: post.author?.name || site.author.name },
    mainEntityOfPage: absolute(`/posts/${post.slug}`),
    ...(post.cover ? { image: `${post.cover.url}?w=1200&auto=format` } : {}),
  };
  // Escape "<" so the JSON can't close the script tag.
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export default async function PostPage({ params }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const [related, { prev, next }] = await Promise.all([getRelated(post, 3), getAdjacent(post)]);
  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(post) }} />
      <Article post={post} fallbackAuthor={site.author} shareUrl={absolute(`/posts/${post.slug}`)} prev={prev} next={next} />
      <NewsletterSignup data={site.newsletter} />
      {related.length ? (
        <section className="bs-section" aria-labelledby="h-relacionados">
          <div className="bs-container">
            <SectionHeader id="h-relacionados" kicker="Continue lendo" title={{ before: 'Posts ', em: 'relacionados', after: '' }} />
            <BlogGrid posts={related} headingLevel={3} />
          </div>
        </section>
      ) : null}
    </Shell>
  );
}
