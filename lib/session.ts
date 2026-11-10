async function signature(secret: string, value: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const bytes = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function same(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

export async function makeSession(secret: string, expiresAt: number): Promise<string> {
  const expiry = String(expiresAt);
  return `${expiry}.${await signature(secret, expiry)}`;
}

export async function verifySession(token: string | undefined, secret: string, now = Date.now()): Promise<boolean> {
  if (!token || !secret) return false;
  const match = /^(\d{10,15})\.([a-f0-9]{64})$/.exec(token);
  if (!match || Number(match[1]) < now) return false;
  return same(match[2], await signature(secret, match[1]));
}

export async function samePassword(input: string, expected: string): Promise<boolean> {
  if (!expected) return false;
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([input, expected].map(v => crypto.subtle.digest('SHA-256', encoder.encode(v))));
  return same(Array.from(new Uint8Array(a)).join(','), Array.from(new Uint8Array(b)).join(','));
}
