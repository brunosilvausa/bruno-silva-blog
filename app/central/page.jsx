import { notFound } from 'next/navigation';
import { getMaterials } from '@/lib/sanity';
import { MATERIAL_KINDS, kindAccent, shortDate } from '@/lib/materials';
import { breadcrumb, jsonLd } from '@/lib/jsonld';
import Shell from '@/components/Shell';
import SectionHeader from '@/components/SectionHeader';
import MaterialFilter from '@/components/MaterialFilter';

export const revalidate = 60;

const DESCRIPTION = 'Prompts e passo a passo dos vídeos, prontos para copiar.';

export const metadata = {
  title: 'Central de Conteúdo | Bruno Silva USA',
  description: DESCRIPTION,
  alternates: { canonical: '/central' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Bruno Silva USA',
    title: 'Central de Conteúdo | Bruno Silva USA',
    description: DESCRIPTION,
    images: [{ url: '/og/central', width: 1200, height: 630, alt: 'Central de Conteúdo' }],
  },
  twitter: { card: 'summary_large_image', title: 'Central de Conteúdo | Bruno Silva USA', description: DESCRIPTION, images: ['/og/central'] },
};

const labelOf = (kind) => MATERIAL_KINDS.find((k) => k.value === kind)?.label || 'Material';

export default async function CentralPage() {
  const materials = await getMaterials();
  if (!materials.length) notFound();
  const data = {
    '@context': 'https://schema.org',
    '@graph': [breadcrumb([{ name: 'Blog', path: '/' }, { name: 'Central', path: '/central' }])],
  };
  return (
    <Shell current="/central">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
      <section className="bs-section">
        <div className="bs-container">
          <SectionHeader level={1} title={{ before: '', em: 'Central de Conteúdo', after: '' }} text={DESCRIPTION} />
          <MaterialFilter />
          <ul className="bs-matlist" data-spotlight>
            {materials.map((m, i) => {
              const label = labelOf(m.kind);
              const day = m.videoDate ? shortDate(m.videoDate) : '';
              const card = (
                <a className="bs-material bs-spotlight" style={{ '--accent': kindAccent(m.kind) }} href={`/central/${m.slug}`} data-kind={m.kind} data-kind-label={label}>
                  <span className="bs-material__media" aria-hidden={m.cover ? undefined : 'true'}>
                    {m.cover ? <img src={m.cover.url} alt={m.cover.alt || ''} loading="lazy" style={{ objectPosition: `${(m.cover.fpX ?? 0.5) * 100}% ${(m.cover.fpY ?? 0.5) * 100}%` }} /> : null}
                  </span>
                  <span className="bs-material__body">
                    <span className="bs-material__meta">
                      <span className="bs-material__kind">{label}</span>
                      {day ? <span className="bs-material__date">▸ {day}</span> : null}
                    </span>
                    <h2 className="bs-material__title">{m.title}</h2>
                    <p className="bs-material__summary">{m.summary}</p>
                  </span>
                </a>
              );
              return <li key={m.id}>{i === 0 ? <div className="bs-orbit">{card}</div> : card}</li>;
            })}
          </ul>
        </div>
      </section>
    </Shell>
  );
}
