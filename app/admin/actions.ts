'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getCardById, saveCard, uploadPhoto } from '../../lib/cards-store';
import { requireAdmin } from '../../lib/admin-auth';
import { createSlug, normalizeWebsite } from '../../lib/card';

export type SaveState = { error: string };

const field = (data: FormData, name: string, limit = 250) => String(data.get(name) || '').trim().slice(0, limit);

export async function saveCardAction(_state: SaveState, data: FormData): Promise<SaveState> {
  await requireAdmin();
  const name = field(data, 'name', 100);
  const id = field(data, 'id', 40);
  if (name.length < 2) return { error: 'Enter a name with at least two characters.' };
  const email = field(data, 'email', 200);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Enter a valid email address.' };
  const linkFields = ['website', 'linkedin', 'instagram', 'facebook', 'tiktok'] as const;
  const links: Record<string, string> = {};
  for (const key of linkFields) {
    const raw = field(data, key, 500);
    const normalized = raw ? normalizeWebsite(raw) : '';
    if (raw && !normalized) return { error: `Enter a valid ${key} URL.` };
    links[key] = normalized || '';
  }
  const existing = id ? await getCardById(id) : null;
  if (id && !existing) return { error: 'This card no longer exists. Return to the dashboard.' };
  let photoKey = existing?.photoKey || '';
  const photo = data.get('photo');
  if (photo instanceof File && photo.size > 0) {
    if (photo.size > 3 * 1024 * 1024) return { error: 'Choose a photo under 3 MB.' };
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(photo.type)) return { error: 'Use a JPG, PNG, WebP, or AVIF photo.' };
    const nextKey = crypto.randomUUID();
    try {
      await uploadPhoto(nextKey, photo);
    } catch {
      return { error: 'Photo upload failed. Check the private “photos” bucket in Supabase, then try again.' };
    }
    photoKey = nextKey;
  }
  const now = Date.now();
  const values = {
    name, title: field(data, 'title', 120), company: field(data, 'company', 120), bio: field(data, 'bio', 600),
    phone: field(data, 'phone', 50), email, website: links.website, linkedin: links.linkedin,
    instagram: links.instagram, facebook: links.facebook, tiktok: links.tiktok, photoKey, updatedAt: now,
  };
  const slug = existing?.slug || createSlug(name, crypto.randomUUID().replaceAll('-', '').slice(0, 8));
  await saveCard({ id: existing?.id || crypto.randomUUID(), slug, createdAt: existing?.createdAt || now, ...values });
  revalidatePath('/admin');
  revalidatePath(`/c/${slug}`);
  redirect(`/admin?${existing ? 'updated' : 'created'}=${encodeURIComponent(slug)}`);
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete('tapcard_admin');
  redirect('/admin/login');
}
