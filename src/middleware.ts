import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from './lib/supabase';

const PROTECTED_ROUTES = ['/board', '/dashboard', '/admin'];

// Routes that require SSR auth checks (all others are static and skip auth)
const SSR_ROUTES = ['/board', '/dashboard', '/admin', '/login', '/auth', '/api', '/workflows', '/finder'];

export const onRequest = defineMiddleware(async (context, next) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const rawPathname = context.url.pathname.replace(/\/$/, '');
  const pathname = rawPathname.startsWith(base) ? rawPathname.slice(base.length) : rawPathname;

  // Only run auth for SSR routes — static pages don't need server-side auth
  const needsAuth = SSR_ROUTES.some(r => pathname.startsWith(r));

  if (!needsAuth) {
    context.locals.user = null;
    context.locals.profile = null;
    return next();
  }

  const supabase = createSupabaseServerClient(context.request, context.cookies);
  const { data: { user } } = await supabase.auth.getUser();

  // Make supabase client and user available to pages
  context.locals.supabase = supabase;
  context.locals.user = user;

  // Load profile if user is authenticated
  if (user) {
    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // First sign-in fallback — if the DB trigger didn't fire or hasn't completed yet,
    // create the profile from the Azure AD / OAuth user metadata.
    if (!profile) {
      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.user_metadata?.preferred_username ||
        user.email?.split('@')[0] ||
        'Team Member';

      const { data: newProfile } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email!,
          full_name: fullName,
          role: 'team_member',
          department: 'operations',
        })
        .select()
        .single();

      profile = newProfile;
    }

    context.locals.profile = profile;
  }

  // Protect routes that need auth
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
