import { notFound } from 'next/navigation';
import { getMaterials } from '@/lib/sanity';
import { MATERIAL_KINDS } from '@/lib/materials';
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
          <ul className="bs-matlist">
            {materials.map((m) => {
              const label = labelOf(m.kind);
              return (
                <li key={m.id}>
                  <a className="bs-material" href={`/central/${m.slug}`} data-kind={m.kind} data-kind-label={label}>
                    <span className="bs-material__head">
                      <span className="bs-material__kind">{label}</span>
                      {typeof m.minutes === 'number' ? <span className="bs-material__min">{m.minutes} min</span> : null}
                    </span>
                    <h2 className="bs-material__title">{m.title}</h2>
                    <p className="bs-material__summary">{m.summary}</p>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </Shell>
  );
}
