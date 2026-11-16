import SectionHeader from './SectionHeader';
import Ticker from './Ticker';
import CodeDivider from './CodeDivider';
import { PILLARS } from '@/lib/pillars';

const STRIPES = [13, 59, 105, 150, 196, 242, 288];

/**
 * The top of the blog lists: flag, CodeReveal, neural canvas, divider, SectionHeader (h1#titulo)
 * and the pillar ticker right below. Shared by the blog index, the pillar pages and /central.
 */
export default function ListHero({ header }) {
  return (
    <>
      {/* Header over the flag with CodeReveal in its gaps (title, text, buttons only), then the pillar ticker. */}
      <section className="bs-section blog-hero bs-backdrop bs-backdrop--code" aria-labelledby="titulo">
        <svg className="bs-flag" viewBox="0 0 1200 320" preserveAspectRatio="none" aria-hidden="true">
          {STRIPES.map((y) => <rect key={y} x="0" y={y} width="1200" height="15" />)}
        </svg>
        <div className="bs-code" aria-hidden="true"></div>
        <canvas className="bs-terrain" data-neural aria-hidden="true"></canvas>
        <div className="bs-container">
          <CodeDivider className="bs-shead-divider" />
          <SectionHeader level={1} id="titulo" kicker={header.kicker} title={header.title} text={header.text} />
          {header.actions?.length ? (
            <div className="blog-hero__actions" data-reveal="load" style={{ '--i': 2 }}>
              {header.actions.map((a) => <a key={a.href} className={`bs-btn ${a.primary ? 'bs-btn--primary' : 'bs-btn--ghost'}`} href={a.href}>{a.label}</a>)}
            </div>
          ) : null}
        </div>
      </section>
      <Ticker label="Pilares do blog" speed={32} items={PILLARS.map((p) => ({ label: p.label, href: `/pilar/${p.slug}` }))} />
    </>
  );
}
