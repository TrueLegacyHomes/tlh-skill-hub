import { useState, useEffect } from 'preact/hooks';
import { createClient } from '@supabase/supabase-js';
import type { Card, Column, Profile, Comment } from '../../lib/types';

interface CardDetailModalProps {
  card: Card;
  profiles: Record<string, Profile>;
  currentUser: Profile;
  columns: Column[];
  supabaseUrl: string;
  supabaseAnonKey: string;
  onClose: () => void;
  onCardUpdated: (card: Card) => void;
}

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  changes_requested: 'Changes Requested',
  approved: 'Approved',
  engineering_queued: 'Engineering Queue',
  in_progress: 'In Progress',
  done: 'Done',
  archived: 'Archived',
};

const TYPE_LABELS: Record<string, string> = {
  problem_definition: 'Problem Definition',
  sop: 'Standard Operating Procedure',
  new_product_plan: 'New Product Plan',
  system_change_request: 'System Change Request',
  report_dashboard: 'Report / Dashboard',
  automation_plan: 'Automation Plan',
  template: 'Template',
  skill_improvement: 'Skill Improvement',
  engineering_build: 'Engineering Build',
  other: 'Other',
};

const PRIORITY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'P1 — Urgent', color: '#dc2626' },
  2: { label: 'P2 — Important', color: '#d97706' },
  3: { label: 'P3 — Nice to Have', color: '#6b7280' },
};

