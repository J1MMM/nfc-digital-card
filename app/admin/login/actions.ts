'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { makeSession, samePassword } from '../../../lib/session';

export async function loginAction(formData: FormData) {
  const password = String(formData.get('password') || '');
  if (!await samePassword(password, process.env.ADMIN_PASSWORD || '')) redirect('/admin/login?error=1');
  const jar = await cookies();
  jar.set('tapcard_admin', await makeSession(process.env.SESSION_SECRET || '', Date.now() + 7 * 86400000), {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 7 * 86400,
  });
  redirect('/admin');
}
