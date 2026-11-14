import { URL_CONSULTORIA, URL_IA_DO_ZERO } from '@/content/site';

/** End of a Central material: next material, follow link (only with an Instagram address) and the two offers. */
export default function MaterialEnd({ next, instagram }) {
  return (
    <aside className="blog-mend" aria-label="Continue">
      {next ? (
        <a className="bs-seriesnext" href={`/central/${next.slug}`}><span>Próximo:</span>{' '}<b>{next.title} →</b></a>
      ) : null}
      {instagram ? (
        <a className="blog-mend__follow" href={instagram} target="_blank" rel="noopener noreferrer">Siga para os próximos vídeos</a>
      ) : null}
      <p className="blog-mend__offers">
        <span>Quer aprender do zero? <a href={URL_IA_DO_ZERO}>IA do Zero →</a></span>
        <span className="blog-mend__sep"> · </span>
        <span>Quer que eu faça? <a href={URL_CONSULTORIA}>Consultoria →</a></span>
      </p>
    </aside>
  );
}
