/**
 * POST /api/cards/move
 *
 * Move a card to a different column/status with permission checks.
 * Requires session-based auth (logged-in user).
 *
 * Body: { cardId, targetColumnId }
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerClient(request, cookies);

  try {
    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { cardId, targetColumnId } = body;

    if (!cardId || !targetColumnId) {
      return new Response(JSON.stringify({ error: 'cardId and targetColumnId are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the card
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .select('*')
      .eq('id', cardId)
      .single();

    if (cardError || !card) {
      return new Response(JSON.stringify({ error: 'Card not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the user's profile for permission check
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Permission check
    const isAdmin = profile.role === 'admin';
    const isOwner = card.created_by === user.id;
    const isAssigned = card.assigned_to === user.id;
    const isApprover = card.current_approver_id === user.id;
    const isEngineer = profile.role === 'engineering';

    const canMove = isAdmin || isOwner || isAssigned || isApprover ||
      (isEngineer && card.status === 'engineering_queued');

    if (!canMove) {
      return new Response(JSON.stringify({ error: 'Permission denied' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get target column
    const { data: targetColumn, error: colError } = await supabase
      .from('columns')
      .select('*')
      .eq('id', targetColumnId)
      .single();

    if (colError || !targetColumn) {
      return new Response(JSON.stringify({ error: 'Target column not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Calculate new position
    const { count } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .eq('column_id', targetColumnId)
      .neq('id', cardId);

    // Build update
    const updates: Record<string, unknown> = {
      column_id: targetColumnId,
      status: targetColumn.status,
      position: count || 0,
    };

    // Auto-assign engineer when they pick up a card
    if (targetColumn.status === 'in_progress' && isEngineer && !card.assigned_to) {
      updates.assigned_to = user.id;
    }

    // Mark completed_at when moved to done
    if (targetColumn.status === 'done') {
      updates.completed_at = new Date().toISOString();
    }

    // Update the card
    const { data: updatedCard, error: updateError } = await supabase
      .from('cards')
      .update(updates)
      .eq('id', cardId)
      .select()
      .single();

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Log activity
    await supabase.from('activity_log').insert({
      actor_id: user.id,
      action: 'card_moved',
      card_id: cardId,
      details: {
        title: card.title,
        from_status: card.status,
        to_status: targetColumn.status,
      },
    });

    return new Response(JSON.stringify({ success: true, card: updatedCard }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error', details: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
