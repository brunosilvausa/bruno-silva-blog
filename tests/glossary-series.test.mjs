import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import test from 'node:test';

// Node 22's synchronous, test-only resolver loads the real Next modules unchanged.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) {
      return nextResolve(new URL(`../${specifier.slice(2)}.js`, import.meta.url).href, context);
    }
    if (specifier.startsWith('./') && !/\.[a-z]+$/i.test(specifier)) {
      return nextResolve(`${specifier}.js`, context);
    }
    return nextResolve(specifier, context);
  },
});
const { getTerms, getTerm, getSeriesList, getSeries, getContentCounts, getPost } = await import('../lib/sanity.js');
const { parse, evaluate } = await import('../studio/node_modules/groq-js/dist/index.js');

// Runs `fn` against an in-memory dataset served through real GROQ evaluation.
async function withDataset(dataset, fn) {
  const env = { project: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET };
  const originalFetch = globalThis.fetch;
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project';
  process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
  globalThis.fetch = async (url) => {
    const params = Object.fromEntries([...url.searchParams].filter(([key]) => key.startsWith('$')).map(([key, value]) => [key.slice(1), JSON.parse(value)]));
    const value = await evaluate(parse(url.searchParams.get('query')), { dataset, params });
    return { ok: true, json: async () => ({ result: await value.get() }) };
  };
  try {
    return await fn();
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of [['NEXT_PUBLIC_SANITY_PROJECT_ID', env.project], ['NEXT_PUBLIC_SANITY_DATASET', env.dataset]]) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
}

test('sample terms are listed A-Z in the agreed shape', async () => {
  const terms = await getTerms();
  assert.deepEqual(terms.map((t) => t.term), ['EIN', 'ITIN', 'LLC', 'Single-Member LLC']);
  for (const t of terms) {
    assert.deepEqual(Object.keys(t).sort(), ['aliases', 'fullName', 'id', 'short', 'slug', 'term']);
    assert.ok(Array.isArray(t.aliases));
    assert.ok(t.short.length > 0 && t.short.length <= 220);
  }
  assert.deepEqual(terms.find((t) => t.term === 'Single-Member LLC').aliases, ['SMLLC']);
  assert.equal(terms.find((t) => t.term === 'Single-Member LLC').fullName, '');
});

test('getTerm returns the term with its body, or null', async () => {
  const ein = await getTerm('ein');
  assert.equal(ein.fullName, 'Employer Identification Number');
  assert.ok(Array.isArray(ein.body) && ein.body.length >= 1);
  assert.equal(await getTerm('nao-existe'), null);
  assert.equal(await getTerm(''), null);
});

test('sample series: list, detail, counts and the post series block', async () => {
  const list = await getSeriesList();
  assert.equal(list.length, 1);
  assert.deepEqual({ ...list[0] }, { id: list[0].id, title: 'Abrir empresa nos EUA', slug: 'abrir-empresa-nos-eua', description: list[0].description, cover: null, count: 3 });
  const series = await getSeries('abrir-empresa-nos-eua');
  assert.equal(series.parts.length, 3);
  assert.deepEqual(series.parts.map((p) => p.slug), ['como-escolher-o-estado-da-sua-llc', 'o-que-e-o-ein', 'receber-em-dolar-de-clientes-no-brasil']);
  assert.ok(series.parts[0].minutes > 0 && series.parts[0].title);
  assert.equal(await getSeries('nao-existe'), null);
  assert.deepEqual(await getContentCounts(), { terms: 4, series: 1 });
  const post = await getPost('o-que-e-o-ein');
  assert.equal(post.series.index, 2);
  assert.equal(post.series.total, 3);
  assert.equal(post.series.slug, 'abrir-empresa-nos-eua');
  assert.deepEqual(post.series.parts.map((p) => Object.keys(p).sort()), [['slug', 'title'], ['slug', 'title'], ['slug', 'title']]);
  assert.equal((await getPost('3-apps-de-ia-que-uso-todo-dia')).series, null);
});

