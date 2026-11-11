import { notFound } from 'next/navigation';
import { getTerm, getTermPosts, getTerms } from '@/lib/sanity';
import { linkTerms } from '@/lib/terms';
import { FEED_TYPES } from '@/lib/feed';
import { breadcrumb, definedTerm, jsonLd } from '@/lib/jsonld';
import Shell from '@/components/Shell';
import PortableText from '@/components/PortableText';
import SectionHeader from '@/components/SectionHeader';
import BlogGrid from '@/components/BlogGrid';
import CodeDivider from '@/components/CodeDivider';

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getTerms()).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const term = await getTerm((await params).slug);
  if (!term) return {};
  const title = `${term.term} | Glossário | Bruno Silva USA`;
  return {
    title,
    description: term.short,
    alternates: { canonical: `/glossario/${term.slug}`, types: FEED_TYPES },
    openGraph: { type: 'article', locale: 'pt_BR', siteName: 'Bruno Silva USA', title, description: term.short },
    twitter: { card: 'summary', title, description: term.short },
  };
}

export default async function TermPage({ params }) {
  const term = await getTerm((await params).slug);
  if (!term) notFound();
  const [terms, posts] = await Promise.all([getTerms().catch(() => []), getTermPosts(term).catch(() => [])]);
  const body = linkTerms(term.body, terms, { exclude: term.slug });
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      definedTerm(term),
      breadcrumb([{ name: 'Blog', path: '/' }, { name: 'Glossário', path: '/glossario' }, { name: term.term, path: `/glossario/${term.slug}` }]),
    ],
  };
  return (
    <Shell current="/glossario">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
      <article className="bs-article blog-term">
        <header>
          <a className="bs-article__kicker" href="/glossario">Glossário</a>
          <h1 className="bs-article__title" data-scramble="load">{term.term}</h1>
          {term.fullName ? <p className="blog-term__full">{term.fullName}</p> : null}
          <p className="bs-article__lead">{term.short}</p>
        </header>
        <div className="bs-prose"><PortableText value={body} /></div>
      </article>
      {posts.length ? (
        <section className="bs-section" aria-labelledby="h-posts-termo">
          <div className="bs-container">
            <CodeDivider className="bs-shead-divider" />
            <SectionHeader id="h-posts-termo" kicker="No blog" title={{ before: 'Posts que usam ', em: 'este termo', after: '' }} />
            <BlogGrid posts={posts} headingLevel={3} />
          </div>
        </section>
      ) : null}
    </Shell>
  );
}
