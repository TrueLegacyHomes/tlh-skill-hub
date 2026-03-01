import type { AstroCookies } from 'astro';
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
