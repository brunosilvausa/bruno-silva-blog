import { FEED_TYPES } from '@/lib/feed';
import { notFound } from 'next/navigation';
import { site } from '@/content/site';
import { PILLARS, pillarBySlug } from '@/lib/pillars';
import PostList, { pillarHeader } from '@/components/PostList';
import { breadcrumb, jsonLd } from '@/lib/jsonld';
import { absolute } from '@/lib/site-url';

export const revalidate = 60;
export const dynamicParams = false;

export function generateStaticParams() {
  return PILLARS.map((p) => ({ pilar: p.slug }));
}

export async function generateMetadata({ params }) {
  const pillar = pillarBySlug((await params).pilar);
  if (!pillar) return {};
  return {
    title: `${pillar.label} | ${site.meta.title}`,
    description: site.pillarPage.texts[pillar.slug],
    alternates: { canonical: `/pilar/${pillar.slug}`, types: FEED_TYPES },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      siteName: 'Bruno Silva USA',
      title: `${pillar.label} | ${site.meta.title}`,
      description: site.pillarPage.texts[pillar.slug],
      images: [{ url: `/og/pilar/${pillar.slug}`, width: 1200, height: 630, alt: pillar.label }],
    },
    twitter: { card: 'summary_large_image', title: `${pillar.label} | ${site.meta.title}`, description: site.pillarPage.texts[pillar.slug], images: [`/og/pilar/${pillar.slug}`] },
  };
}

export default async function PillarPage({ params }) {
  const pillar = pillarBySlug((await params).pilar);
  if (!pillar) notFound();
  const base = `/pilar/${pillar.slug}`;
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', name: pillar.label, description: site.pillarPage.texts[pillar.slug], url: absolute(base), inLanguage: 'pt-BR', isPartOf: { '@id': absolute('/#site') } },
      breadcrumb([{ name: 'Blog', path: '/' }, { name: pillar.label, path: base }]),
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
      <PostList page={1} pillar={pillar} header={pillarHeader(pillar)} current={base} base={base} />
    </>
  );
}
