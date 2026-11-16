import Img from './Img';
import { imageSrcSet, imageUrl } from '@/lib/image';
import { pillarOf } from '@/lib/pillars';
import { formatDate } from '@/lib/format';
import { kindAccent, kindLabel, videoSuffix } from '@/lib/materials';

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

/** 4:5 cover of a material (reel variant): the 900x1125 crop with its focal point, or the kind colour when there is no image. */
function ReelCover({ material }) {
  const c = material.cover;
  return (
    <div className="bs-bcard__cover bs-bcard__cover--reel">
      {c ? (
        <img
          src={c.url}
          alt={c.alt || ''}
          width="900"
          height="1125"
          loading="lazy"
          decoding="async"
          style={{ objectPosition: `${(c.fpX ?? 0.5) * 100}% ${(c.fpY ?? 0.5) * 100}%` }}
        />
      ) : null}
    </div>
  );
}

/** Reel variant of the DS BlogCard for a material of the Central: 4:5 cover, kicker = kind, same title and meta line as posts. */
function ReelCard({ material, headingLevel, spotlight }) {
  const Heading = `h${headingLevel}`;
  return (
    <a
      className={`bs-bcard bs-bcard--reel${spotlight ? ' bs-spotlight' : ''}`}
      style={{ '--accent': kindAccent(material.kind) }}
      href={`/central/${material.slug}`}
      data-kind={material.kind}
      data-reveal
    >
      <ReelCover material={material} />
      <span className="bs-bcard__kicker">{kindLabel(material.kind)}</span>
      <Heading className="bs-bcard__title">{material.title}</Heading>
      <span className="bs-bcard__meta">
        <time dateTime={material.publishedAt}>{formatDate(material.publishedAt)}</time>
        {videoSuffix(material)}
      </span>
    </a>
  );
}

/** DS BlogCard: the whole card is one link. `variant="reel"` renders a `material` instead of a `post`. `featured` spans the row (newest post). `headingLevel` keeps the outline right. */
export default function BlogCard({ post, material, variant, featured = false, headingLevel = 3, spotlight = false }) {
  if (variant === 'reel') return <ReelCard material={material} headingLevel={headingLevel} spotlight={spotlight} />;
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
    <a className={`bs-bcard${featured ? ' bs-bcard--featured' : ''}${spotlight ? ' bs-spotlight' : ''}`} href={`/posts/${post.slug}`} data-reveal>
      <Cover post={post} pillar={pillar} featured={featured} />
      {featured ? <div className="bs-bcard__body">{text}</div> : text}
    </a>
  );
}
