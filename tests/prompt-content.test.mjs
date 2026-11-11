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
const { portableTextToHtml } = await import('../lib/pt-html.js');
const { portableTextToPlain, readingMinutes } = await import('../lib/format.js');
const { getPosts, getPost, getAllPosts, getRelated, getAdjacent } = await import('../lib/sanity.js');
const { parse, evaluate } = await import('../studio/node_modules/groq-js/dist/index.js');

test('RSS preserves escaped prompt title and literal line breaks without copy controls', () => {
  assert.equal(portableTextToHtml([{ _type: 'prompt', title: '  <Título> & "IA"  ', text: '  <script> & "x"\n\nFim  ' }]),
    '<p><strong>&lt;Título&gt; &amp; &quot;IA&quot;:</strong><br>  &lt;script&gt; &amp; &quot;x&quot;<br><br>Fim  </p>');
});

test('prompt title defaults to Prompt and blank prompts are omitted', () => {
  for (const title of [undefined, '', ' \n ']) {
    assert.equal(portableTextToHtml([{ _type: 'prompt', title, text: 'Texto' }]), '<p><strong>Prompt:</strong><br>Texto</p>');
    assert.equal(portableTextToPlain([{ _type: 'prompt', title, text: 'Texto' }]), 'Prompt\nTexto');
  }
  for (const text of ['', ' \n\t ', undefined]) {
    assert.equal(portableTextToHtml([{ _type: 'prompt', title: 'Ignorar', text }]), '');
    assert.equal(portableTextToPlain([{ _type: 'prompt', title: 'Ignorar', text }]), '');
  }
});

test('plain extraction preserves prompt text literally along with existing content', () => {
  const body = [
    { _type: 'block', children: [{ text: 'Antes ' }, { text: 'depois' }] },
    { _type: 'prompt', title: '  Minha IA  ', text: '  <html> & "texto"\n\nFim\t ' },
    { _type: 'callout', text: 'Uma dica' },
    { _type: 'image', caption: 'Legenda' },
  ];
  assert.equal(portableTextToPlain(body), 'Antes depois\nMinha IA\n  <html> & "texto"\n\nFim\t \nUma dica\nLegenda');
  assert.equal(portableTextToPlain(), '');
});

test('RSS retains Dica and Atenção rendering', () => {
  assert.equal(portableTextToHtml([
    { _type: 'callout', tone: 'dica', text: 'A & B\nC' },
    { _type: 'callout', tone: 'atencao', text: '<Cuidado>' },
  ]), '<p><strong>Dica:</strong> A &amp; B<br>C</p>\n<p><strong>Atenção:</strong> &lt;Cuidado&gt;</p>');
});

test('real GROQ projections preserve reading time across cards, full articles and all posts', async () => {
  const env = { project: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET };
  const originalFetch = globalThis.fetch;
  const body = [
    { _type: 'block', children: [{ _type: 'span', text: 'word '.repeat(195) }] },
    { _type: 'prompt', label: 'Label '.repeat(3), text: 'prompt '.repeat(200) },
    { _type: 'callout', text: 'tip '.repeat(3) },
    { _type: 'image', caption: 'caption '.repeat(3), asset: { _ref: 'huge-image' } },
  ]; // 195 + 3 + 200 + 3 + 3 = 404 words => 3 minutes.
  const post = { _id: 'live', _type: 'post', title: 'Live', slug: { current: 'live' }, pillar: 'ia', publishedAt: '2020-01-02T00:00:00Z', body, seoTitle: 'Search title', seoDescription: 'Search description', ogImage: { alt: 'Social image', asset: { _ref: 'social-image' } } };
  const dataset = [{ _id: 'social-image', _type: 'sanity.imageAsset', url: 'https://cdn.sanity.io/social.jpg' }, post,
    { ...post, _id: 'older', slug: { current: 'older' }, publishedAt: '2020-01-01T00:00:00Z' },
    { ...post, _id: 'future', publishedAt: '2099-01-01T00:00:00Z' },
    { ...post, _id: 'no-date', publishedAt: undefined },
    { ...post, _id: 'no-slug', slug: undefined },
    { ...post, _id: 'other', slug: { current: 'other' }, pillar: 'vida' },
  ];
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project';
  process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
  globalThis.fetch = async (url) => {
    const params = Object.fromEntries([...url.searchParams].filter(([key]) => key.startsWith('$')).map(([key, value]) => [key.slice(1), JSON.parse(value)]));
    const value = await evaluate(parse(url.searchParams.get('query')), { dataset, params });
    return { ok: true, json: async () => ({ result: await value.get() }) };
  };
  try {
    assert.equal(readingMinutes(portableTextToPlain(body)), 3);
    const listed = await getPosts({ pillar: 'ia' });
    assert.equal(listed.total, 2);
    assert.deepEqual(listed.posts.map(({ slug, minutes }) => [slug, minutes]), [['live', 3], ['older', 3]]);
    const full = await getPost('live');
    assert.equal(full.minutes, 3);
    assert.equal(full.seoTitle, 'Search title');
    assert.equal(full.description, 'Search description');
    assert.deepEqual(full.ogImage, { url: 'https://cdn.sanity.io/social.jpg', alt: 'Social image' });
    assert.deepEqual((await getAllPosts()).map(({ slug, minutes }) => [slug, minutes]), [['live', 3], ['other', 3], ['older', 3]]);
    assert.deepEqual((await getRelated({ slug: 'live', pillar: 'ia' }, 1)).map(({ slug, minutes }) => [slug, minutes]), [['older', 3]]);
    const adjacent = await getAdjacent({ slug: 'live', publishedAt: post.publishedAt });
    assert.equal(adjacent.prev.minutes, 3);
    assert.equal(adjacent.next, null);
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of [['NEXT_PUBLIC_SANITY_PROJECT_ID', env.project], ['NEXT_PUBLIC_SANITY_DATASET', env.dataset]]) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});

test('legacy prompt labels survive RSS/plain extraction and new titles take precedence', () => {
  const legacy = { _type: 'prompt', label: '  Peça <assim>  ', text: '  Original\n ' };
  assert.equal(portableTextToPlain([legacy]), 'Peça <assim>\n  Original\n ');
  assert.equal(portableTextToHtml([legacy]), '<p><strong>Peça &lt;assim&gt;:</strong><br>  Original<br> </p>');
  assert.equal(portableTextToPlain([{ ...legacy, title: ' Novo ' }]), 'Novo\n  Original\n ');
  assert.equal(portableTextToPlain([{ ...legacy, title: ' \n ' }]), 'Peça <assim>\n  Original\n ');
});
