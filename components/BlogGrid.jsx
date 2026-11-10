import BlogCard from './BlogCard';

/** DS BlogCard grid. `featureFirst` makes the first post the wide featured card. */
/** `spotlight` adds the DS Spotlight (a volt light following the mouse); at most two spotlit grids per page. */
export default function BlogGrid({ posts, featureFirst = false, label, headingLevel = 3, spotlight = false }) {
  if (!posts.length) return null;
  return (
    <div className="bs-blog" data-reveal-stagger data-spotlight={spotlight ? true : undefined} role={label ? 'region' : undefined} aria-label={label}>
      {posts.map((post, i) => (
        <BlogCard key={post.id} post={post} featured={featureFirst && i === 0} headingLevel={headingLevel} spotlight={spotlight} />
      ))}
    </div>
  );
}
