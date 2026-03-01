import { supabase } from '../../lib/supabase';

export default function LoginButton() {
  async function handleSignIn() {
    const base = import.meta.env.BASE_URL || '/';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${window.location.origin}${base}auth/callback/`,
        scopes: 'email profile',
      },
    });
    if (error) {
      console.error('Sign in error:', error.message);
    }
  }

  return (
    <button
      onClick={handleSignIn}
      class="px-4 py-2 text-sm font-medium text-white bg-[var(--color-navy)] rounded-lg hover:bg-[#0d3a63] transition-colors"
    >
      Sign In
    </button>
  );
}
