import { notFound } from 'next/navigation';
import { getSeries, getSeriesList } from '@/lib/sanity';
import { FEED_TYPES } from '@/lib/feed';
import { breadcrumb, jsonLd, seriesGraph } from '@/lib/jsonld';
import Shell from '@/components/Shell';

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getSeriesList()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const series = await getSeries((await params).slug);
  if (!series || !series.parts.length) return {};
  const title = `${series.title} | Séries | Bruno Silva USA`;
  const description = series.description || `${series.title}: ${series.parts.length} posts para ler em sequência.`;
  return {
    title,
    description,
    alternates: { canonical: `/series/${series.slug}`, types: FEED_TYPES },
    openGraph: { type: 'website', locale: 'pt_BR', siteName: 'Bruno Silva USA', title, description },
    twitter: { card: 'summary', title, description },
  };
}

export default async function SeriesPage({ params }) {
  const series = await getSeries((await params).slug);
  if (!series || !series.parts.length) notFound();
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      ...seriesGraph(series),
      breadcrumb([{ name: 'Blog', path: '/' }, { name: 'Séries', path: '/series' }, { name: series.title, path: `/series/${series.slug}` }]),
    ],
  };
  return (
    <Shell current="/series">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
      <section className="bs-section">
        <div className="bs-container">
          <header className="bs-serieshead">
            <a className="bs-article__kicker" href="/series">Séries</a>
            <h1 className="bs-article__title" data-scramble="load">{series.title}</h1>
            {series.description ? <p className="bs-article__lead">{series.description}</p> : null}
          </header>
          <ol className="bs-serieslist">
            {series.parts.map((p, i) => (
              <li key={p.id}>
                <span className="bs-serieslist__num" aria-hidden="true">{i + 1}</span>
                <div className="bs-serieslist__body">
                  <a className="bs-serieslist__title" href={`/posts/${p.slug}`}>{p.title}</a>
                  {p.excerpt ? <p className="bs-serieslist__excerpt">{p.excerpt}</p> : null}
                  <span className="bs-serieslist__meta">{p.minutes} min</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </Shell>
  );
}