test('real GROQ: series ignore unpublished parts and renumber', async () => {
  const mk = (id, publishedAt) => ({ _id: id, _type: 'post', title: id, slug: { current: id }, pillar: 'ia', publishedAt, body: [] });
  const dataset = [
    mk('a', '2020-01-01T00:00:00Z'), mk('b', '2099-01-01T00:00:00Z'), mk('c', '2020-01-03T00:00:00Z'), mk('solo', '2020-01-04T00:00:00Z'),
    { _id: 's1', _type: 'series', title: 'Série', slug: { current: 'serie' }, description: 'Desc', posts: ['a', 'b', 'c'].map((r) => ({ _type: 'reference', _ref: r })) },
    { _id: 's2', _type: 'series', title: 'Vazia', slug: { current: 'vazia' }, posts: [{ _type: 'reference', _ref: 'b' }] },
    { _id: 't1', _type: 'term', term: 'EIN', slug: { current: 'ein' }, fullName: 'Employer Identification Number', short: 'x' },
    { _id: 't2', _type: 'term', term: 'ITIN', slug: { current: 'itin' }, short: 'y', aliases: ['A'] },
  ];
  await withDataset(dataset, async () => {
    const series = await getSeries('serie');
    assert.deepEqual(series.parts.map((p) => p.slug), ['a', 'c']);
    assert.equal(series.count, 2);
    assert.equal(series.cover, null);
    const list = await getSeriesList();
    // A series with no published part is not listed (count 0 is dropped); its own page returns no parts.
    assert.deepEqual(list.map((s) => [s.slug, s.count]), [['serie', 2]]);
    assert.equal((await getSeries('vazia')).parts.length, 0);
    const c = await getPost('c');
    assert.deepEqual({ index: c.series.index, total: c.series.total, parts: c.series.parts }, { index: 2, total: 2, parts: [{ title: 'a', slug: 'a' }, { title: 'c', slug: 'c' }] });
    assert.equal((await getPost('solo')).series, null);
    assert.deepEqual(await getContentCounts(), { terms: 2, series: 1 });
    const terms = await getTerms();
    assert.deepEqual(terms.map((t) => [t.slug, t.fullName, t.aliases]), [['ein', 'Employer Identification Number', []], ['itin', '', ['A']]]);
    assert.equal((await getTerm('itin')).term, 'ITIN');
    assert.equal(await getTerm('zzz'), null);
  });
});

// ---- Task 2: automatic term links ----
const { linkTerms, matchesTerm } = await import('../lib/terms.js');
const { portableTextToHtml } = await import('../lib/pt-html.js');
const T = (term, slug, aliases = [], short = `${term} short`) => ({ id: slug, term, slug, fullName: term, short, aliases });
const EIN = T('EIN', 'ein', ['Employer ID']);
const LLC = T('LLC', 'llc');
const SMLLC = T('Single-Member LLC', 'single-member-llc', ['SMLLC']);
const para = (text, extra = {}) => ({ _type: 'block', _key: 'b1', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 's1', text, marks: [] }], ...extra });
const linked = (blocks) => blocks.flatMap((b) => (b.children || []).filter((c) => c.marks?.some((m) => m.startsWith('term-'))).map((c) => c.text));

test('matchesTerm: whole word, case rules for acronyms', () => {
  assert.equal(matchesTerm('Peça o EIN hoje', EIN), true);
  assert.equal(matchesTerm('EINSTEIN', EIN), false);
  assert.equal(matchesTerm('LLCs', LLC), false);
  assert.equal(matchesTerm('o ein', EIN), false);
  assert.equal(matchesTerm('seu employer id', EIN), true);
  assert.equal(matchesTerm('single-member llc', SMLLC), true);
});

