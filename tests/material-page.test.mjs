import assert from 'node:assert/strict';
import test from 'node:test';
import { safeHref } from '../lib/safe-href.js';

test('videoUrl: only http(s) links are shown on the material page', () => {
  assert.equal(safeHref('javascript:alert(1)', null), null);
  assert.equal(safeHref('data:text/html,x', null), null);
  assert.equal(safeHref('', null), null);
  assert.equal(safeHref(undefined, null), null);
  assert.equal(safeHref('https://www.instagram.com/reel/abc', null), 'https://www.instagram.com/reel/abc');
});

const { materialKicker } = await import('../lib/materials.js');

test('kicker shows minutes only when the material has them', () => {
  assert.equal(materialKicker('prompt', 2), 'Prompt • 2 min');
  assert.equal(materialKicker('prompt', null), 'Prompt');
  assert.equal(materialKicker('guia', undefined), 'Guia');
  assert.ok(!/min/.test(materialKicker('checklist', null)));
});

const { tableOfContents, hasToc } = await import('../lib/headings.js');
const { MATERIAL_TOC_MIN } = await import('../lib/materials.js');
const h2 = (t) => ({ _type: 'block', style: 'h2', children: [{ text: t }] });
const para = (t) => ({ _type: 'block', style: 'normal', children: [{ text: t }] });

test('material index ("Neste material") only with 2+ h2 sections', () => {
  const idx = (body) => hasToc(tableOfContents(body).items, MATERIAL_TOC_MIN);
  assert.equal(MATERIAL_TOC_MIN, 2);
  assert.equal(idx([]), false);
  assert.equal(idx([para('a')]), false);
  assert.equal(idx([h2('Um'), para('a')]), false);
  assert.equal(idx([h2('Um'), para('a'), h2('Dois')]), true);
  assert.equal(idx([h2('Um'), h2('Dois'), h2('Três')]), true);
});

test('posts keep the 3-section minimum', () => {
  assert.equal(hasToc(tableOfContents([h2('Um'), h2('Dois')]).items), false);
  assert.equal(hasToc(tableOfContents([h2('Um'), h2('Dois'), h2('Três')]).items), true);
});
