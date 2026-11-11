import { notFound } from 'next/navigation';
import { site } from '@/content/site';
import { getAdjacent, getAllPosts, getPost, getRelated } from '@/lib/sanity';
import { pillarOf } from '@/lib/pillars';
import { absolute } from '@/lib/site-url';
import { FEED_TYPES } from '@/lib/feed';
import { AUTHOR, breadcrumb, jsonLd as toJson } from '@/lib/jsonld';
import Shell from '@/components/Shell';
import Article from '@/components/Article';
import NewsletterSignup from '@/components/NewsletterSignup';
import SectionHeader from '@/components/SectionHeader';
import BlogGrid from '@/components/BlogGrid';
import CodeDivider from '@/components/CodeDivider';

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const post = await getPost((await params).slug);
  if (!post) return {};
  // Share image: the SEO image, else the cover photo, else the generated brand preview with the post's title.
  const photo = post.ogImage || post.cover;
  const image = photo ? `${photo.url}?w=1200&h=630&fit=crop&auto=format` : `/og/posts/${post.slug}`;
  const imageAlt = photo?.alt || post.title;
  return {
    title: `${post.seoTitle} | Bruno Silva USA`,
    description: post.description,
    alternates: { canonical: `/posts/${post.slug}`, types: FEED_TYPES },
    openGraph: {
      type: 'article',
      locale: 'pt_BR',
      siteName: 'Bruno Silva USA',
      title: post.seoTitle,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      section: pillarOf(post.pillar).label,
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: { card: 'summary_large_image', title: post.seoTitle, description: post.description, images: [image] },
  };
}

function jsonLd(post) {
  const pillar = pillarOf(post.pillar);
  const url = absolute(`/posts/${post.slug}`);
  return toJson({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        inLanguage: 'pt-BR',
        articleSection: pillar.label,
        author: { '@type': 'Person', name: post.author?.name || site.author.name, url: AUTHOR.url },
        publisher: AUTHOR,
        mainEntityOfPage: url,
        isPartOf: { '@id': absolute('/#blog') },
        image: post.cover ? `${post.cover.url}?w=1200&auto=format` : absolute(`/og/posts/${post.slug}`),
      },
      breadcrumb([{ name: 'Blog', path: '/' }, { name: pillar.label, path: `/pilar/${pillar.slug}` }, { name: post.title, path: `/posts/${post.slug}` }]),
    ],
  });
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
            <CodeDivider className="bs-shead-divider" />
            <SectionHeader id="h-relacionados" kicker="Continue lendo" title={{ before: 'Posts ', em: 'relacionados', after: '' }} />
            <BlogGrid posts={related} headingLevel={3} spotlight />
          </div>
        </section>
      ) : null}
    </Shell>
  );
}
