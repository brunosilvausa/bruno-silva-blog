import { notFound, permanentRedirect } from 'next/navigation';
import { site, URL_INSTAGRAM } from '@/content/site';
import { getMaterial, getMaterialRedirect, getMaterials, getTerms } from '@/lib/sanity';
import { MATERIAL_KINDS, kindAccent } from '@/lib/materials';
import { linkTerms } from '@/lib/terms';
import { safeHref } from '@/lib/safe-href';
import { absolute } from '@/lib/site-url';
import { AUTHOR, breadcrumb, jsonLd as toJson } from '@/lib/jsonld';
import Shell from '@/components/Shell';
import PortableText from '@/components/PortableText';
import MaterialEnd from '@/components/MaterialEnd';

export const revalidate = 60;

const kindLabel = (kind) => MATERIAL_KINDS.find((k) => k.value === kind)?.label || 'Material';

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
  return (
    <Shell current="/central">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(m) }} />
      <article className="bs-article">
        <header>
          <a className="blog-back" href="/central">‹ Central</a>
          <div className="bs-matcover" style={{ '--accent': kindAccent(m.kind) }}>
            {m.cover ? (
              <div className="bs-matcover__media"><img src={m.cover.url} alt={m.cover.alt || ''} style={{ objectPosition: `${(m.cover.fpX ?? 0.5) * 100}% ${(m.cover.fpY ?? 0.5) * 100}%` }} /></div>
            ) : (
              <div className="bs-matcover__media" aria-hidden="true" />
            )}
            <div className="bs-matcover__over">
              <span className="bs-matcover__kind">{kindLabel(m.kind)}</span>
              <h1 className="bs-matcover__title" data-scramble="load">{m.title}</h1>
              {video ? <a className="bs-matcover__play" href={video} target="_blank" rel="noopener" aria-label="Assistir ao vídeo"></a> : null}
            </div>
          </div>
        </header>
        <div className="bs-prose blog-material">
          <PortableText value={body} />
        </div>
        <MaterialEnd next={m.next} instagram={URL_INSTAGRAM} />
      </article>
    </Shell>
  );
}
