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
