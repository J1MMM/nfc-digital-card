import { createClient } from '@supabase/supabase-js';

export type Card = {
  id: string; slug: string; name: string; title: string; company: string; bio: string;
  phone: string; email: string; website: string; linkedin: string; instagram: string;
  facebook: string; tiktok: string; photoKey: string; createdAt: number; updatedAt: number;
};

type CardRow = Omit<Card, 'photoKey' | 'createdAt' | 'updatedAt'> & {
  x?: string; photo_key: string; created_at: number; updated_at: number;
};

function client() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error('Set SUPABASE_URL and SUPABASE_SECRET_KEY.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function toCard(row: CardRow): Card {
  return {
    id: row.id, slug: row.slug, name: row.name, title: row.title, company: row.company,
    bio: row.bio, phone: row.phone, email: row.email, website: row.website,
    linkedin: row.linkedin, instagram: row.instagram, facebook: row.facebook,
    tiktok: row.tiktok, photoKey: row.photo_key, createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toRow(card: Card): CardRow {
  const { photoKey, createdAt, updatedAt, ...rest } = card;
  return { ...rest, photo_key: photoKey, created_at: createdAt, updated_at: updatedAt };
}

export async function getCardById(id: string): Promise<Card | null> {
  const { data, error } = await client().from('cards').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? toCard(data as CardRow) : null;
}

export async function getCardBySlug(slug: string): Promise<Card | null> {
  const { data, error } = await client().from('cards').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data ? toCard(data as CardRow) : null;
}

export async function listCards(): Promise<Card[]> {
  const { data, error } = await client().from('cards').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data as CardRow[]).map(toCard);
}

export async function saveCard(card: Card): Promise<void> {
  const { error } = await client().from('cards').upsert(toRow(card), { onConflict: 'id' });
  if (error) throw error;
}

export async function uploadPhoto(key: string, photo: File): Promise<void> {
  const { error } = await client().storage.from('photos').upload(key, photo, { contentType: photo.type, upsert: false });
  if (error) throw error;
}

export async function downloadPhoto(key: string): Promise<Blob | null> {
  const { data, error } = await client().storage.from('photos').download(key);
  if (error) {
    if (error.message.toLowerCase().includes('not found')) return null;
    throw error;
  }
  return data;
}
