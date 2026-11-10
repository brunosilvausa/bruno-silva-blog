import PortableText from './PortableText';
import ShareButton from './ShareButton';
import { imageSize, imageSrcSet, imageUrl } from '@/lib/image';
import { pillarOf } from '@/lib/pillars';
import { formatDate } from '@/lib/format';

/** DS ArticleLayout: reading-progress bar, 680px column, header with byline, prose body and author box. */
export default function Article({ post, fallbackAuthor, shareUrl }) {
  const pillar = pillarOf(post.pillar);
  const author = {
    name: post.author?.name || fallbackAuthor.name,
    bio: post.author?.bio || fallbackAuthor.bio,
    image: post.author?.image ? `${post.author.image}?w=144&h=144&fit=crop&auto=format` : fallbackAuthor.image,
  };
  return (
    <>
      <div className="bs-progress" role="progressbar" aria-label="Progresso da leitura" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} data-progress=".bs-article"></div>
      <article className="bs-article">
        <header>
          <a className="bs-article__kicker" href={`/pilar/${pillar.slug}`}>{pillar.label}</a>
          <h1 className="bs-article__title">{post.title}</h1>
          {post.lead ? <p className="bs-article__lead">{post.lead}</p> : null}
          <div className="bs-article__byline">
            <img src={author.image} alt="" width="72" height="72" decoding="async" />
            <span><b>{author.name}</b> • <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> • {post.minutes} min de leitura</span>
          </div>
        </header>
        <div className="bs-prose">
          {post.cover ? (
            // The cover keeps its colours inside the post; cards (and images in the text) stay black and white.
            <figure className="blog-cover">
              {/* Phones get a 640px file, desktops up to 1360px; width/height reserve the space so the text doesn't jump. */}
              <img
                src={imageUrl(post.cover.url, 1360, { fit: 'max' })}
                srcSet={imageSrcSet(post.cover.url, [640, 960, 1360])}
                sizes="(max-width: 728px) calc(100vw - 48px), 680px"
                {...(imageSize(post.cover.url) || {})}
                alt={post.cover.alt}
                fetchPriority="high"
                decoding="async"
              />
              {post.cover.caption ? <figcaption>{post.cover.caption}</figcaption> : null}
            </figure>
          ) : null}
          <PortableText value={post.body} />
        </div>
        {shareUrl ? (
          <div className="blog-share">
            <p>Gostou? Mande para alguém</p>
            <ShareButton url={shareUrl} title={post.title} text={post.lead || post.description} />
          </div>
        ) : null}
        <aside className="bs-author" aria-label="Sobre o autor">
          <img src={author.image} alt="" width="144" height="144" loading="lazy" decoding="async" />
          <div>
            <div className="bs-author__name">{author.name}</div>
            <p className="bs-author__bio">{author.bio}</p>
          </div>
        </aside>
      </article>
    </>
  );
}
