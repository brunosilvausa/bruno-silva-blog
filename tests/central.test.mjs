import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import test from 'node:test';

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
const { getMaterials, getMaterial, getMaterialRedirect, getContentCounts, getPosts, getFeedPosts, getRedirect } = await import('../lib/sanity.js');
const { navLinks, footerExtra, site } = await import('../content/site.js');
const { MATERIAL_KINDS, kindAccent, shortDate } = await import('../lib/materials.js');
const { parse, evaluate } = await import('../studio/node_modules/groq-js/dist/index.js');

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

test('MATERIAL_KINDS lists the four kinds', () => {
  assert.deepEqual(MATERIAL_KINDS, [
    { value: 'prompt', label: 'Prompt' },
    { value: 'passo-a-passo', label: 'Passo a passo' },
    { value: 'checklist', label: 'Checklist' },
    { value: 'guia', label: 'Guia' },
  ]);
});

test('sample materials: list, detail, next, counts, isolation from posts', async () => {
  const list = await getMaterials();
  assert.equal(list.length, 3);
  assert.deepEqual(list.map((m) => m.slug), ['logo-da-llc-com-ia', 'nome-da-llc-com-ia', 'checklist-abrir-llc']);
  assert.deepEqual(Object.keys(list[0]).sort(), ['cover', 'id', 'kind', 'minutes', 'publishedAt', 'slug', 'summary', 'title', 'videoDate']);
  assert.deepEqual(list[0].cover, { url: '/img/avatar.webp', alt: 'Bruno Silva', fpX: null, fpY: null });
  assert.equal(list[1].cover, null);
  assert.equal(list[2].cover, null);
  assert.deepEqual((await getMaterial('logo-da-llc-com-ia')).cover, list[0].cover);
  assert.equal((await getMaterial('nome-da-llc-com-ia')).cover, null);
  const nome = await getMaterial('nome-da-llc-com-ia');
  assert.deepEqual(nome.next, { title: 'Logo da LLC com IA', slug: 'logo-da-llc-com-ia' });
  assert.ok(nome.body.some((b) => b._type === 'prompt'));
  const logo = await getMaterial('logo-da-llc-com-ia');
  assert.ok(logo.videoUrl && logo.videoDate);
  assert.equal(logo.next.slug, 'nome-da-llc-com-ia'); // fallback: newest other
  const chk = await getMaterial('checklist-abrir-llc');
  assert.equal(chk.videoUrl, null);
  assert.equal(chk.next.slug, 'logo-da-llc-com-ia');
  assert.equal(await getMaterial('nao-existe'), null);
  assert.equal(await getMaterial(''), null);
  assert.equal((await getContentCounts()).materials, 3);
  assert.equal(await getMaterialRedirect('antigo'), null);
  const slugs = new Set(list.map((m) => m.slug));
  const { posts } = await getPosts({ limit: 50 });
  assert.ok(posts.every((p) => !slugs.has(p.slug)));
  assert.ok((await getFeedPosts(50)).every((p) => !slugs.has(p.slug)));
});

test('real GROQ: publication, next fallback, redirect', async () => {
  const mk = (id, publishedAt, extra = {}) => ({ _id: id, _type: 'material', title: id.toUpperCase(), slug: { current: id }, kind: 'guia', summary: `s-${id}`, publishedAt, body: [], ...extra });
  const ref = (r) => ({ _type: 'reference', _ref: r });
  const post = { _id: 'p1', _type: 'post', title: 'P', slug: { current: 'antigo' }, pillar: 'ia', publishedAt: '2020-01-01T00:00:00Z', body: [] };
  const base = [
    mk('a', '2020-01-01T00:00:00Z'),
    mk('b', '2020-01-02T00:00:00Z', { next: ref('a') }),
    mk('c', '2020-01-03T00:00:00Z', { next: ref('future') }),
    mk('d', '2020-01-04T00:00:00Z', { next: ref('d') }),
    mk('future', '2099-01-01T00:00:00Z', { oldSlugs: ['velho-futuro'] }),
    mk('e', '2020-01-05T00:00:00Z', { oldSlugs: ['antigo'], minutes: 3 }),
    { ...mk('noslug', '2020-01-06T00:00:00Z'), slug: undefined },
    post,
  ];
  await withDataset(base, async () => {
    assert.deepEqual((await getMaterials()).map((m) => m.slug), ['e', 'd', 'c', 'b', 'a']);
    assert.equal((await getMaterials())[0].minutes, 3);
    assert.equal(await getMaterial('future'), null);
    assert.equal((await getContentCounts()).materials, 5);
    assert.equal((await getMaterial('b')).next.slug, 'a');
    assert.equal((await getMaterial('c')).next.slug, 'e'); // unpublished -> newest other
    assert.equal((await getMaterial('d')).next.slug, 'e'); // itself -> newest other
    assert.equal((await getMaterial('e')).next.slug, 'd'); // no field -> newest other (not itself)
    assert.equal(await getMaterialRedirect('antigo'), 'e');
    assert.equal(await getMaterialRedirect('velho-futuro'), null);
    assert.equal(await getRedirect('antigo'), null);
    assert.equal(await getMaterialRedirect('e'), null);
  });
  await withDataset([mk('only', '2020-01-01T00:00:00Z')], async () => {
    assert.equal((await getMaterial('only')).next, null);
  });
  await withDataset([mk('only', '2020-01-01T00:00:00Z', { next: ref('only') })], async () => {
    assert.equal((await getMaterial('only')).next, null);
  });
});

