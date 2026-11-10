import Title from './Title';
import EmailForm from './EmailForm';

const STRIPES = [20, 89, 157, 226, 294, 363, 432];
const Check = () => <svg className="bs-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" /></svg>;
const Arrow = () => <svg className="bs-btn__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;

/** DS NewsletterSignup. `level` 1 when it is the page's main title (the /newsletter page). */
export default function NewsletterSignup({ data, latestHref, formId = 'email-news', level = 2 }) {
  const Heading = level === 1 ? 'h1' : 'h2';
  return (
    <section className="bs-cta bs-backdrop" aria-labelledby={`${formId}-titulo`}>
      <svg className="bs-flag" viewBox="0 0 1200 480" preserveAspectRatio="none" aria-hidden="true">
        {STRIPES.map((y) => <rect key={y} x="0" y={y} width="1200" height="22" />)}
      </svg>
      <div className="bs-backdrop__glow" style={{ left: '-80px', top: '-200px' }}></div>
      <div className="bs-container">
        <div className="bs-news bs-glass bs-glass--strong" data-reveal>
          <div>
            <span className="bs-shead__kicker">{data.kicker}</span>
            <Heading className="bs-news__title" id={`${formId}-titulo`} {...(level === 1 ? { 'data-scramble': 'load' } : { 'data-mask': 'lines' })}><Title value={data.title} /></Heading>
            <p className="bs-news__text">{data.text}</p>
            <ul className="bs-news__list">
              {data.benefits.map((b) => <li key={b}><Check /><span>{b}</span></li>)}
            </ul>
          </div>
          <div>
            <EmailForm id={formId} label={data.form.label} button={data.form.button} note={data.form.note} />
            {latestHref ? <a className="bs-link bs-news__last" href={latestHref}>{data.lastLabel} <Arrow /></a> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
