import type { SupabaseClient } from '@supabase/supabase-js';
import type { Notification } from '../types';

/** Get unread notifications for a user */
export async function getUnreadNotifications(client: SupabaseClient, userId: string): Promise<Notification[]> {
  const { data, error } = await client
    .from('notifications')
    .select('*')
    .eq('recipient_id', userId)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('getUnreadNotifications error:', error.message);
    return [];
  }
  return data ?? [];
}

/** Get all notifications for a user (with limit) */
export async function getNotifications(client: SupabaseClient, userId: string, limit: number = 50): Promise<Notification[]> {
  const { data, error } = await client
    .from('notifications')
    .select('*')
    .eq('recipient_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data ?? [];
}

/** Get unread count */
export async function getUnreadCount(client: SupabaseClient, userId: string): Promise<number> {
  const { count, error } = await client
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', userId)
    .eq('is_read', false);

  if (error) return 0;
  return count ?? 0;
}

/** Mark a notification as read */
export async function markNotificationRead(client: SupabaseClient, notificationId: string): Promise<void> {
  await client
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);
}

/** Mark all notifications as read for a user */
export async function markAllRead(client: SupabaseClient, userId: string): Promise<void> {
  await client
    .from('notifications')
    .update({ is_read: true })
    .eq('recipient_id', userId)
    .eq('is_read', false);
}

/** Create a notification */
export async function createNotification(
  client: SupabaseClient,
  recipientId: string,
  type: string,
  title: string,
  body?: string,
  cardId?: string
): Promise<void> {
  await client.from('notifications').insert({
    recipient_id: recipientId,
    type,
    title,
    body: body ?? null,
    card_id: cardId ?? null,
  });
}
