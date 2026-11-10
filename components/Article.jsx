import PortableText from './PortableText';
import ShareButton from './ShareButton';
import TableOfContents from './TableOfContents';
import PostNav from './PostNav';
import { tableOfContents } from '@/lib/headings';
import { imageSize, imageSrcSet, imageUrl } from '@/lib/image';
import { pillarOf } from '@/lib/pillars';
import { formatDate } from '@/lib/format';

/** DS ArticleLayout: reading-progress bar, 680px column, header with byline, prose body and author box. */
export default function Article({ post, fallbackAuthor, shareUrl, prev, next }) {
  const toc = tableOfContents(post.body);
  // Show "Atualizado em" only for a real revision: a later calendar day, at least a day after publishing.
  const revised = post.updatedAt && formatDate(post.updatedAt) !== formatDate(post.publishedAt)
    && new Date(post.updatedAt) - new Date(post.publishedAt) > 24 * 3600 * 1000;
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
          <h1 className="bs-article__title" data-scramble="load">{post.title}</h1>
          {post.lead ? <p className="bs-article__lead" data-mask="lines">{post.lead}</p> : null}
          <div className="bs-article__byline">
            <img src={author.image} alt="" width="72" height="72" decoding="async" />
            <span><b>{author.name}</b> • <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> • {post.minutes} min de leitura{revised ? <> • Atualizado em <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time></> : null}</span>
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
          <TableOfContents items={toc.items} />
          <PortableText value={post.body} ids={toc.ids} />
        </div>
        {shareUrl ? (
          <div className="blog-share">
            <p>Gostou? Mande para alguém</p>
            <ShareButton url={shareUrl} title={post.title} text={post.lead || post.description} />
          </div>
        ) : null}
        <PostNav prev={prev} next={next} />
        <aside className="bs-author" aria-label="Sobre o autor">
          <img src={author.image} alt="" width="144" height="144" loading="lazy" decoding="async" />
          <div>
            <div className="bs-author__name">{author.name}</div>
            <p className="bs-author__bio">{author.bio}</p>
            {fallbackAuthor.aboutHref ? <a className="bs-link blog-author__more" href={fallbackAuthor.aboutHref}>{fallbackAuthor.aboutLabel} <svg className="bs-btn__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a> : null}
          </div>
        </aside>
      </article>
    </>
  );
}
