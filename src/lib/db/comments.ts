import type { SupabaseClient } from '@supabase/supabase-js';
import type { Comment } from '../types';

/** Get all comments for a card, ordered by creation time */
export async function getComments(client: SupabaseClient, cardId: string): Promise<Comment[]> {
  const { data, error } = await client
    .from('comments')
    .select('*')
    .eq('card_id', cardId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('getComments error:', error.message);
    return [];
  }
  return data ?? [];
}

/** Add a comment to a card */
export async function addComment(
  client: SupabaseClient,
  cardId: string,
  authorId: string,
  body: string,
  isSystem: boolean = false
): Promise<{ data: Comment | null; error: string | null }> {
  const { data, error } = await client
    .from('comments')
    .insert({
      card_id: cardId,
      author_id: authorId,
      body,
      is_system: isSystem,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}
