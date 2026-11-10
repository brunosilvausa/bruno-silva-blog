import { FEED_TYPES } from '@/lib/feed';
import { notFound, permanentRedirect } from 'next/navigation';
import { site } from '@/content/site';
import { pillarBySlug } from '@/lib/pillars';
import PostList, { parsePage, pillarHeader } from '@/components/PostList';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { pilar, n } = await params;
  const pillar = pillarBySlug(pilar);
  if (!pillar) return {};
  return { title: `${pillar.label}, página ${n} | ${site.meta.title}`, alternates: { canonical: `/pilar/${pillar.slug}/pagina/${n}`, types: FEED_TYPES } };
}

export default async function PillarPageN({ params }) {
  const { pilar, n } = await params;
  const pillar = pillarBySlug(pilar);
  if (!pillar) notFound();
  const base = `/pilar/${pillar.slug}`;
  const page = parsePage(n);
  if (page === 1) permanentRedirect(base);
  return <PostList page={page} pillar={pillar} header={pillarHeader(pillar)} current={base} base={base} />;
}
