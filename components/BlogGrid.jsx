import BlogCard from './BlogCard';

/** DS BlogCard grid. `featureFirst` makes the first post the wide featured card. */
export default function BlogGrid({ posts, featureFirst = false, label, headingLevel = 3 }) {
  if (!posts.length) return null;
  return (
    <div className="bs-blog" data-reveal-stagger role={label ? 'region' : undefined} aria-label={label}>
      {posts.map((post, i) => (
        <BlogCard key={post.id} post={post} featured={featureFirst && i === 0} headingLevel={headingLevel} />
      ))}
    </div>
  );
}
