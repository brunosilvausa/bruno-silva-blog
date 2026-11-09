import Img from './Img';

/** DS NavBar. `current` is the href of the page being shown (gets aria-current). */
export default function NavBar({ nav, current }) {
  return (
    <nav className="bs-nav bs-glass bs-glass--strong" aria-label={nav.ariaLabel}>
      <div className="bs-container bs-nav__inner">
        <a className="bs-nav__logo" href="/"><Img src="/img/monogram.png" alt={nav.logoAlt} /></a>
        <ul className="bs-nav__links">
          {nav.links.map((l) => (
            <li key={l.href}><a href={l.href} aria-current={l.href === current ? 'page' : undefined}>{l.label}</a></li>
          ))}
        </ul>
        <a className="bs-btn bs-btn--primary bs-btn--sm" href={nav.cta.href} aria-current={nav.cta.href === current ? 'page' : undefined}>{nav.cta.label}</a>
      </div>
    </nav>
  );
}
