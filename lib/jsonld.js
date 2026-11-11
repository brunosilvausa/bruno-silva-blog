import { absolute } from './site-url';

// Structured data for search engines (schema.org JSON-LD).

/** JSON for a <script type="application/ld+json">, with "<" escaped so it can't close the tag. */
export function jsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export const AUTHOR = { '@type': 'Person', '@id': absolute('/sobre#bruno'), name: 'Bruno Silva', url: absolute('/sobre') };

/** BreadcrumbList from [{ name, path }] (the last one is the current page). */
export function breadcrumb(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absolute(it.path) })),
  };
}

/** The blog itself: WebSite + Blog, for the home page. */
export function blogGraph({ name, description }) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': absolute('/#site'), url: absolute('/'), name, description, inLanguage: 'pt-BR', publisher: AUTHOR },
      { '@type': 'Blog', '@id': absolute('/#blog'), url: absolute('/'), name, description, inLanguage: 'pt-BR', author: AUTHOR, isPartOf: { '@id': absolute('/#site') } },
    ],
  };
}

const GLOSSARY_NAME = 'Glossário Bruno Silva USA';
const setRef = () => ({ '@type': 'DefinedTermSet', '@id': `${absolute('/glossario')}#set`, name: GLOSSARY_NAME, url: absolute('/glossario') });

/** DefinedTermSet of the whole glossary (the /glossario page). */
export function definedTermSet(terms) {
  return {
    ...setRef(),
    inLanguage: 'pt-BR',
    hasDefinedTerm: terms.map((t) => ({ '@type': 'DefinedTerm', name: t.term, description: t.short, url: absolute(`/glossario/${t.slug}`) })),
  };
}

/** One DefinedTerm that belongs to the glossary set (a term page). */
export function definedTerm(term) {
  return {
    '@type': 'DefinedTerm',
    name: term.term,
    description: term.short,
    url: absolute(`/glossario/${term.slug}`),
    inDefinedTermSet: setRef(),
  };
}

/** Reference to a series from a post (BlogPosting.isPartOf). */
export function seriesRef(series) {
  return { '@type': 'CreativeWorkSeries', name: series.title, url: absolute(`/series/${series.slug}`) };
}

/** CreativeWorkSeries + ItemList of its parts, for a series page. `series.parts` are cards. */
export function seriesGraph(series) {
  const url = absolute(`/series/${series.slug}`);
  const partUrl = (p) => absolute(`/posts/${p.slug}`);
  return [
    {
      '@type': 'CreativeWorkSeries',
      '@id': `${url}#series`,
      name: series.title,
      description: series.description || undefined,
      url,
      inLanguage: 'pt-BR',
      hasPart: series.parts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: partUrl(p) })),
    },
    {
      '@type': 'ItemList',
      name: series.title,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: series.parts.length,
      itemListElement: series.parts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title, url: partUrl(p) })),
    },
  ];
}
