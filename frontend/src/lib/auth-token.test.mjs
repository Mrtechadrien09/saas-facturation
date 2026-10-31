import test from 'node:test';
import assert from 'node:assert/strict';
import { getTokenFromUrl } from './auth-token.mjs';

test('parse le token OAuth dans l’URL', () => {
  assert.equal(getTokenFromUrl('?token=abc123'), 'abc123');
});

test('renvoie null si le token est absent', () => {
  assert.equal(getTokenFromUrl('https://example.com'), null);
});
