import type { SupabaseClient } from '@supabase/supabase-js';

export interface ActivityEntry {
  id: string;
  card_id: string | null;
  actor_id: string;
  action: string;
  details: Record<string, unknown> | null;
  created_at: string;
}

/** Get recent activity (org-wide) */
export async function getRecentActivity(client: SupabaseClient, limit: number = 20): Promise<ActivityEntry[]> {
  const { data, error } = await client
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('getRecentActivity error:', error.message);
    return [];
  }
  return data ?? [];
}

/** Get activity for a specific card */
export async function getCardActivity(client: SupabaseClient, cardId: string): Promise<ActivityEntry[]> {
  const { data, error } = await client
    .from('activity_log')
    .select('*')
    .eq('card_id', cardId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data ?? [];
}

/** Log an activity */
export async function logActivity(
  client: SupabaseClient,
  actorId: string,
  action: string,
  cardId?: string,
  details?: Record<string, unknown>
): Promise<void> {
  await client.from('activity_log').insert({
    actor_id: actorId,
    action,
    card_id: cardId ?? null,
    details: details ?? null,
  });
}
