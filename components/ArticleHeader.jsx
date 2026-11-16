import { formatDate } from '@/lib/format';

/**
 * Header shared by posts and Central materials: kicker, Orbitron h1, lead and the author line.
 * `kicker` is a ready element (pillar link or kind label), `extra` continues the author line after the date,
 * `before` goes above the kicker (back link) and `children` below the author line (series bar).
 */
export default function ArticleHeader({ kicker, title, lead, author, date, extra, before, children }) {
  return (
    <header>
      {before}
      {kicker}
      <h1 className="bs-article__title" data-scramble="load">{title}</h1>
      {lead ? <p className="bs-article__lead" data-mask="lines">{lead}</p> : null}
      <div className="bs-article__byline">
        <img src={author.image} alt="" width="72" height="72" decoding="async" />
        <span><b>{author.name}</b> • <time dateTime={date}>{formatDate(date)}</time>{extra}</span>
      </div>
      {children}
    </header>
  );
}
