export type ContactData = {
  name: string;
  title?: string | null;
  company?: string | null;
  bio?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
};

export function createSlug(name: string, suffix: string): string {
  const base = name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'contact';
  return `${base}-${suffix.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12)}`;
}

export function normalizeWebsite(value: string): string | null {
  const input = value.trim();
  if (!input) return null;
  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(input) ? input : `https://${input}`);
    return ['http:', 'https:'].includes(url.protocol) && url.hostname.includes('.') ? url.toString() : null;
  } catch { return null; }
}

function escapeVcard(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;').replace(/,/g, '\\,');
}

export function makeVcard(card: ContactData, cardUrl: string, photoUrl?: string): string {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${escapeVcard(card.name)}`];
  if (card.company) lines.push(`ORG:${escapeVcard(card.company)}`);
  if (card.title) lines.push(`TITLE:${escapeVcard(card.title)}`);
  if (card.phone) lines.push(`TEL;TYPE=CELL:${escapeVcard(card.phone)}`);
  if (card.email) lines.push(`EMAIL;TYPE=INTERNET:${escapeVcard(card.email)}`);
  if (card.website) lines.push(`URL:${card.website}`);
  if (card.bio) lines.push(`NOTE:${escapeVcard(card.bio)}`);
  if (photoUrl) lines.push(`PHOTO;VALUE=URI:${photoUrl}`);
  lines.push(`URL:${cardUrl}`, 'END:VCARD');
  return `${lines.join('\r\n')}\r\n`;
}
