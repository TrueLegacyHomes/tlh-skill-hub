import { useState } from 'preact/hooks';
import { supabase } from '../../lib/supabase';
import type { Profile } from '../../lib/types';

interface Props {
  profile: Profile;
}

export default function UserMenu({ profile }: Props) {
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = import.meta.env.BASE_URL || '/';
  }

  const initials = profile.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const roleBadge: Record<string, string> = {
    admin: 'Admin',
    department_head: 'Dept Head',
    team_member: 'Team',
    engineering: 'Engineering',
  };

  return (
    <div class="relative">
      <button
        onClick={() => setOpen(!open)}
        class="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-[var(--color-teal-light)] transition-colors"
      >
        <div class="w-8 h-8 rounded-full bg-[var(--color-teal)] text-white flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
        <span class="hidden sm:inline text-sm font-medium text-[var(--color-charcoal)]">
          {profile.full_name}
        </span>
      </button>

      {open && (
        <>
          <div class="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div class="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-[var(--color-cream-dark)] z-50 py-2">
            <div class="px-4 py-2 border-b border-[var(--color-cream-dark)]">
              <p class="text-sm font-medium text-[var(--color-charcoal)]">{profile.full_name}</p>
              <p class="text-xs text-[var(--color-gray-warm)]">{profile.email}</p>
              <span class="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-[var(--color-teal-light)] text-[var(--color-teal-dark)] rounded-full">
                {roleBadge[profile.role] || profile.role}
              </span>
            </div>
            {profile.role === 'admin' && (
              <a
                href="/admin/users/"
                class="block w-full text-left px-4 py-2 text-sm text-[var(--color-charcoal)] hover:bg-[var(--color-cream)] transition-colors no-underline"
              >
                Admin Panel
              </a>
            )}
            <button
              onClick={handleSignOut}
              class="w-full text-left px-4 py-2 text-sm text-[var(--color-charcoal)] hover:bg-[var(--color-cream)] transition-colors"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
