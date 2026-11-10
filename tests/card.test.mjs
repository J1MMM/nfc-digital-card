import test from 'node:test';
import assert from 'node:assert/strict';
import { createSlug, normalizeWebsite, makeVcard } from '../lib/card.ts';

test('createSlug keeps a readable stable suffix', () => {
  assert.equal(createSlug('  Ana María Cruz  ', 'abc123'), 'ana-maria-cruz-abc123');
});

test('normalizeWebsite rejects unsafe schemes and accepts plain domains', () => {
  assert.equal(normalizeWebsite('example.com'), 'https://example.com/');
  assert.equal(normalizeWebsite('javascript:alert(1)'), null);
});

test('makeVcard escapes special text and includes direct contact data', () => {
  const card = { name: 'Ana; Cruz', title: 'Designer, Founder', company: 'North\nStudio', phone: '+639171234567', email: 'ana@example.com', website: 'https://example.com', bio: '' };
  const value = makeVcard(card, 'https://cards.example/c/ana');
  assert.match(value, /FN:Ana\\; Cruz\r\n/);
  assert.match(value, /ORG:North\\nStudio\r\n/);
  assert.match(value, /TEL;TYPE=CELL:\+639171234567\r\n/);
  assert.match(value, /URL:https:\/\/cards.example\/c\/ana\r\n/);
});
