import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySession } from './session';

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifySession(jar.get('tapcard_admin')?.value, process.env.SESSION_SECRET || '');
}

export async function requireAdmin(): Promise<void> {
  if (!await isAdmin()) redirect('/admin/login');
}
