import { notFound } from 'next/navigation';
import { site } from '@/content/site';
import { PILLARS, pillarBySlug } from '@/lib/pillars';
import PostList, { pillarHeader } from '@/components/PostList';

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
    alternates: { canonical: `/pilar/${pillar.slug}` },
  };
}

export default async function PillarPage({ params }) {
  const pillar = pillarBySlug((await params).pilar);
  if (!pillar) notFound();
  const base = `/pilar/${pillar.slug}`;
  return <PostList page={1} pillar={pillar} header={pillarHeader(pillar)} current={base} base={base} />;
}
