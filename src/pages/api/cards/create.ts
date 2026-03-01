/**
 * POST /api/cards/create
 *
 * Creates a new card on the Kanban board. Supports two auth methods:
 *   1. Session-based (logged-in user via browser)
 *   2. Submission token (Claude Code → Skill Hub API bridge)
 *
 * After creation, the card is automatically routed through the approval engine.
 */
export const prerender = false;

import type { APIRoute } from 'astro';
import { createSupabaseServerClient, createSupabaseServiceClient } from '../../../lib/supabase';
import { routeCard } from '../../../lib/approval-engine';
import type { CardType, Department, ImpactLevel, UrgencyLevel } from '../../../lib/types';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();

    // Determine auth method and pick the right Supabase client
    let userId: string;
    let userDepartment: Department = 'operations';
    let userRole: string = 'team_member';
    let supabase: ReturnType<typeof createSupabaseServerClient>;

    if (body.submission_token) {
      // Token-based auth (Claude Code → Skill Hub bridge)
      // Use service role client to bypass RLS since there's no user session
      let serviceClient: ReturnType<typeof createSupabaseServiceClient>;
      try {
        serviceClient = createSupabaseServiceClient();
      } catch {
        return new Response(JSON.stringify({ error: 'Token-based auth not configured. Set SUPABASE_SERVICE_ROLE_KEY.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const { data: token, error: tokenError } = await serviceClient
        .from('submission_tokens')
        .select('*')
        .eq('token', body.submission_token)
        .is('used_at', null)
        .single();

      if (tokenError || !token) {
        return new Response(JSON.stringify({ error: 'Invalid or expired submission token' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Check expiration
      if (new Date(token.expires_at) < new Date()) {
        return new Response(JSON.stringify({ error: 'Submission token has expired' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      userId = token.user_id;

      // Mark token as used
      await serviceClient
        .from('submission_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('id', token.id);

      // Get user profile for department/role
      const { data: profile } = await serviceClient
        .from('profiles')
        .select('department, role')
        .eq('id', userId)
        .single();

      if (profile) {
        userDepartment = profile.department as Department;
        userRole = profile.role;
      }

      // Use service client for the rest of the operation (bypasses RLS)
      supabase = serviceClient as any;
    } else {
      // Session-based auth (browser)
      supabase = createSupabaseServerClient(request, cookies);
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Not authenticated' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      userId = user.id;

      const { data: profile } = await supabase
        .from('profiles')
        .select('department, role')
        .eq('id', userId)
        .single();

      if (profile) {
        userDepartment = profile.department as Department;
        userRole = profile.role;
      }
    }

    // Validate required fields
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Title is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get default board and submitted column
    const { data: board } = await supabase
      .from('boards')
      .select('id')
      .eq('is_default', true)
      .single();

    if (!board) {
      return new Response(JSON.stringify({ error: 'No default board found' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data: allColumns } = await supabase
      .from('columns')
      .select('*')
      .eq('board_id', board.id)
      .order('position', { ascending: true });

    const columns = allColumns ?? [];
    const submittedColumn = columns.find(c => c.status === 'submitted');

    if (!submittedColumn) {
      return new Response(JSON.stringify({ error: 'No Submitted column found' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Count cards in column for position
    const { count } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .eq('column_id', submittedColumn.id);

    // Create the card
    const { data: card, error: insertError } = await supabase
      .from('cards')
      .insert({
        board_id: board.id,
        column_id: submittedColumn.id,
        title: body.title.trim(),
        description: body.description?.trim() || null,
        card_type: (body.card_type || body.cardType || 'other') as CardType,
        status: 'submitted',
        department: (body.department || userDepartment) as Department,
        created_by: userId,
        position: count || 0,
        priority: body.priority ?? 2,
        estimated_impact: (body.estimated_impact || body.estimatedImpact || 'medium') as ImpactLevel,
        time_saved_hours: body.time_saved_hours || body.timeSavedHours || 0,
        urgency: (body.urgency || 'important') as UrgencyLevel,
        goal: body.goal?.trim() || null,
        skills_used: body.skills_used || body.skillsUsed || null,
        deliverable_summary: body.deliverable_summary || body.deliverableSummary || null,
        deliverable_url: body.deliverable_url || body.deliverableUrl || null,
      })
      .select()
      .single();

    if (insertError || !card) {
      return new Response(JSON.stringify({ error: insertError?.message || 'Failed to create card' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Log creation activity
    await supabase.from('activity_log').insert({
      actor_id: userId,
      action: 'card_created',
      card_id: card.id,
      details: { title: card.title, card_type: card.card_type },
    });

    // Get creator profile for routing
    const { data: creatorProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Route the card through the approval engine
    let routingResult = null;
    if (creatorProfile) {
      routingResult = await routeCard(supabase, card, columns, creatorProfile);
    }

    // Fetch the updated card (routing may have changed status/column)
    const { data: updatedCard } = await supabase
      .from('cards')
      .select('*')
      .eq('id', card.id)
      .single();

    return new Response(JSON.stringify({
      success: true,
      card: updatedCard || card,
      routing: routingResult ? {
        routed: routingResult.routed,
        rule_name: routingResult.rule?.name || null,
        new_status: routingResult.newStatus,
      } : null,
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error', details: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
