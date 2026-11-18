import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createRequire, registerHooks } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'next/og') return nextResolve('next/og.js', context);
    if (specifier.startsWith('@/')) return nextResolve(new URL(`../${specifier.slice(2)}.js`, import.meta.url).href, context);
    if (specifier.startsWith('./') && !/\.[a-z]+$/i.test(specifier)) return nextResolve(`${specifier}.js`, context);
    return nextResolve(specifier, context);
  },
});
const { ogFonts } = await import('../lib/og-card.js');
const { ogResponse, ogCoverResponse } = await import('../lib/og-response.js');
const image = await readFile(new URL('../public/img/monogram.png', import.meta.url));
const orbitron = await readFile(new URL('../assets/fonts/og/Orbitron-ExtraBold.ttf', import.meta.url));

test('missing local fonts reject explicitly instead of returning an empty list', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'og-missing-font-'));
  try {
    const url = new URL('../lib/og-card.js', import.meta.url).href;
    execFileSync(process.execPath, ['--experimental-default-type=module', '--input-type=module', '-e',
      `import assert from 'node:assert/strict'; import { ogFonts } from ${JSON.stringify(url)}; await assert.rejects(ogFonts(), { code: 'ENOENT' });`], { cwd });
  } finally {
    await rm(cwd, { recursive: true });
  }
});

async function assertPng(response) {
  assert.equal(response.headers.get('content-type'), 'image/png');
  assert.equal(response.headers.get('cache-control'), 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  const { info } = await sharp(bytes).raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.width, 1200);
  assert.equal(info.height, 630);
}

for (const failure of ['total', 'partial', 'timeout']) {
  test(`both OG renderers work with ${failure} external font failure, without font requests`, async (t) => {
    let fontRequests = 0;
    t.mock.method(globalThis, 'fetch', async (input) => {
      const url = new URL(input);
      if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'font.invalid') {
        fontRequests++;
        if (failure === 'partial' && url.searchParams.get('family')?.startsWith('Orbitron')) {
          return new Response("@font-face {src: url(https://font.invalid/font.ttf) format('truetype');}");
        }
        if (failure === 'partial' && url.hostname === 'font.invalid') return new Response(orbitron);
        throw new DOMException('synthetic font failure', failure === 'timeout' ? 'TimeoutError' : 'NetworkError');
      }
      assert.ok(['localhost', '127.0.0.1'].includes(url.hostname), 'unexpected external request');
      return new Response(image, { headers: { 'content-type': 'image/png' } });
    });
    const fonts = await ogFonts('Ação e CONTEÚDO');
    assert.deepEqual(fonts.map(({ name, weight, style }) => [name, weight, style]), [['Orbitron', 800, 'normal'], ['Barlow Condensed', 600, 'normal']]);
    for (const title of ['Ação', 'Conexão, conteúdo e soluções: ÁÀÂÃÉÊÍÓÔÕÚÜÇ', 'Um título longo sobre ação, conexão e soluções práticas para compartilhar conteúdo com clareza']) {
      await assertPng(await ogResponse({ kicker: 'CONTEÚDO', title }));
      await assertPng(await ogCoverResponse({ kicker: 'CONTEÚDO', title, coverUrl: '/fixture.png' }));
    }
    assert.equal(fontRequests, 0);
  });
}

test('missing images preserve the plain card fallback and OG routes render sample content', async (t) => {
  t.mock.method(globalThis, 'fetch', async (input) => {
    assert.ok(['localhost', '127.0.0.1'].includes(new URL(input).hostname));
    return new Response(null, { status: 404 });
  });
  assert.equal(await ogCoverResponse({ title: 'Sem capa', coverUrl: '/missing.png' }), null);
  await assertPng(await ogResponse({ title: 'Sem monograma' }));
  const { getPosts } = await import('../lib/sanity.js');
  const { posts } = await getPosts({ limit: 1 });
  const { PILLARS } = await import('../lib/pillars.js');
  for (const [file, params] of [
    ['route.js', {}],
    ['central/route.js', {}],
    ['pilar/[pilar]/route.js', { pilar: PILLARS[0].slug }],
    ['posts/[slug]/route.js', { slug: posts[0].slug }],
    ['central/[slug]/route.js', { slug: 'logo-da-llc-com-ia' }],
    ['central/[slug]/route.js', { slug: 'nome-da-llc-com-ia' }],
  ]) {
    const { GET } = await import(`../app/og/${file}`);
    await assertPng(await GET(null, { params: Promise.resolve(params) }));
  }
});
