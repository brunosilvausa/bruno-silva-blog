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
