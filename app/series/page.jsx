import { notFound } from 'next/navigation';
import { getSeriesList } from '@/lib/sanity';
import { FEED_TYPES } from '@/lib/feed';
import { breadcrumb, jsonLd } from '@/lib/jsonld';
import { imageSrcSet, imageUrl } from '@/lib/image';
import Shell from '@/components/Shell';
import SectionHeader from '@/components/SectionHeader';

export const revalidate = 60;

const DESCRIPTION = 'Posts em sequência, para ler na ordem: do primeiro passo ao último.';
const STRIPES = [13, 58, 103, 148, 193];

export const metadata = {
  title: 'Séries | Bruno Silva USA',
  description: DESCRIPTION,
  alternates: { canonical: '/series', types: FEED_TYPES },
};

/** Series card, same visual language as the DS BlogCard (one link; cover or the flag stripes). */
function SeriesCard({ series }) {
  return (
    <a className="bs-bcard" href={`/series/${series.slug}`} data-reveal>
      <div className="bs-bcard__cover">
        {series.cover ? (
          <img
            src={imageUrl(series.cover.url, 960, { h: 540, fit: 'crop' })}
            srcSet={imageSrcSet(series.cover.url, [480, 720, 960, 1280], { ratio: 9 / 16, fit: 'crop' })}
            sizes="(max-width: 760px) calc(100vw - 48px), 360px"
            alt={series.cover.alt}
            width="960"
            height="540"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <svg className="bs-flag" viewBox="0 0 400 225" preserveAspectRatio="none" aria-hidden="true">
            {STRIPES.map((y) => <rect key={y} x="0" y={y} width="400" height="15" />)}
          </svg>
        )}
      </div>
      <span className="bs-bcard__kicker">Série</span>
      <h2 className="bs-bcard__title">{series.title}</h2>
      {series.description ? <p className="bs-bcard__excerpt">{series.description}</p> : null}
      <span className="bs-bcard__meta">{series.count === 1 ? '1 parte' : `${series.count} partes`}</span>
    </a>
  );
}

export default async function SeriesIndexPage() {
  const list = await getSeriesList();
  if (!list.length) notFound();
  const data = {
    '@context': 'https://schema.org',
    '@graph': [breadcrumb([{ name: 'Blog', path: '/' }, { name: 'Séries', path: '/series' }])],
  };
  return (
    <Shell current="/series">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
      <section className="bs-section">
        <div className="bs-container">
          <SectionHeader level={1} title={{ before: '', em: 'Séries', after: '' }} text={DESCRIPTION} />
          <div className="bs-blog" data-reveal-stagger>
            {list.map((s) => <SeriesCard key={s.id} series={s} />)}
          </div>
        </div>
      </section>
    </Shell>
  );
}
