import { notFound } from 'next/navigation';
import { getMaterials } from '@/lib/sanity';
import { site } from '@/content/site';
import { breadcrumb, jsonLd } from '@/lib/jsonld';
import Shell from '@/components/Shell';
import ListHero from '@/components/ListHero';
import MaterialFilter from '@/components/MaterialFilter';
import BlogCard from '@/components/BlogCard';
import NewsletterSignup from '@/components/NewsletterSignup';

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
      <ListHero header={{ title: { before: 'Central de ', em: 'Conteúdo', after: '' }, text: DESCRIPTION }} />
      <section className="bs-section blog-posts" id="materiais" aria-label="Materiais">
        <div className="bs-container">
          <MaterialFilter materials={materials} />
          <div className="bs-blog bs-blog--central" data-material-list data-reveal-stagger data-spotlight>
            {materials.map((m) => (
              <BlogCard key={m.id} variant="reel" material={m} headingLevel={2} spotlight />
            ))}
          </div>
        </div>
      </section>
      <NewsletterSignup data={site.newsletter} latestHref={null} />
    </Shell>
  );
}
