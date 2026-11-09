const hrefFor = (base, page) => (page <= 1 ? base || '/' : `${base}/pagina/${page}`);

/** Previous / next links between list pages. `base` is '' for the home list or '/pilar/x' for a pillar. */
export default function Pagination({ page, totalPages, base = '' }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="blog-pages" aria-label="Páginas de posts">
      {page > 1 ? <a className="bs-btn bs-btn--outline" href={hrefFor(base, page - 1)} rel="prev">Posts mais novos</a> : <span />}
      <span className="blog-pages__count">Página {page} de {totalPages}</span>
      {page < totalPages ? <a className="bs-btn bs-btn--outline" href={hrefFor(base, page + 1)} rel="next">Posts mais antigos</a> : <span />}
    </nav>
  );
}
