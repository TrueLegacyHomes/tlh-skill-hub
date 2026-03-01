import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from './lib/supabase';

const PROTECTED_ROUTES = ['/board', '/dashboard', '/admin'];

export const onRequest = defineMiddleware(async (context, next) => {
  const supabase = createSupabaseServerClient(context.request, context.cookies);
  const { data: { user } } = await supabase.auth.getUser();

  // Make supabase client and user available to pages
  context.locals.supabase = supabase;
  context.locals.user = user;

  // Load profile if user is authenticated
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    context.locals.profile = profile;
  }

  // Protect routes that need auth
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const rawPathname = context.url.pathname.replace(/\/$/, '');
  const pathname = rawPathname.startsWith(base) ? rawPathname.slice(base.length) : rawPathname;
  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r));

  if (isProtected && !user) {
    return context.redirect(`${base}/login/`);
  }

  // Protect admin routes
  if (pathname.startsWith('/admin') && context.locals.profile?.role !== 'admin') {
    return context.redirect(`${base}/board/`);
  }

  return next();
});
