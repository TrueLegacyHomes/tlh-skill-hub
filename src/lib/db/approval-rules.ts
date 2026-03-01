import type { SupabaseClient } from '@supabase/supabase-js';
import type { ApprovalRule, CardType, Department, UserRole } from '../types';

/** Get all active approval rules, ordered by priority */
export async function getApprovalRules(client: SupabaseClient): Promise<ApprovalRule[]> {
  const { data, error } = await client
    .from('approval_rules')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: true });

  if (error) {
    console.error('getApprovalRules error:', error.message);
    return [];
  }
  return data ?? [];
}

/** Get a single approval rule by ID */
export async function getApprovalRule(client: SupabaseClient, ruleId: string): Promise<ApprovalRule | null> {
  const { data, error } = await client
    .from('approval_rules')
    .select('*')
    .eq('id', ruleId)
    .single();

  if (error) return null;
  return data;
}

/**
 * Find the best matching approval rule for a card.
 * Rules are evaluated in priority order (lowest number = highest priority).
 * A rule matches if ALL of its non-null match conditions are satisfied.
 */
export async function findMatchingRule(
  client: SupabaseClient,
  cardType: CardType,
  department: Department,
  creatorRole: UserRole,
  goal?: string | null
): Promise<ApprovalRule | null> {
  const rules = await getApprovalRules(client);

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

/** Create a new approval rule */
export async function createApprovalRule(
  client: SupabaseClient,
  rule: Omit<ApprovalRule, 'id'>
): Promise<{ data: ApprovalRule | null; error: string | null }> {
  const { data, error } = await client
    .from('approval_rules')
    .insert(rule)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

/** Update an approval rule */
export async function updateApprovalRule(
  client: SupabaseClient,
  ruleId: string,
  updates: Partial<ApprovalRule>
): Promise<{ error: string | null }> {
  const { error } = await client
    .from('approval_rules')
    .update(updates)
    .eq('id', ruleId);

  if (error) return { error: error.message };
  return { error: null };
}

/** Delete an approval rule */
export async function deleteApprovalRule(
  client: SupabaseClient,
  ruleId: string
): Promise<{ error: string | null }> {
  const { error } = await client
    .from('approval_rules')
    .delete()
    .eq('id', ruleId);

  if (error) return { error: error.message };
  return { error: null };
}
