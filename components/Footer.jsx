import Img from './Img';
export default function Footer({ data }) {
  return (
    <footer className="bs-footer">
      <div className="bs-container">
        <div className="bs-footer__grid">
          <div className="bs-footer__brand"><Img lazy src="/img/monogram.png" alt={data.logoAlt} /><p>{data.tagline}</p></div>
          {data.columns.map((c) => (
            <div key={c.title}>
              <h2 className="bs-footer__title">{c.title}</h2>
              <ul>{c.links.map((l) => <li key={l.label}><a className="bs-link" href={l.href}>{l.label}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="bs-footer__base">
          <span>{data.copyright}</span>
          <span>{data.legal.map((l, i) => <span key={l.label}>{i > 0 ? ' · ' : ''}<a className="bs-link" href={l.href}>{l.label}</a></span>)}</span>
        </div>
      </div>
    </footer>
  );
}
