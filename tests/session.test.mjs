import test from 'node:test';
import assert from 'node:assert/strict';
import { makeSession, verifySession } from '../lib/session.ts';

test('session validates only with the matching secret before expiry', async () => {
  const expiresAt = 1_700_000_000_000;
  const token = await makeSession('secret-one', expiresAt);
  assert.equal(await verifySession(token, 'secret-one', expiresAt - 1), true);
  assert.equal(await verifySession(token, 'other-secret', expiresAt - 1), false);
  assert.equal(await verifySession(token, 'secret-one', expiresAt + 1), false);
  assert.equal(await verifySession(token + 'x', 'secret-one', expiresAt - 1), false);
});
