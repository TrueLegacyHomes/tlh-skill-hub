import { useState } from 'preact/hooks';
import { supabase } from '../../lib/supabase';
import type { Card, Column, Profile, CardType, Department, ImpactLevel, UrgencyLevel } from '../../lib/types';

interface NewCardFormProps {
  boardId: string;
  columns: Column[];
  currentUser: Profile;
  onClose: () => void;
  onCreated: (card: Card) => void;
}

const CARD_TYPES: { value: CardType; label: string }[] = [
  { value: 'problem_definition', label: 'Problem Definition' },
  { value: 'sop', label: 'Standard Operating Procedure' },
  { value: 'new_product_plan', label: 'New Product Plan' },
  { value: 'system_change_request', label: 'System Change Request' },
  { value: 'report_dashboard', label: 'Report / Dashboard' },
  { value: 'automation_plan', label: 'Automation Plan' },
  { value: 'template', label: 'Template' },
  { value: 'skill_improvement', label: 'Skill Improvement' },
  { value: 'engineering_build', label: 'Engineering Build' },
  { value: 'other', label: 'Other' },
];

const DEPARTMENTS: { value: Department; label: string }[] = [
  { value: 'executive', label: 'Executive' },
  { value: 'operations', label: 'Operations' },
  { value: 'interior_design', label: 'Interior Design' },
  { value: 'estate_sales', label: 'Estate Sales' },
  { value: 'home_acquisitions', label: 'Home Acquisitions' },
  { value: 'care_placement', label: 'Care Placement' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'engineering', label: 'Engineering' },
];

