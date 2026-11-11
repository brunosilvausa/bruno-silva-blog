/** DS SeriesBar: "Parte X de Y" strip under the byline; opens the list of parts (native <details>, no script). */
export default function SeriesBar({ series }) {
  if (!series) return null;
  return (
    <details className="bs-seriesbar">
      <summary><span><b>Parte {series.index} de {series.total}</b> · {series.title}</span></summary>
      <ol>
        {series.parts.map((part, i) => (
          i + 1 === series.index
            ? <li key={part.slug} aria-current="page">{part.title}</li>
            : <li key={part.slug}><a href={`/posts/${part.slug}`}>{part.title}</a></li>
        ))}
      </ol>
      <a href={`/series/${series.slug}`}>Ver a série completa</a>
    </details>
  );
}
