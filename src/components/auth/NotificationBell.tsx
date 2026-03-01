import { useState, useEffect } from 'preact/hooks';
import { supabase } from '../../lib/supabase';
import type { Notification } from '../../lib/types';

interface NotificationBellProps {
  userId: string;
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  async function loadNotifications() {
    setLoading(true);
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) setNotifications(data);
    setLoading(false);
  }

  async function markRead(notifId: string) {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notifId);

    setNotifications(prev =>
      prev.map(n => n.id === notifId ? { ...n, is_read: true } : n)
    );
  }

  async function markAllRead() {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  }

  function getTimeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  }

  const NOTIF_ICONS: Record<string, string> = {
    approval_needed: '\u{1F514}',   // 🔔
    card_submitted: '\u{1F4E5}',    // 📥
    card_approved: '\u{2705}',      // ✅
    card_rejected: '\u{274C}',      // ❌
    changes_requested: '\u{270F}\u{FE0F}', // ✏️
    comment_added: '\u{1F4AC}',     // 💬
    card_moved: '\u{27A1}\u{FE0F}', // ➡️
    card_assigned: '\u{1F464}',     // 👤
    mention: '\u{1F4E2}',           // 📢
  };

  return (
    <div class="relative">
      {/* Bell icon button */}
      <button
        onClick={() => setOpen(!open)}
        class="relative p-2 rounded-lg hover:bg-[#e6f7f6] transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && (
          <span class="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div class="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div class="absolute right-0 top-full mt-1 w-80 bg-white rounded-lg shadow-lg border border-[#ede9d5] z-50 overflow-hidden">
            {/* Header */}
            <div class="px-4 py-3 border-b border-[#ede9d5] flex items-center justify-between">
              <h3 class="text-sm font-bold text-[#1a1a1a]">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  class="text-xs text-[#38b5ad] hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div class="max-h-80 overflow-y-auto">
              {loading && notifications.length === 0 ? (
                <div class="px-4 py-6 text-center text-sm text-[#6b7280]">Loading...</div>
              ) : notifications.length === 0 ? (
                <div class="px-4 py-6 text-center text-sm text-[#6b7280]">No notifications yet</div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (!notif.is_read) markRead(notif.id);
                      if (notif.card_id) {
                        window.location.href = '/board/';
                        setOpen(false);
                      }
                    }}
                    class={`px-4 py-3 border-b border-[#ede9d5] cursor-pointer hover:bg-[#f7f5e7] transition-colors ${
                      !notif.is_read ? 'bg-[#f0faf9]' : ''
                    }`}
                  >
                    <div class="flex gap-2">
                      <span class="text-base shrink-0 mt-0.5">
                        {NOTIF_ICONS[notif.type] || '\u{1F514}'}
                      </span>
                      <div class="flex-1 min-w-0">
                        <p class={`text-sm ${!notif.is_read ? 'font-medium text-[#1a1a1a]' : 'text-[#6b7280]'}`}>
                          {notif.title}
                        </p>
                        {notif.body && (
                          <p class="text-xs text-[#6b7280] mt-0.5 line-clamp-2">{notif.body}</p>
                        )}
                        <p class="text-[10px] text-[#6b7280] mt-1">{getTimeAgo(notif.created_at)}</p>
                      </div>
                      {!notif.is_read && (
                        <span class="w-2 h-2 rounded-full bg-[#38b5ad] shrink-0 mt-1.5" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
