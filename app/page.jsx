import { site } from '@/content/site';
import PostList from '@/components/PostList';
import { blogGraph, jsonLd } from '@/lib/jsonld';

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(blogGraph({ name: site.meta.title, description: site.meta.description })) }} />
      <PostList page={1} header={site.home} current="/" />
    </>
  );
}
