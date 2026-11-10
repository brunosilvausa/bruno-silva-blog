import { pillarOf } from '@/lib/pillars';

function Item({ post, dir }) {
  if (!post) return <span className="blog-adjacent__empty" aria-hidden="true" />;
  const label = dir === 'prev' ? 'Anterior' : 'Próximo';
  return (
    <a className={`blog-adjacent__link blog-adjacent__link--${dir}`} href={`/posts/${post.slug}`} rel={dir}>
      <span className="blog-adjacent__dir">
        {dir === 'prev' ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg> : null}
        {label}
        {dir === 'next' ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg> : null}
      </span>
      <span className="blog-adjacent__kicker">{pillarOf(post.pillar).label}</span>
      <span className="blog-adjacent__title">{post.title}</span>
    </a>
  );
}

/** Previous (older) and next (newer) post. Renders nothing when there is neither. */
export default function PostNav({ prev, next }) {
  if (!prev && !next) return null;
  return (
    <nav className="blog-adjacent" aria-label="Outros posts">
      <Item post={prev} dir="prev" />
      <Item post={next} dir="next" />
    </nav>
  );
}
