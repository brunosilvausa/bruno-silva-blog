import Img from './Img';
import { pillarOf } from '@/lib/pillars';
import { formatDate } from '@/lib/format';

const STRIPES = [13, 58, 103, 148, 193];

function Cover({ post, pillar }) {
  return (
    <div className="bs-bcard__cover">
      {post.cover ? (
        <img src={`${post.cover.url}?w=960&h=540&fit=crop&auto=format`} alt={post.cover.alt} width="960" height="540" loading="lazy" decoding="async" />
      ) : (
        <>
          <svg className="bs-flag" viewBox="0 0 400 225" preserveAspectRatio="none" aria-hidden="true">
            {STRIPES.map((y) => <rect key={y} x="0" y={y} width="400" height="15" />)}
          </svg>
          <Img lazy className="bs-bcard__icon" src={pillar.icon} alt="" />
        </>
      )}
    </div>
  );
}

/** DS BlogCard: the whole card is one link. `featured` spans the row (newest post). `headingLevel` keeps the outline right. */
export default function BlogCard({ post, featured = false, headingLevel = 3 }) {
  const pillar = pillarOf(post.pillar);
  const Heading = `h${headingLevel}`;
  const date = formatDate(post.publishedAt);
  const text = (
    <>
      <span className="bs-bcard__kicker">{pillar.label}</span>
      <Heading className="bs-bcard__title">{post.title}</Heading>
      {post.excerpt ? <p className="bs-bcard__excerpt">{post.excerpt}</p> : null}
      <span className="bs-bcard__meta">
        <time dateTime={post.publishedAt}>{date}</time> • {post.minutes} min{featured ? ' de leitura' : ''}
      </span>
    </>
  );
  return (
    <a className={`bs-bcard${featured ? ' bs-bcard--featured' : ''}`} href={`/posts/${post.slug}`} data-reveal>
      <Cover post={post} pillar={pillar} />
      {featured ? <div className="bs-bcard__body">{text}</div> : text}
    </a>
  );
}
