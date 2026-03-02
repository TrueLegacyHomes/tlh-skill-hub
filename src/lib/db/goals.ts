import type { SupabaseClient } from '@supabase/supabase-js';
import type { Goal, GoalSkill, GoalWithSkills } from '../types';

// ── Read operations ──

/** Get all goals ordered by display_order */
export async function getAllGoals(client: SupabaseClient): Promise<Goal[]> {
  const { data, error } = await client
    .from('goals')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('getAllGoals error:', error.message);
    return [];
  }
  return data ?? [];
}

/** Get a single goal by slug */
export async function getGoalBySlug(client: SupabaseClient, slug: string): Promise<Goal | null> {
  const { data, error } = await client
    .from('goals')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('getGoalBySlug error:', error.message);
    return null;
  }
  return data;
}

/** Get all skills for a goal, ordered by display_order */
export async function getGoalSkills(client: SupabaseClient, goalId: string): Promise<GoalSkill[]> {
  const { data, error } = await client
    .from('goal_skills')
    .select('*')
    .eq('goal_id', goalId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('getGoalSkills error:', error.message);
    return [];
  }
  return data ?? [];
}

/** Get all goals with their skills, including parent name for sub-goals */
export async function getAllGoalsWithSkills(client: SupabaseClient): Promise<GoalWithSkills[]> {
  const goals = await getAllGoals(client);
  if (goals.length === 0) return [];

  // Fetch all goal_skills in one query
  const { data: allSkills, error } = await client
    .from('goal_skills')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('getAllGoalsWithSkills skills error:', error.message);
    return goals.map(g => ({ ...g, skills: [] }));
  }

  // Build a map of parent goal names for sub-goal display
  const goalMap = new Map(goals.map(g => [g.id, g]));

  // Group skills by goal_id
  const skillsByGoal = new Map<string, GoalSkill[]>();
  for (const gs of (allSkills ?? [])) {
    const list = skillsByGoal.get(gs.goal_id) ?? [];
    list.push(gs);
    skillsByGoal.set(gs.goal_id, list);
  }

  return goals.map(g => ({
    ...g,
    skills: skillsByGoal.get(g.id) ?? [],
    parent_name: g.parent_id ? goalMap.get(g.parent_id)?.name : undefined,
  }));
}

// ── Write operations (admin only) ──

export interface CreateGoalInput {
  name: string;
  slug: string;
  description?: string;
  parent_id?: string | null;
  display_order: number;
}

/** Create a new goal */
export async function createGoal(
  client: SupabaseClient,
  input: CreateGoalInput
): Promise<{ data: Goal | null; error: string | null }> {
  const { data, error } = await client
    .from('goals')
    .insert({
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      parent_id: input.parent_id ?? null,
      display_order: input.display_order,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

/** Update an existing goal */
export async function updateGoal(
  client: SupabaseClient,
  goalId: string,
  updates: Partial<Pick<Goal, 'name' | 'slug' | 'description' | 'parent_id' | 'display_order'>>
): Promise<{ data: Goal | null; error: string | null }> {
  const { data, error } = await client
    .from('goals')
    .update(updates)
    .eq('id', goalId)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

/** Delete a goal (cascades to goal_skills) */
export async function deleteGoal(
  client: SupabaseClient,
  goalId: string
): Promise<{ error: string | null }> {
  const { error } = await client
    .from('goals')
    .delete()
    .eq('id', goalId);

  return { error: error?.message ?? null };
}

// ── Goal-Skill association management ──

/** Add a skill to a goal at a specific position */
export async function addSkillToGoal(
  client: SupabaseClient,
  goalId: string,
  skillId: string,
  displayOrder: number
): Promise<{ error: string | null }> {
  const { error } = await client
    .from('goal_skills')
    .insert({ goal_id: goalId, skill_id: skillId, display_order: displayOrder });

  return { error: error?.message ?? null };
}

/** Remove a skill from a goal */
export async function removeSkillFromGoal(
  client: SupabaseClient,
  goalId: string,
  skillId: string
): Promise<{ error: string | null }> {
  const { error } = await client
    .from('goal_skills')
    .delete()
    .eq('goal_id', goalId)
    .eq('skill_id', skillId);

  return { error: error?.message ?? null };
}

/** Batch reorder skills within a goal. orderedSkillIds array index = new display_order. */
export async function reorderGoalSkills(
  client: SupabaseClient,
  goalId: string,
  orderedSkillIds: string[]
): Promise<{ error: string | null }> {
  const updates = orderedSkillIds.map((skillId, index) =>
    client
      .from('goal_skills')
      .update({ display_order: index })
      .eq('goal_id', goalId)
      .eq('skill_id', skillId)
  );

  const results = await Promise.all(updates);
  const firstError = results.find(r => r.error);
  return { error: firstError?.error?.message ?? null };
}

/** Batch reorder goals. orderedGoalIds array index = new display_order. */
export async function reorderGoals(
  client: SupabaseClient,
  orderedGoalIds: string[]
): Promise<{ error: string | null }> {
  const updates = orderedGoalIds.map((goalId, index) =>
    client
      .from('goals')
      .update({ display_order: index })
      .eq('id', goalId)
  );

  const results = await Promise.all(updates);
  const firstError = results.find(r => r.error);
  return { error: firstError?.error?.message ?? null };
}
