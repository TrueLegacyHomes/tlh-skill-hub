import type { SupabaseClient } from '@supabase/supabase-js';
import type { Column } from '../types';

/** Get the default board ID */
export async function getDefaultBoardId(client: SupabaseClient): Promise<string | null> {
  const { data } = await client
    .from('boards')
    .select('id')
    .eq('is_default', true)
    .single();
  return data?.id ?? null;
}

/** Get all columns for a board, ordered by position */
export async function getColumns(client: SupabaseClient, boardId: string): Promise<Column[]> {
  const { data, error } = await client
    .from('columns')
    .select('*')
    .eq('board_id', boardId)
    .order('position', { ascending: true });

  if (error) {
    console.error('getColumns error:', error.message);
    return [];
  }
  return data ?? [];
}
