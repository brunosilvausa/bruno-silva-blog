/** Box before the previous/next nav: the next part of the series, or a link to the whole series on the last part. */
export default function SeriesNext({ series }) {
  if (!series) return null;
  const next = series.parts[series.index];
  if (next) {
    return <a className="bs-seriesnext" href={`/posts/${next.slug}`}><span>Próxima parte:</span>{' '}<b>{next.title}</b></a>;
  }
  return <a className="bs-seriesnext" href={`/series/${series.slug}`}><span>Série completa</span>{' '}<b>Ver a série completa</b></a>;
}