export default function CardDetailModal({
  card,
  profiles,
  currentUser,
  columns,
  supabaseUrl,
  supabaseAnonKey,
  onClose,
  onCardUpdated,
}: CardDetailModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const client = createClient(supabaseUrl, supabaseAnonKey);
  const isAdmin = currentUser.role === 'admin';
  const isApprover = isAdmin || card.current_approver_id === currentUser.id;
  const isOwner = card.created_by === currentUser.id;
  const isEngineer = currentUser.role === 'engineering';

  // Load comments
  useEffect(() => {
    loadComments();
  }, [card.id]);

  async function loadComments() {
    const { data } = await client
      .from('comments')
      .select('*')
      .eq('card_id', card.id)
      .order('created_at', { ascending: true });
    if (data) setComments(data);
  }

  async function handleAddComment() {
    if (!newComment.trim()) return;
    setLoading(true);

    const { data, error } = await client
      .from('comments')
      .insert({
        card_id: card.id,
        author_id: currentUser.id,
        body: newComment.trim(),
        is_system: false,
      })
      .select()
      .single();

    if (!error && data) {
      setComments(prev => [...prev, data]);
      setNewComment('');
    }
    setLoading(false);
  }

  async function handleApprove() {
    setActionLoading(true);
    const approvedColumn = columns.find(c => c.status === 'approved');
    const engColumn = columns.find(c => c.status === 'engineering_queued');
    const targetColumn = engColumn || approvedColumn;

    if (!targetColumn) return;

    const { data, error } = await client
      .from('cards')
      .update({
        status: targetColumn.status,
        column_id: targetColumn.id,
        approved_by: currentUser.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', card.id)
      .select()
      .single();

    if (!error && data) {
      // Add system comment
      await client.from('comments').insert({
        card_id: card.id,
        author_id: currentUser.id,
        body: `Approved by ${currentUser.full_name}`,
        is_system: true,
      });
      onCardUpdated(data);
    }
    setActionLoading(false);
  }

  async function handleRequestChanges() {
    const reason = prompt('What changes are needed?');
    if (!reason) return;

    setActionLoading(true);
    const changesCol = columns.find(c => c.status === 'changes_requested');
    if (!changesCol) return;

    const { data, error } = await client
      .from('cards')
      .update({
        status: 'changes_requested',
        column_id: changesCol.id,
      })
      .eq('id', card.id)
      .select()
      .single();

    if (!error && data) {
      await client.from('comments').insert({
        card_id: card.id,
        author_id: currentUser.id,
        body: `Changes requested: ${reason}`,
        is_system: true,
      });
      onCardUpdated(data);
      loadComments();
    }
    setActionLoading(false);
  }

  async function handleAssignToMe() {
    setActionLoading(true);
    const inProgressCol = columns.find(c => c.status === 'in_progress');
    if (!inProgressCol) return;

    const { data, error } = await client
      .from('cards')
      .update({
        assigned_to: currentUser.id,
        status: 'in_progress',
        column_id: inProgressCol.id,
      })
      .eq('id', card.id)
      .select()
      .single();

    if (!error && data) {
      await client.from('comments').insert({
        card_id: card.id,
        author_id: currentUser.id,
        body: `Assigned to ${currentUser.full_name} (Engineer)`,
        is_system: true,
      });
      onCardUpdated(data);
    }
    setActionLoading(false);
  }

  async function handleMarkDone() {
    setActionLoading(true);
    const doneCol = columns.find(c => c.status === 'done');
    if (!doneCol) return;

    const { data, error } = await client
      .from('cards')
      .update({
        status: 'done',
        column_id: doneCol.id,
        completed_at: new Date().toISOString(),
      })
      .eq('id', card.id)
      .select()
      .single();

    if (!error && data) {
      await client.from('comments').insert({
        card_id: card.id,
        author_id: currentUser.id,
        body: `Marked as Done by ${currentUser.full_name}`,
        is_system: true,
      });
      onCardUpdated(data);
    }
    setActionLoading(false);
  }

  const creator = profiles[card.created_by];
  const assignee = card.assigned_to ? profiles[card.assigned_to] : null;
  const approver = card.approved_by ? profiles[card.approved_by] : null;
  const priority = PRIORITY_LABELS[card.priority] || PRIORITY_LABELS[2];
  const timeAgo = getTimeAgo(card.created_at);

  return (
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div class="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div class="sticky top-0 bg-white border-b border-[#ede9d5] px-6 py-4 flex items-start justify-between rounded-t-2xl z-10">
          <div class="flex-1 pr-4">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-bold uppercase px-2 py-0.5 rounded bg-[#e6f7f6] text-[#2a908a]">
                {TYPE_LABELS[card.card_type] || 'Other'}
              </span>
              <span class="text-xs px-2 py-0.5 rounded bg-[#f3f4f6] text-[#6b7280]">
                {STATUS_LABELS[card.status] || card.status}
              </span>
            </div>
            <h2 class="text-lg font-bold text-[#1a1a1a]">{card.title}</h2>
          </div>
          <button
            onClick={onClose}
            class="text-[#6b7280] hover:text-[#1a1a1a] transition-colors text-xl leading-none mt-1"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div class="px-6 py-4 space-y-5">
          {/* Description */}
          {card.description && (
            <div>
              <h4 class="text-xs font-bold text-[#6b7280] uppercase mb-1">Description</h4>
              <p class="text-sm text-[#1a1a1a] leading-relaxed whitespace-pre-wrap">{card.description}</p>
            </div>
          )}

          {/* Metadata grid */}
          <div class="grid grid-cols-2 gap-4">
            <MetaField label="Department" value={card.department.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} />
            <MetaField label="Priority" value={priority.label} color={priority.color} />
            <MetaField label="Impact" value={card.estimated_impact.replace(/\b\w/g, c => c.toUpperCase())} />
            <MetaField label="Urgency" value={card.urgency.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} />
            <MetaField label="Time Saved" value={card.time_saved_hours > 0 ? `~${card.time_saved_hours} hrs/week` : 'Not estimated'} />
            <MetaField label="Composite Score" value={String(card.composite_score)} />
            <MetaField label="Created By" value={creator?.full_name || 'Unknown'} />
            <MetaField label="Created" value={timeAgo} />
            {assignee && <MetaField label="Assigned To" value={assignee.full_name} />}
            {approver && <MetaField label="Approved By" value={approver.full_name} />}
          </div>

          {/* Skills used */}
          {card.skills_used && card.skills_used.length > 0 && (
            <div>
              <h4 class="text-xs font-bold text-[#6b7280] uppercase mb-1">Skills Used</h4>
              <div class="flex flex-wrap gap-1">
                {card.skills_used.map((s, i) => (
                  <span key={i} class="text-xs px-2 py-0.5 rounded-full bg-[#e6f7f6] text-[#2a908a]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Goal */}
          {card.goal && (
            <div>
              <h4 class="text-xs font-bold text-[#6b7280] uppercase mb-1">Goal</h4>
              <p class="text-sm text-[#1a1a1a]">{card.goal}</p>
            </div>
          )}

          {/* Deliverable link */}
          {card.deliverable_url && (
            <div>
              <h4 class="text-xs font-bold text-[#6b7280] uppercase mb-1">Deliverable</h4>
              <a
                href={card.deliverable_url}
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-[#2a908a] underline hover:text-[#0f4676]"
              >
                View Deliverable
              </a>
              {card.deliverable_summary && (
                <p class="text-xs text-[#6b7280] mt-1">{card.deliverable_summary}</p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div class="flex flex-wrap gap-2 pt-2 border-t border-[#ede9d5]">
            {/* Approve / Request Changes — for approvers during review */}
            {isApprover && (card.status === 'under_review' || card.status === 'submitted') && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  class="px-4 py-2 text-sm font-bold text-white bg-[#059669] rounded-lg hover:bg-[#047857] transition-colors disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={handleRequestChanges}
                  disabled={actionLoading}
                  class="px-4 py-2 text-sm font-bold text-white bg-[#d97706] rounded-lg hover:bg-[#b45309] transition-colors disabled:opacity-50"
                >
                  Request Changes
                </button>
              </>
            )}

            {/* Assign to Me — for engineers in engineering queue */}
            {isEngineer && card.status === 'engineering_queued' && !card.assigned_to && (
              <button
                onClick={handleAssignToMe}
                disabled={actionLoading}
                class="px-4 py-2 text-sm font-bold text-white bg-[#0f4676] rounded-lg hover:bg-[#0d3a63] transition-colors disabled:opacity-50"
              >
                Assign to Me
              </button>
            )}

            {/* Mark Done — for assigned engineer or admin */}
            {(isAdmin || (isAssigned(card, currentUser) && card.status === 'in_progress')) && card.status === 'in_progress' && (
              <button
                onClick={handleMarkDone}
                disabled={actionLoading}
                class="px-4 py-2 text-sm font-bold text-white bg-[#6b7280] rounded-lg hover:bg-[#4b5563] transition-colors disabled:opacity-50"
              >
                Mark Done
              </button>
            )}

            {/* Admin: Move to any column */}
            {isAdmin && (
              <select
                onChange={async (e) => {
                  const colId = (e.target as HTMLSelectElement).value;
                  if (!colId) return;
                  const col = columns.find(c => c.id === colId);
                  if (!col) return;
                  setActionLoading(true);
                  const { data, error } = await client
                    .from('cards')
                    .update({ column_id: colId, status: col.status })
                    .eq('id', card.id)
                    .select()
                    .single();
                  if (!error && data) onCardUpdated(data);
                  setActionLoading(false);
                }}
                class="text-xs border border-[#ede9d5] rounded-lg px-2 py-2 bg-white text-[#1a1a1a]"
              >
                <option value="">Move to...</option>
                {columns.map(col => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Comments */}
          <div class="pt-2 border-t border-[#ede9d5]">
            <h4 class="text-xs font-bold text-[#6b7280] uppercase mb-3">
              Comments ({comments.length})
            </h4>

            <div class="space-y-3 max-h-60 overflow-y-auto mb-3">
              {comments.length === 0 ? (
                <p class="text-xs text-[#6b7280]">No comments yet.</p>
              ) : (
                comments.map(comment => {
                  const author = profiles[comment.author_id];
                  return (
                    <div
                      key={comment.id}
                      class={`text-sm p-3 rounded-lg ${
                        comment.is_system
                          ? 'bg-[#f3f4f6] text-[#6b7280] italic'
                          : 'bg-[#f7f5e7]'
                      }`}
                    >
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs font-bold text-[#1a1a1a]">
                          {author?.full_name || 'Unknown'}
                        </span>
                        <span class="text-[10px] text-[#6b7280]">
                          {getTimeAgo(comment.created_at)}
                        </span>
                      </div>
                      <p class="text-sm leading-relaxed">{comment.body}</p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add comment */}
            <div class="flex gap-2">
              <input
                type="text"
                value={newComment}
                onInput={(e) => setNewComment((e.target as HTMLInputElement).value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Add a comment..."
                class="flex-1 text-sm border border-[#ede9d5] rounded-lg px-3 py-2 focus:outline-none focus:border-[#38b5ad]"
              />
              <button
                onClick={handleAddComment}
                disabled={loading || !newComment.trim()}
                class="px-4 py-2 text-sm font-bold text-white bg-[#38b5ad] rounded-lg hover:bg-[#2a908a] transition-colors disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function isAssigned(card: Card, user: Profile): boolean {
  return card.assigned_to === user.id;
}

function MetaField({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <span class="text-[10px] font-bold text-[#6b7280] uppercase">{label}</span>
      <p class="text-sm text-[#1a1a1a] font-medium" style={color ? { color } : undefined}>{value}</p>
    </div>
  );
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
