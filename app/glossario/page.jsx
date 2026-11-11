import { notFound } from 'next/navigation';
import { getTerms } from '@/lib/sanity';
import { FEED_TYPES } from '@/lib/feed';
import { breadcrumb, definedTermSet, jsonLd } from '@/lib/jsonld';
import Shell from '@/components/Shell';
import SectionHeader from '@/components/SectionHeader';
import Glossary from '@/components/Glossary';

export const revalidate = 60;

const DESCRIPTION = 'Termos americanos de empresa, impostos e tecnologia explicados em português.';

export const metadata = {
  title: 'Glossário | Bruno Silva USA',
  description: DESCRIPTION,
  alternates: { canonical: '/glossario', types: FEED_TYPES },
};

export default async function GlossaryPage() {
  const terms = await getTerms();
  if (!terms.length) notFound();
  const data = {
    '@context': 'https://schema.org',
    '@graph': [definedTermSet(terms), breadcrumb([{ name: 'Blog', path: '/' }, { name: 'Glossário', path: '/glossario' }])],
  };
  return (
    <Shell current="/glossario">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
      <section className="bs-section">
        <div className="bs-container">
          <SectionHeader level={1} title={{ before: '', em: 'Glossário', after: '' }} text={DESCRIPTION} />
          <Glossary terms={terms} />
        </div>
      </section>
    </Shell>
  );
}