test('linkTerms links only the first occurrence across the post', () => {
  const input = [para('Peça o EIN hoje. O EIN sai rápido.'), para('Outro EIN aqui.', { _key: 'b2' })];
  const snapshot = JSON.stringify(input);
  const out = linkTerms(input, [EIN]);
  assert.deepEqual(linked(out), ['EIN']);
  assert.deepEqual(out[0].children.map((c) => c.text), ['Peça o ', 'EIN', ' hoje. O EIN sai rápido.']);
  assert.deepEqual(out[0].markDefs, [{ _key: 'term-ein', _type: 'termLink', slug: 'ein', short: 'EIN short' }]);
  assert.equal(out[1].children.length, 1);
  assert.equal(JSON.stringify(input), snapshot, 'input untouched');
});

test('linkTerms respects word boundaries and acronym case', () => {
  assert.deepEqual(linked(linkTerms([para('EINSTEIN e LLCs e ein')], [EIN, LLC])), []);
});

test('linkTerms prefers the longer term and keeps spans/markDefs', () => {
  const block = para('Abra uma single-member llc e uma LLC.', {
    markDefs: [{ _key: 'x', _type: 'link', href: 'https://a.com' }],
    children: [{ _type: 'span', _key: 's1', text: 'Abra uma single-member llc e uma LLC.', marks: ['strong'] }],
  });
  const out = linkTerms([block], [LLC, SMLLC]);
  assert.deepEqual(linked(out), ['single-member llc', 'LLC']);
  assert.ok(out[0].markDefs.some((d) => d._key === 'x'));
  assert.ok(out[0].children.every((c) => c.marks.includes('strong')));
});

test('linkTerms skips code spans, link spans and non-prose blocks', () => {
  const blocks = [
    { ...para(''), children: [{ _type: 'span', _key: 'a', text: 'EIN', marks: ['code'] }, { _type: 'span', _key: 'b', text: 'EIN', marks: ['l1'] }], markDefs: [{ _key: 'l1', _type: 'link', href: '/x' }] },
    para('EIN', { _key: 'h', style: 'h2' }),
    { _type: 'prompt', _key: 'p', text: 'EIN' },
    { _type: 'checklist', _key: 'c', items: ['EIN'] },
    { _type: 'callout', _key: 'k', text: 'EIN' },
  ];
  const out = linkTerms(blocks, [EIN]);
  assert.deepEqual(linked(out), []);
  assert.deepEqual(out, blocks);
});

test('linkTerms handles list items and blockquotes', () => {
  const out = linkTerms([para('EIN', { listItem: 'bullet' }), para('LLC', { _key: 'q', style: 'blockquote' })], [EIN, LLC]);
  assert.deepEqual(linked(out), ['EIN', 'LLC']);
});

test('linkTerms exclude skips that slug; RSS html has no glossary link', () => {
  assert.deepEqual(linked(linkTerms([para('Peça o EIN')], [EIN], { exclude: 'ein' })), []);
  const html = portableTextToHtml(linkTerms([para('Peça o EIN')], [EIN]));
  assert.ok(!html.includes('glossario'));
  assert.ok(html.includes('Peça o EIN'));
});

// ---- Task 6: sitemap ----
test('sitemap lists the glossary and series routes (sample data)', async () => {
  const { default: sitemap } = await import('../app/sitemap.js');
  const entries = await sitemap();
  const byPath = new Map(entries.map((e) => [new URL(e.url).pathname, e]));
  for (const path of ['/glossario', '/glossario/ein', '/series', '/series/abrir-empresa-nos-eua']) assert.ok(byPath.has(path), `missing ${path}`);
  assert.deepEqual([byPath.get('/glossario').changeFrequency, byPath.get('/glossario').priority], ['weekly', 0.6]);
  assert.deepEqual([byPath.get('/glossario/ein').changeFrequency, byPath.get('/glossario/ein').priority], ['monthly', 0.5]);
  assert.deepEqual([byPath.get('/series').changeFrequency, byPath.get('/series').priority], ['weekly', 0.6]);
  assert.deepEqual([byPath.get('/series/abrir-empresa-nos-eua').changeFrequency, byPath.get('/series/abrir-empresa-nos-eua').priority], ['weekly', 0.7]);
});