export default function NewCardForm({
  boardId,
  columns,
  currentUser,
  onClose,
  onCreated,
}: NewCardFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cardType, setCardType] = useState<CardType>('problem_definition');
  const [department, setDepartment] = useState<Department>(currentUser.department);
  const [priority, setPriority] = useState(2);
  const [estimatedImpact, setEstimatedImpact] = useState<ImpactLevel>('medium');
  const [timeSavedHours, setTimeSavedHours] = useState(0);
  const [urgency, setUrgency] = useState<UrgencyLevel>('important');
  const [goal, setGoal] = useState('');
  const [skillsUsed, setSkillsUsed] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const client = supabase;

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    // Cards always start in the "Submitted" column
    const submittedColumn = columns.find(c => c.status === 'submitted');
    if (!submittedColumn) {
      setError('Board configuration error — no Submitted column found');
      setLoading(false);
      return;
    }

    const cardCount = await getColumnCardCount(submittedColumn.id);

    const { data, error: insertError } = await client
      .from('cards')
      .insert({
        board_id: boardId,
        column_id: submittedColumn.id,
        title: title.trim(),
        description: description.trim() || null,
        card_type: cardType,
        status: 'submitted',
        department,
        created_by: currentUser.id,
        position: cardCount,
        priority,
        estimated_impact: estimatedImpact,
        time_saved_hours: timeSavedHours,
        urgency,
        goal: goal.trim() || null,
        skills_used: skillsUsed.trim() ? skillsUsed.split(',').map(s => s.trim()) : null,
        deliverable_url: deliverableUrl.trim() || null,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    if (data) {
      // Log activity
      await client.from('activity_log').insert({
        actor_id: currentUser.id,
        action: 'card_created',
        card_id: data.id,
        details: { title: data.title, card_type: data.card_type },
      });

      onCreated(data);
    }

    setLoading(false);
  }

  async function getColumnCardCount(columnId: string): Promise<number> {
    const { count } = await client
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .eq('column_id', columnId);
    return count || 0;
  }

  return (
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div class="absolute inset-0 bg-black/50" />
      <div
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div class="sticky top-0 bg-white border-b border-[#ede9d5] px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 class="text-lg font-bold text-[#1a1a1a]">New Card</h2>
          <button
            onClick={onClose}
            class="text-[#6b7280] hover:text-[#1a1a1a] transition-colors text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} class="px-6 py-4 space-y-4">
          {error && (
            <div class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>
          )}

          {/* Title */}
          <div>
            <label class="text-xs font-bold text-[#6b7280] uppercase">Title *</label>
            <input
              type="text"
              value={title}
              onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
              class="mt-1 w-full text-sm border border-[#ede9d5] rounded-lg px-3 py-2 focus:outline-none focus:border-[#38b5ad]"
              placeholder="What was completed?"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label class="text-xs font-bold text-[#6b7280] uppercase">Description</label>
            <textarea
              value={description}
              onInput={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
              class="mt-1 w-full text-sm border border-[#ede9d5] rounded-lg px-3 py-2 focus:outline-none focus:border-[#38b5ad] min-h-[80px]"
              placeholder="Describe the work completed..."
            />
          </div>

          {/* Card Type + Department */}
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-bold text-[#6b7280] uppercase">Type</label>
              <select
                value={cardType}
                onChange={(e) => setCardType((e.target as HTMLSelectElement).value as CardType)}
                class="mt-1 w-full text-sm border border-[#ede9d5] rounded-lg px-3 py-2 bg-white"
              >
                {CARD_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-[#6b7280] uppercase">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment((e.target as HTMLSelectElement).value as Department)}
                class="mt-1 w-full text-sm border border-[#ede9d5] rounded-lg px-3 py-2 bg-white"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Impact scoring */}
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-bold text-[#6b7280] uppercase">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(Number((e.target as HTMLSelectElement).value))}
                class="mt-1 w-full text-sm border border-[#ede9d5] rounded-lg px-3 py-2 bg-white"
              >
                <option value={1}>P1 — Urgent</option>
                <option value={2}>P2 — Important</option>
                <option value={3}>P3 — Nice to Have</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-[#6b7280] uppercase">Impact</label>
              <select
                value={estimatedImpact}
                onChange={(e) => setEstimatedImpact((e.target as HTMLSelectElement).value as ImpactLevel)}
                class="mt-1 w-full text-sm border border-[#ede9d5] rounded-lg px-3 py-2 bg-white"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-[#6b7280] uppercase">Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency((e.target as HTMLSelectElement).value as UrgencyLevel)}
                class="mt-1 w-full text-sm border border-[#ede9d5] rounded-lg px-3 py-2 bg-white"
              >
                <option value="blocking">Blocking Work</option>
                <option value="important">Important</option>
                <option value="nice_to_have">Nice to Have</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-bold text-[#6b7280] uppercase">Time Saved (hrs/week)</label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={timeSavedHours}
                onInput={(e) => setTimeSavedHours(Number((e.target as HTMLInputElement).value))}
                class="mt-1 w-full text-sm border border-[#ede9d5] rounded-lg px-3 py-2 focus:outline-none focus:border-[#38b5ad]"
              />
            </div>
          </div>

          {/* Optional fields */}
          <div>
            <label class="text-xs font-bold text-[#6b7280] uppercase">Goal</label>
            <input
              type="text"
              value={goal}
              onInput={(e) => setGoal((e.target as HTMLInputElement).value)}
              class="mt-1 w-full text-sm border border-[#ede9d5] rounded-lg px-3 py-2 focus:outline-none focus:border-[#38b5ad]"
              placeholder="e.g., Define a Problem, Build an Automation"
            />
          </div>

          <div>
            <label class="text-xs font-bold text-[#6b7280] uppercase">Skills Used (comma-separated)</label>
            <input
              type="text"
              value={skillsUsed}
              onInput={(e) => setSkillsUsed((e.target as HTMLInputElement).value)}
              class="mt-1 w-full text-sm border border-[#ede9d5] rounded-lg px-3 py-2 focus:outline-none focus:border-[#38b5ad]"
              placeholder="e.g., 2.01 Problem Definer, 1.05 Company Profile"
            />
          </div>

          <div>
            <label class="text-xs font-bold text-[#6b7280] uppercase">Deliverable URL</label>
            <input
              type="url"
              value={deliverableUrl}
              onInput={(e) => setDeliverableUrl((e.target as HTMLInputElement).value)}
              class="mt-1 w-full text-sm border border-[#ede9d5] rounded-lg px-3 py-2 focus:outline-none focus:border-[#38b5ad]"
              placeholder="https://github.com/TrueLegacyHomes/deliverables/..."
            />
          </div>

          {/* Submit */}
          <div class="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              class="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-[#38b5ad] rounded-lg hover:bg-[#2a908a] transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Card'}
            </button>
            <button
              type="button"
              onClick={onClose}
              class="px-4 py-2.5 text-sm font-medium text-[#6b7280] border border-[#ede9d5] rounded-lg hover:bg-[#f7f5e7] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
