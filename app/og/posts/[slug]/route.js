import { getPost } from '@/lib/sanity';
import { pillarOf } from '@/lib/pillars';
import { ogResponse } from '@/lib/og-response';

// Link preview of a post without a cover photo (posts with a cover use the cover).
export async function GET(_req, { params }) {
  const post = await getPost((await params).slug);
  if (!post) return new Response('Not found', { status: 404 });
  return ogResponse({ kicker: pillarOf(post.pillar).label, title: post.title });
}
