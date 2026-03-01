/**
 * Approval Routing Engine
 *
 * After a card is created with status "submitted", this engine evaluates
 * the configured approval rules and automatically routes the card:
 *
 *   1. If the matching rule requires approval:
 *      → Move card to "under_review"
 *      → Set current_approver_id (admin or specified user)
 *      → Notify the approver
 *
 *   2. If the matching rule does NOT require approval:
 *      a. auto_move_to_engineering = true → Move to "engineering_queued", notify engineers
 *      b. next_status = "done" → Move to "done", mark completed
 *      c. Otherwise → Keep in submitted (manual handling)
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Card, Column, CardType, Department, UserRole, ApprovalRule, Profile } from './types';

export interface RoutingResult {
  routed: boolean;
  rule: ApprovalRule | null;
  newStatus: string | null;
  newColumnId: string | null;
  approverId: string | null;
  error: string | null;
}

/**
 * Route a newly created card based on approval rules.
 * Call this immediately after card creation.
 */
export async function routeCard(
  client: SupabaseClient,
  card: Card,
  columns: Column[],
  creatorProfile: Profile
): Promise<RoutingResult> {
  try {
    // 1. Find the matching approval rule
    const rule = await findMatchingRule(
      client,
      card.card_type as CardType,
      card.department as Department,
      creatorProfile.role as UserRole,
      card.goal
    );

    if (!rule) {
      // No matching rule — card stays in "submitted" for manual handling
      return { routed: false, rule: null, newStatus: null, newColumnId: null, approverId: null, error: null };
    }

    // 2. Determine target column and status
    let targetStatus: string;
    let approverId: string | null = null;

    if (rule.requires_approval) {
      // Route to approver
      targetStatus = 'under_review';

      // Find the approver
      if (rule.route_to_user_id) {
        // Specific user
        approverId = rule.route_to_user_id;
      } else if (rule.route_to_role) {
        // Find first active user with this role
        const { data: approvers } = await client
          .from('profiles')
          .select('id')
          .eq('role', rule.route_to_role)
          .eq('is_active', true)
          .limit(1);

        approverId = approvers?.[0]?.id ?? null;
      }
    } else if (rule.auto_move_to_engineering) {
      targetStatus = 'engineering_queued';
    } else if (rule.next_status === 'done') {
      targetStatus = 'done';
    } else {
      targetStatus = rule.next_status || 'submitted';
    }

    // Find the target column
    const targetColumn = columns.find(c => c.status === targetStatus);
    if (!targetColumn) {
      return { routed: false, rule, newStatus: null, newColumnId: null, approverId: null, error: `No column found for status: ${targetStatus}` };
    }

    // 3. Update the card
    const updates: Record<string, unknown> = {
      status: targetStatus,
      column_id: targetColumn.id,
    };

    if (approverId) {
      updates.current_approver_id = approverId;
    }

    if (targetStatus === 'done') {
      updates.completed_at = new Date().toISOString();
    }

    const { error: updateError } = await client
      .from('cards')
      .update(updates)
      .eq('id', card.id);

    if (updateError) {
      return { routed: false, rule, newStatus: null, newColumnId: null, approverId: null, error: updateError.message };
    }

    // 4. Create notifications
    await createRoutingNotifications(client, card, rule, targetStatus, approverId);

    // 5. Log activity
    await client.from('activity_log').insert({
      actor_id: card.created_by,
      action: 'card_moved',
      card_id: card.id,
      details: {
        title: card.title,
        from_status: 'submitted',
        to_status: targetStatus,
        rule_name: rule.name,
        auto_routed: true,
      },
    });

    return {
      routed: true,
      rule,
      newStatus: targetStatus,
      newColumnId: targetColumn.id,
      approverId,
      error: null,
    };
  } catch (err) {
    return { routed: false, rule: null, newStatus: null, newColumnId: null, approverId: null, error: String(err) };
  }
}

/**
 * Find the best matching approval rule for a card.
 * Rules are evaluated in priority order (lowest number = highest priority).
 * A rule matches if ALL of its non-null match conditions are satisfied.
 */
async function findMatchingRule(
  client: SupabaseClient,
  cardType: CardType,
  department: Department,
  creatorRole: UserRole,
  goal?: string | null
): Promise<ApprovalRule | null> {
  const { data: rules, error } = await client
    .from('approval_rules')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: true });

  if (error || !rules) return null;

  for (const rule of rules) {
    let matches = true;

    if (rule.match_card_type !== null && rule.match_card_type !== cardType) {
      matches = false;
    }
    if (rule.match_department !== null && rule.match_department !== department) {
      matches = false;
    }
    if (rule.match_creator_role !== null && rule.match_creator_role !== creatorRole) {
      matches = false;
    }
    if (rule.match_goal !== null && goal && rule.match_goal !== goal) {
      matches = false;
    }

    if (matches) return rule;
  }

  return null;
}

/**
 * Create notifications based on the routing result.
 */
async function createRoutingNotifications(
  client: SupabaseClient,
  card: Card,
  rule: ApprovalRule,
  targetStatus: string,
  approverId: string | null
): Promise<void> {
  if (rule.requires_approval && approverId) {
    // Notify the approver that a card needs their review
    await client.from('notifications').insert({
      recipient_id: approverId,
      card_id: card.id,
      type: 'approval_needed',
      title: `Review needed: ${card.title}`,
      body: `A new ${card.card_type.replace(/_/g, ' ')} has been submitted and needs your approval.`,
    });
  }

  if (targetStatus === 'engineering_queued') {
    // Notify all engineers that new work is in the queue
    const { data: engineers } = await client
      .from('profiles')
      .select('id')
      .eq('role', 'engineering')
      .eq('is_active', true);

    if (engineers) {
      const notifications = engineers.map(eng => ({
        recipient_id: eng.id,
        card_id: card.id,
        type: 'card_submitted' as const,
        title: `New in Engineering Queue: ${card.title}`,
        body: `A ${card.card_type.replace(/_/g, ' ')} is ready for engineering pickup.`,
      }));

      if (notifications.length > 0) {
        await client.from('notifications').insert(notifications);
      }
    }
  }

  if (targetStatus === 'done') {
    // Notify the creator that their card was auto-completed
    await client.from('notifications').insert({
      recipient_id: card.created_by,
      card_id: card.id,
      type: 'card_moved',
      title: `Card completed: ${card.title}`,
      body: 'Your card was automatically marked as Done (no engineering work needed).',
    });
  }
}
