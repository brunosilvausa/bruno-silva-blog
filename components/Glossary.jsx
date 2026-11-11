// Glossary index: letters bar, then one group per initial. The filter field is hidden until public/ds.js (glossaryFilter) shows it.

/** Lowercase, accent-free text used for filtering (the DS script normalises the typed text the same way). */
const fold = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/** First letter without accent, uppercase; "#" for anything that is not a letter. */
export function letterOf(term) {
  const c = fold(term).trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : '#';
}

export default function Glossary({ terms }) {
  const groups = [];
  for (const t of terms) {
    const letter = letterOf(t.term);
    const last = groups[groups.length - 1];
    if (last && last.letter === letter) last.items.push(t); else groups.push({ letter, items: [t] });
  }
  const id = (letter) => `letra-${letter === '#' ? 'outros' : letter}`;
  return (
    <div className="bs-gloss">
      <nav className="bs-gloss__letters" aria-label="Letras">
        {groups.map((g) => <a key={g.letter} href={`#${id(g.letter)}`}>{g.letter}</a>)}
      </nav>
      <div className="bs-field bs-gloss__filterbox" hidden>
        <label className="bs-field__label" htmlFor="gloss-filter">Filtrar termos</label>
        <input id="gloss-filter" className="bs-field__input bs-gloss__filter" type="search" autoComplete="off" />
      </div>
      <p className="bs-gloss__empty" hidden>Nenhum termo encontrado.</p>
      {groups.map((g) => (
        <section key={g.letter} id={id(g.letter)} data-letter={g.letter} className="bs-gloss__group">
          <h2 className="bs-gloss__letter">{g.letter}</h2>
          <ul className="bs-gloss__list">
            {g.items.map((t) => (
              <li key={t.slug} className="bs-gloss__item" data-term={fold([t.term, t.fullName, ...t.aliases].filter(Boolean).join(' '))}>
                <a className="bs-gloss__name" href={`/glossario/${t.slug}`}>{t.term}</a>
                {t.fullName ? <span className="bs-gloss__full">{t.fullName}</span> : null}
                <p className="bs-gloss__short">{t.short}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
