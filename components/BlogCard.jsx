import Img from './Img';
import { imageSrcSet, imageUrl } from '@/lib/image';
import { pillarOf } from '@/lib/pillars';
import { formatDate } from '@/lib/format';

const STRIPES = [13, 58, 103, 148, 193];

function Cover({ post, pillar, featured }) {
  return (
    <div className="bs-bcard__cover">
      {post.cover ? (
        <img
          src={imageUrl(post.cover.url, 960, { h: 540, fit: 'crop' })}
          srcSet={imageSrcSet(post.cover.url, [480, 720, 960, 1280], { ratio: 9 / 16, fit: 'crop' })}
          sizes={featured ? '(max-width: 760px) calc(100vw - 48px), 600px' : '(max-width: 760px) calc(100vw - 48px), 360px'}
          alt={post.cover.alt}
          width="960"
          height="540"
          loading="lazy"
          decoding="async"
        />
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
export default function BlogCard({ post, featured = false, headingLevel = 3, spotlight = false }) {
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
    <a className={`bs-bcard${featured ? ' bs-bcard--featured' : ''}${spotlight ? ' bs-spotlight' : ''}`} href={`/posts/${post.slug}`} data-reveal="rise">
      <Cover post={post} pillar={pillar} featured={featured} />
      {featured ? <div className="bs-bcard__body">{text}</div> : text}
    </a>
  );
}
