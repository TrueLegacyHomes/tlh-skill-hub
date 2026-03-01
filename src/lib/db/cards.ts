import type { SupabaseClient } from '@supabase/supabase-js';
import type { Card, CardType, CardStatus, Department, ImpactLevel, UrgencyLevel } from '../types';

export interface CardFilters {
  boardId: string;
  status?: CardStatus;
  department?: Department;
  assignedTo?: string;
  createdBy?: string;
  cardType?: CardType;
}

export interface CreateCardInput {
  boardId: string;
  columnId: string;
  title: string;
  description?: string;
  cardType: CardType;
  department: Department;
  createdBy: string;
  goal?: string;
  skillsUsed?: string[];
  workflowName?: string;
  deliverableSummary?: string;
  deliverableUrl?: string;
  priority?: number;
  estimatedImpact?: ImpactLevel;
  timeSavedHours?: number;
  urgency?: UrgencyLevel;
}

export interface MoveCardInput {
  cardId: string;
  newColumnId: string;
  newStatus: CardStatus;
  position: number;
}

/** Get all cards for a board, with optional filters */
export async function getCards(client: SupabaseClient, filters: CardFilters): Promise<Card[]> {
  let query = client
    .from('cards')
    .select('*')
    .eq('board_id', filters.boardId);

  if (filters.status) query = query.eq('status', filters.status);
  if (filters.department) query = query.eq('department', filters.department);
  if (filters.assignedTo) query = query.eq('assigned_to', filters.assignedTo);
  if (filters.createdBy) query = query.eq('created_by', filters.createdBy);
  if (filters.cardType) query = query.eq('card_type', filters.cardType);

  const { data, error } = await query.order('composite_score', { ascending: false });

  if (error) {
    console.error('getCards error:', error.message);
    return [];
  }
  return data ?? [];
}

/** Get a single card by ID */
export async function getCard(client: SupabaseClient, cardId: string): Promise<Card | null> {
  const { data, error } = await client
    .from('cards')
    .select('*')
    .eq('id', cardId)
    .single();

  if (error) {
    console.error('getCard error:', error.message);
    return null;
  }
  return data;
}

/** Create a new card */
export async function createCard(client: SupabaseClient, input: CreateCardInput): Promise<{ data: Card | null; error: string | null }> {
  const { data, error } = await client
    .from('cards')
    .insert({
      board_id: input.boardId,
      column_id: input.columnId,
      title: input.title,
      description: input.description ?? null,
      card_type: input.cardType,
      status: 'submitted' as CardStatus,
      department: input.department,
      created_by: input.createdBy,
      goal: input.goal ?? null,
      skills_used: input.skillsUsed ?? null,
      workflow_name: input.workflowName ?? null,
      deliverable_summary: input.deliverableSummary ?? null,
      deliverable_url: input.deliverableUrl ?? null,
      priority: input.priority ?? 2,
      estimated_impact: input.estimatedImpact ?? 'medium',
      time_saved_hours: input.timeSavedHours ?? 0,
      urgency: input.urgency ?? 'important',
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

/** Move a card to a new column/status */
export async function moveCard(client: SupabaseClient, input: MoveCardInput): Promise<{ error: string | null }> {
  const updates: Record<string, unknown> = {
    column_id: input.newColumnId,
    status: input.newStatus,
    position: input.position,
  };

  // Mark completed_at when moved to done
  if (input.newStatus === 'done') {
    updates.completed_at = new Date().toISOString();
  }

  const { error } = await client
    .from('cards')
    .update(updates)
    .eq('id', input.cardId);

  if (error) return { error: error.message };
  return { error: null };
}

/** Assign a card to a user */
export async function assignCard(client: SupabaseClient, cardId: string, userId: string): Promise<{ error: string | null }> {
  const { error } = await client
    .from('cards')
    .update({ assigned_to: userId })
    .eq('id', cardId);

  if (error) return { error: error.message };
  return { error: null };
}

/** Approve a card */
export async function approveCard(client: SupabaseClient, cardId: string, approverId: string): Promise<{ error: string | null }> {
  const { error } = await client
    .from('cards')
    .update({
      status: 'approved' as CardStatus,
      approved_by: approverId,
      approved_at: new Date().toISOString(),
    })
    .eq('id', cardId);

  if (error) return { error: error.message };
  return { error: null };
}

/** Request changes on a card */
export async function requestChanges(client: SupabaseClient, cardId: string): Promise<{ error: string | null }> {
  const { error } = await client
    .from('cards')
    .update({ status: 'changes_requested' as CardStatus })
    .eq('id', cardId);

  if (error) return { error: error.message };
  return { error: null };
}
