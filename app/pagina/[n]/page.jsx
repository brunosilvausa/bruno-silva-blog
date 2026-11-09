import { permanentRedirect } from 'next/navigation';
import { site } from '@/content/site';
import PostList, { parsePage } from '@/components/PostList';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { n } = await params;
  return { title: `Página ${n} | ${site.meta.title}`, alternates: { canonical: `/pagina/${n}` } };
}

export default async function HomePage({ params }) {
  const { n } = await params;
  const page = parsePage(n);
  if (page === 1) permanentRedirect('/');
  return <PostList page={page} header={site.home} current="/" />;
}
