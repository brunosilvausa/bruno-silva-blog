import Shell from './Shell';
import { CONTACT_EMAIL } from '@/content/legal';
import { formatDate } from '@/lib/format';
import { slugify } from '@/lib/headings';

/** Turns the contact address inside a sentence into a mailto link. */
function withEmail(text) {
  const parts = String(text).split(CONTACT_EMAIL);
  return parts.flatMap((part, i) => (i === 0 ? [part] : [<a key={i} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, part]));
}

/** Privacidade / Termos: same reading column as a post (ArticleLayout), without author or newsletter. */
export default function LegalPage({ page, updated, current }) {
  return (
    <Shell current={current}>
      <article className="bs-article blog-legal">
        <header>
          <span className="bs-article__kicker">{page.kicker}</span>
          <h1 className="bs-article__title" data-scramble="load">{page.title}</h1>
          <p className="bs-article__lead">{page.lead}</p>
          <p className="blog-legal__updated">Atualizado em <time dateTime={updated}>{formatDate(updated)}</time></p>
        </header>
        <div className="bs-prose">
          {page.sections.map((s) => (
            <section key={s.title} aria-labelledby={slugify(s.title)}>
              <h2 id={slugify(s.title)} data-mask="words">{s.title}</h2>
              {(s.paragraphs || []).map((p) => <p key={p}>{withEmail(p)}</p>)}
              {s.items?.length ? <ul>{s.items.map((i) => <li key={i}>{withEmail(i)}</li>)}</ul> : null}
            </section>
          ))}
        </div>
      </article>
    </Shell>
  );
}
