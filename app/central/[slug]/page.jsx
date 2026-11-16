import { notFound, permanentRedirect } from 'next/navigation';
import { site, URL_INSTAGRAM } from '@/content/site';
import { getMaterial, getMaterialRedirect, getMaterials, getTerms } from '@/lib/sanity';
import { MATERIAL_TOC_MIN, kindAccent, kindLabel } from '@/lib/materials';
import { tableOfContents } from '@/lib/headings';
import { linkTerms } from '@/lib/terms';
import { safeHref } from '@/lib/safe-href';
import { absolute } from '@/lib/site-url';
import { AUTHOR, breadcrumb, jsonLd as toJson } from '@/lib/jsonld';
import Shell from '@/components/Shell';
import PortableText from '@/components/PortableText';
import ArticleHeader from '@/components/ArticleHeader';
import MaterialEnd from '@/components/MaterialEnd';
import TableOfContents from '@/components/TableOfContents';

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getMaterials()).map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }) {
  const m = await getMaterial((await params).slug);
  if (!m) return {};
  const title = `${m.title} | Central | Bruno Silva USA`;
  const image = `/og/central/${m.slug}`;
  return {
    title,
    description: m.summary,
    alternates: { canonical: `/central/${m.slug}` },
    openGraph: {
      type: 'article',
      locale: 'pt_BR',
      siteName: 'Bruno Silva USA',
      title: m.title,
      description: m.summary,
      publishedTime: m.publishedAt,
      images: [{ url: image, width: 1200, height: 630, alt: m.title }],
    },
    twitter: { card: 'summary_large_image', title: m.title, description: m.summary, images: [image] },
  };
}

function jsonLd(m) {
  const url = absolute(`/central/${m.slug}`);
  return toJson({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        name: m.title,
        description: m.summary,
        datePublished: m.publishedAt,
        inLanguage: 'pt-BR',
        genre: kindLabel(m.kind),
        author: { '@type': 'Person', name: site.author.name, url: AUTHOR.url },
        publisher: AUTHOR,
        mainEntityOfPage: url,
        image: absolute(`/og/central/${m.slug}`),
      },
      breadcrumb([{ name: 'Blog', path: '/' }, { name: 'Central', path: '/central' }, { name: m.title, path: `/central/${m.slug}` }]),
    ],
  });
}

export default async function MaterialPage({ params }) {
  const { slug } = await params;
  const m = await getMaterial(slug);
  if (!m) {
    const moved = await getMaterialRedirect(slug);
    if (moved) permanentRedirect(`/central/${moved}`);
    notFound();
  }
  const terms = await getTerms().catch(() => []);
  const body = linkTerms(m.body, terms);
  const video = safeHref(m.videoUrl, null);
  const toc = tableOfContents(body);
  return (
    <Shell current="/central">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(m) }} />
      <article className="bs-article">
        <ArticleHeader
          before={<a className="blog-back" href="/central">‹ Central</a>}
          kicker={<span className="bs-article__kicker">{kindLabel(m.kind)}</span>}
          title={m.title}
          lead={m.summary}
          author={site.author}
          date={m.publishedAt}
          extra={video ? <> • <a className="blog-byline__video" href={video} target="_blank" rel="noopener">▸ Assistir ao vídeo</a></> : null}
        />
        <figure className="blog-matcover" style={{ '--accent': kindAccent(m.kind) }}>
          {m.cover ? (
            <img src={m.cover.url} alt={m.cover.alt || ''} width="900" height="1125" fetchPriority="high" decoding="async" style={{ objectPosition: `${(m.cover.fpX ?? 0.5) * 100}% ${(m.cover.fpY ?? 0.5) * 100}%` }} />
          ) : null}
        </figure>
        <div className="bs-prose blog-material">
          <TableOfContents items={toc.items} min={MATERIAL_TOC_MIN} title="Neste material" />
          <PortableText value={body} ids={toc.ids} />
        </div>
        <MaterialEnd next={m.next} instagram={URL_INSTAGRAM} />
      </article>
    </Shell>
  );
}
