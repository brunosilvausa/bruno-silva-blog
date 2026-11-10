import { about } from '@/content/about';
import { CONTACT_EMAIL } from '@/content/legal';
import { site } from '@/content/site';
import { FEED_TYPES } from '@/lib/feed';
import { AUTHOR, breadcrumb, jsonLd } from '@/lib/jsonld';
import { absolute } from '@/lib/site-url';
import Shell from '@/components/Shell';
import NewsletterSignup from '@/components/NewsletterSignup';

export const metadata = {
  title: 'Sobre | Bruno Silva USA',
  description: about.lead,
  alternates: { canonical: '/sobre', types: FEED_TYPES },
};

/** Turns the contact address inside a sentence into a mailto link. */
function withEmail(text) {
  const parts = String(text).split(CONTACT_EMAIL);
  return parts.flatMap((part, i) => (i === 0 ? [part] : [<a key={i} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, part]));
}

// About page: same reading column as a post. Texts in content/about.js.
export default function AboutPage() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'ProfilePage', url: absolute('/sobre'), inLanguage: 'pt-BR', mainEntity: { ...AUTHOR, description: about.lead, image: absolute(about.image) } },
      breadcrumb([{ name: 'Blog', path: '/' }, { name: 'Sobre', path: '/sobre' }]),
    ],
  };
  return (
    <Shell current="/sobre">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
      <article className="bs-article blog-about">
        <header>
          <img className="blog-about__photo" src={about.image} alt="" width="144" height="144" decoding="async" />
          <span className="bs-article__kicker">{about.kicker}</span>
          <h1 className="bs-article__title" data-scramble="load">{about.title}</h1>
          <p className="bs-article__lead">{about.lead}</p>
          {about.facts?.length ? (
            <ul className="blog-about__facts">
              {about.facts.map((f) => <li key={f.label}><b>{f.value}</b><span>{f.label}</span></li>)}
            </ul>
          ) : null}
        </header>
        <div className="bs-prose">
          {about.sections.map((s) => (
            <section key={s.id} aria-labelledby={s.id}>
              <h2 id={s.id} data-mask="words">{s.title}</h2>
              {(s.paragraphs || []).map((p) => <p key={p}>{withEmail(p)}</p>)}
              {s.items?.length ? <ul>{s.items.map((i) => <li key={i}>{i}</li>)}</ul> : null}
              {s.links === 'work' ? (
                <p className="blog-about__links">
                  {site.work.map((l) => <a key={l.label} className="bs-btn bs-btn--outline bs-btn--sm" href={l.href}>{l.label}</a>)}
                </p>
              ) : null}
            </section>
          ))}
        </div>
      </article>
      <NewsletterSignup data={site.newsletter} />
    </Shell>
  );
}
