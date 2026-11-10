/**
 * "Neste post": links to the post's subtitles. Shown only when the post has `min` or more H2s.
 * Open list on wider screens; on phones a tap-to-open <details>, so it doesn't push the text down.
 * (Only one of the two is ever displayed, so screen readers meet a single index.)
 */
export default function TableOfContents({ items, min = 3, title = 'Neste post' }) {
  if (!items || items.length < min) return null;
  const list = (
    <ol>
      {items.map((i) => (
        <li key={i.id}><a href={`#${i.id}`}>{i.text}</a></li>
      ))}
    </ol>
  );
  return (
    <>
      <nav className="blog-toc blog-toc--open" aria-label={title}>
        <p className="blog-toc__title">{title}</p>
        {list}
      </nav>
      <details className="blog-toc blog-toc--fold">
        <summary>{title} <span>({items.length} seções)</span></summary>
        <nav aria-label={title}>{list}</nav>
      </details>
    </>
  );
}
