import Title from './Title';

/** DS SectionHeader. `level` 1 for the page title (one per page), 2 for sections. */
export default function SectionHeader({ kicker, title, id, text, level = 2, center = true }) {
  const Heading = level === 1 ? 'h1' : 'h2';
  return (
    <header className={`bs-shead${center ? ' bs-shead--center' : ''}`} data-reveal="load">
      {kicker ? <div className="bs-shead__kicker">{kicker}</div> : null}
      <Heading className="bs-shead__title" id={id} {...(level === 1 ? { 'data-scramble': 'load' } : { 'data-mask': 'lines' })}><Title value={title} /></Heading>
      {text ? <p className="bs-shead__text">{text}</p> : null}
    </header>
  );
}
