import type { APIRoute } from 'astro';
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
  createSessionToken,
  verifyCredentials,
} from '@/lib/admin/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const user = String(form.get('user') ?? '').trim();
  const password = String(form.get('password') ?? '');

  const ok = await verifyCredentials(user, password);
  if (!ok) {
    return redirect('/admin/login?error=1', 303);
  }

  const token = createSessionToken(user);
  cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return redirect('/admin/nuovo-video', 303);
};