test('navLinks: Central first, only when there are materials', () => {
  const base = site.nav.links;
  assert.deepEqual(navLinks({ materials: 0 }), base);
  assert.deepEqual(navLinks({}), base);
  assert.deepEqual(navLinks(undefined), base);
  const withCentral = navLinks({ materials: 2 });
  assert.deepEqual(withCentral[0], { label: 'Central', href: '/central' });
  assert.deepEqual(withCentral.slice(1), base);
  assert.ok(!base.some((l) => l.href === '/central'));
});

test('footerExtra: Central only when there are materials; order central, series, glossary', () => {
  assert.deepEqual(footerExtra({ terms: 0, series: 0, materials: 0 }), []);
  assert.deepEqual(footerExtra({ materials: 1 }).map((l) => l.href), ['/central']);
  assert.deepEqual(footerExtra({ terms: 1, series: 1, materials: 1 }).map((l) => l.href), ['/central', '/series', '/glossario']);
  assert.deepEqual(site.footer.extra.central, { label: 'Central', href: '/central' });
});

test('kindAccent: per-kind colour, unknown falls back to volt', () => {
  assert.equal(kindAccent('prompt'), '#4fd8ff');
  assert.equal(kindAccent('checklist'), '#ff5fa8');
  assert.equal(kindAccent('guia'), '#e1fa03');
  assert.equal(kindAccent('passo-a-passo'), '#e1fa03');
  assert.equal(kindAccent('x'), '#e1fa03');
  assert.equal(kindAccent(undefined), '#e1fa03');
});

test('real GROQ: cover url built from the asset ref, alt defaults to empty', async () => {
  const mk = (id, extra = {}) => ({ _id: id, _type: 'material', title: id, slug: { current: id }, kind: 'guia', summary: 's', publishedAt: '2020-01-01T00:00:00Z', body: [], ...extra });
  const img = (alt) => ({ _type: 'image', asset: { _type: 'reference', _ref: 'image-abc123def-1600x2000-jpg' }, ...(alt ? { alt } : {}) });
  const url = 'https://cdn.sanity.io/images/test-project/production/abc123def-1600x2000.jpg?w=900&h=1125&fit=crop&auto=format';
  await withDataset([mk('with', { cover: img('Foto') }), mk('noalt', { cover: img() }), mk('none'), mk('empty', { cover: { _type: 'image' } })], async () => {
    const by = Object.fromEntries((await getMaterials()).map((m) => [m.slug, m]));
    assert.deepEqual(by.with.cover, { url, alt: 'Foto', fpX: null, fpY: null });
    assert.deepEqual(by.noalt.cover, { url, alt: '', fpX: null, fpY: null });
    assert.equal(by.none.cover, null);
    assert.equal(by.empty.cover, null);
    assert.deepEqual((await getMaterial('with')).cover, { url, alt: 'Foto', fpX: null, fpY: null });
    assert.equal((await getMaterial('none')).cover, null);
  });
});

test('real GROQ: cover hotspot adds focal point params, none keeps the plain url', async () => {
  const mk = (id, cover) => ({ _id: id, _type: 'material', title: id, slug: { current: id }, kind: 'guia', summary: 's', publishedAt: '2020-01-01T00:00:00Z', body: [], cover });
  const asset = { _type: 'reference', _ref: 'image-abc123def-1600x2000-jpg' };
  const base = 'https://cdn.sanity.io/images/test-project/production/abc123def-1600x2000.jpg?w=900&h=1125&fit=crop&auto=format';
  await withDataset([
    mk('hot', { _type: 'image', asset, hotspot: { x: 0.25, y: 0.75, width: 0.5, height: 0.5 } }),
    mk('plain', { _type: 'image', asset }),
  ], async () => {
    const by = Object.fromEntries((await getMaterials()).map((m) => [m.slug, m]));
    assert.equal(by.hot.cover.url, `${base}&crop=focalpoint&fp-x=0.25&fp-y=0.75`);
    assert.equal(by.plain.cover.url, base);
    assert.deepEqual([by.hot.cover.fpX, by.hot.cover.fpY], [0.25, 0.75]);
    assert.deepEqual([by.plain.cover.fpX, by.plain.cover.fpY], [null, null]);
    assert.equal((await getMaterial('hot')).cover.url, `${base}&crop=focalpoint&fp-x=0.25&fp-y=0.75`);
  });
});

test('shortDate: DD/MM of a valid date, empty for invalid', () => {
  assert.equal(shortDate('2026-11-12'), '12/11');
  assert.equal(shortDate('2026-01-05T23:30:00Z'), '05/01');
  assert.equal(shortDate('nope'), '');
  assert.equal(shortDate(null), '');
});

test('og cover: forceJpeg drops auto=format so the CDN cannot return WebP/AVIF', async () => {
  const { forceJpeg } = await import('../lib/og-card.js');
  const u = forceJpeg(new URL('https://cdn.sanity.io/images/p/d/x-1600x2000.jpg?w=900&h=1125&fit=crop&auto=format&crop=focalpoint&fp-x=0.25&fp-y=0.75'));
  assert.equal(u.searchParams.has('auto'), false);
  assert.equal(u.searchParams.get('fm'), 'jpg');
  assert.equal(u.searchParams.get('w'), '1200');
  assert.equal(u.searchParams.get('h'), '630');
  assert.equal(u.searchParams.get('fp-x'), '0.25');
});
