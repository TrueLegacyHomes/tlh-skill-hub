import type { AstroCookies } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { createBrowserClient, createServerClient, parseCookieHeader } from '@supabase/ssr';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

/** Browser client — use in Preact islands and client-side scripts.
 *  Uses cookie storage so PKCE code_verifier is accessible to the server. */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

/** Server client — use in Astro pages and API routes (server-side) */
export function createSupabaseServerClient(request: Request, cookies: AstroCookies) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('Cookie') ?? '');
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies.set(name, value, options);
        });
      },
    },
  });
}

/**
 * Service role client — bypasses RLS. Use ONLY on server-side API routes
 * for operations that require elevated permissions (e.g., token-based auth
 * from Claude Code where there's no user session).
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY env variable (not PUBLIC_ prefixed).
 */
export function createSupabaseServiceClient() {
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set. Add it to your .env and Vercel env vars.');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
