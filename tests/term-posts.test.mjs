import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import test from 'node:test';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) return nextResolve(new URL(`../${specifier.slice(2)}.js`, import.meta.url).href, context);
    if (specifier.startsWith('./') && !/\.[a-z]+$/i.test(specifier)) return nextResolve(`${specifier}.js`, context);
    return nextResolve(specifier, context);
  },
});
const { getTerm, getTermPosts } = await import('../lib/sanity.js');

test('getTermPosts: posts that mention the term, newest first, at most 6', async () => {
  const ein = await getTerm('ein');
  const posts = await getTermPosts(ein);
  assert.ok(posts.length >= 1 && posts.length <= 6);
  assert.ok(posts.some((p) => p.slug === 'o-que-e-o-ein'));
  const dates = posts.map((p) => p.publishedAt);
  assert.deepEqual(dates, [...dates].sort().reverse());
  assert.ok(posts.every((p) => p.title && p.minutes > 0));
  const none = await getTermPosts({ term: 'Zzzzqx', aliases: [] });
  assert.deepEqual(none, []);
});
