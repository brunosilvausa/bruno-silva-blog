import { site } from '@/content/site';
import PostList from '@/components/PostList';

export const revalidate = 60;

export default function Home() {
  return <PostList page={1} header={site.home} current="/" />;
}
