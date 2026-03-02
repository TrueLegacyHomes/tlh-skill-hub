import { useState, useCallback } from 'preact/hooks';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { supabase } from '../../lib/supabase';
import type { GoalWithSkills, GoalSkill, Profile } from '../../lib/types';

interface SkillInfo {
  skillId: string;
  contentSlug: string;
  name: string;
  series: string;
  oneLiner: string;
}

interface WorkflowsManagerProps {
  initialGoals: GoalWithSkills[];
  allSkills: SkillInfo[];
  currentUser: Profile | null;
  baseUrl: string;
}

// ── Sortable skill row (admin editing) ──

function SortableSkillRow({
  goalSkill,
  skillInfo,
  onRemove,
}: {
  goalSkill: GoalSkill;
  skillInfo: SkillInfo | undefined;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: goalSkill.skill_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      class="flex items-center gap-3 bg-[#f7f5e7] rounded-lg px-3 py-2 border border-[#ede9d5]"
    >
      <button
        {...attributes}
        {...listeners}
        class="cursor-grab text-[#6b7280] hover:text-[#1a1a1a] flex-shrink-0"
        title="Drag to reorder"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="5" cy="3" r="1.5" /><circle cx="11" cy="3" r="1.5" />
          <circle cx="5" cy="8" r="1.5" /><circle cx="11" cy="8" r="1.5" />
          <circle cx="5" cy="13" r="1.5" /><circle cx="11" cy="13" r="1.5" />
        </svg>
      </button>
      <span class="text-xs font-mono text-[#2a908a] bg-[#e6f7f6] px-2 py-0.5 rounded flex-shrink-0">
        {goalSkill.skill_id}
      </span>
      <span class="text-sm font-medium text-[#1a1a1a] flex-1">
        {skillInfo?.name || goalSkill.skill_id}
      </span>
      <button
        onClick={onRemove}
        class="text-red-400 hover:text-red-600 flex-shrink-0 text-lg leading-none"
        title="Remove skill from goal"
      >
        &times;
      </button>
    </div>
  );
}

// ── Workflow goal card ──

function WorkflowGoalCard({
  goal,
  goalIndex,
  allSkills,
  skillMap,
  isAdmin,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onDelete,
  baseUrl,
}: {
  goal: GoalWithSkills;
  goalIndex: number;
  allSkills: SkillInfo[];
  skillMap: Map<string, SkillInfo>;
  isAdmin: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (updated: GoalWithSkills) => void;
  onDelete: () => void;
  baseUrl: string;
}) {
  const [saving, setSaving] = useState(false);
  const [addingSkillId, setAddingSkillId] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const usedSkillIds = new Set(goal.skills.map(s => s.skill_id));
  const availableSkills = allSkills.filter(s => !usedSkillIds.has(s.skillId));

  const displayName = goal.parent_name
    ? `${goal.parent_name} > ${goal.name}`
    : goal.name;

  // ── Drag end → reorder skills ──
  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = goal.skills.findIndex(s => s.skill_id === active.id);
    const newIndex = goal.skills.findIndex(s => s.skill_id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newSkills = arrayMove(goal.skills, oldIndex, newIndex);
    onUpdate({ ...goal, skills: newSkills });

    setSaving(true);
    const orderedIds = newSkills.map(s => s.skill_id);
    await supabase.rpc('batch_reorder_goal_skills', {
      p_goal_id: goal.id,
      p_skill_ids: orderedIds,
    }).then(() => ({ error: null })).catch(async () => {
      const updates = orderedIds.map((skillId, idx) =>
        supabase
          .from('goal_skills')
          .update({ display_order: idx })
          .eq('goal_id', goal.id)
          .eq('skill_id', skillId)
      );
      const results = await Promise.all(updates);
      const err = results.find(r => r.error);
      if (err?.error) {
        alert('Failed to reorder skills: ' + err.error.message);
        onUpdate({ ...goal, skills: arrayMove(newSkills, newIndex, oldIndex) });
      }
    });
    setSaving(false);
  }, [goal, onUpdate]);

  // ── Add skill ──
  const handleAddSkill = useCallback(async () => {
    if (!addingSkillId) return;

    const newDisplayOrder = goal.skills.length;
    const newGoalSkill: GoalSkill = {
      id: crypto.randomUUID(),
      goal_id: goal.id,
      skill_id: addingSkillId,
      display_order: newDisplayOrder,
      created_at: new Date().toISOString(),
    };

    onUpdate({ ...goal, skills: [...goal.skills, newGoalSkill] });
    setAddingSkillId('');

    const { error } = await supabase
      .from('goal_skills')
      .insert({
        goal_id: goal.id,
        skill_id: addingSkillId,
        display_order: newDisplayOrder,
      });

    if (error) {
      alert('Failed to add skill: ' + error.message);
      onUpdate({ ...goal, skills: goal.skills.filter(s => s.skill_id !== addingSkillId) });
    }
  }, [addingSkillId, goal, onUpdate]);

  // ── Remove skill ──
  const handleRemoveSkill = useCallback(async (skillId: string) => {
    const prev = goal.skills;
    onUpdate({ ...goal, skills: goal.skills.filter(s => s.skill_id !== skillId) });

    const { error } = await supabase
      .from('goal_skills')
      .delete()
      .eq('goal_id', goal.id)
      .eq('skill_id', skillId);

    if (error) {
      alert('Failed to remove skill: ' + error.message);
      onUpdate({ ...goal, skills: prev });
    }
  }, [goal, onUpdate]);

  return (
    <div class="bg-white rounded-xl border border-[#ede9d5] overflow-hidden">
      <div class="p-6">
        <div class="flex items-start gap-4">
          <span class="flex-shrink-0 w-10 h-10 rounded-full bg-[#38b5ad] text-white flex items-center justify-center font-bold text-lg">
            {goalIndex + 1}
          </span>
          <div class="flex-1">
            <h2 class="text-xl font-bold text-[#1a1a1a] mb-1">{displayName}</h2>
            {goal.description && (
              <p class="text-sm text-[#6b7280] mb-5">{goal.description}</p>
            )}

            {/* Read-only skill steps */}
            {goal.skills.length > 0 && (
              <div class="space-y-3">
                {goal.skills.map((gs, si) => {
                  const meta = skillMap.get(gs.skill_id);
                  const contentSlug = meta?.contentSlug || gs.skill_id.replace('.', '-');
                  const name = meta?.name || gs.skill_id;
                  const oneLiner = meta?.oneLiner || '';

                  return (
                    <div class="flex items-start gap-3" key={gs.skill_id}>
                      <div class="flex flex-col items-center">
                        <span class="w-7 h-7 rounded-full bg-[#e6f7f6] text-[#2a908a] flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {si + 1}
                        </span>
                        {si < goal.skills.length - 1 && (
                          <div class="w-0.5 h-6 bg-[#ede9d5] mt-1"></div>
                        )}
                      </div>
                      <a
                        href={`${baseUrl}skills/${contentSlug}/`}
                        class="flex-1 bg-[#f7f5e7] rounded-lg px-4 py-3 hover:bg-[#e6f7f6] transition-colors no-underline group"
                      >
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-mono text-[#2a908a]">{gs.skill_id}</span>
                          <span class="text-sm font-bold text-[#1a1a1a] group-hover:text-[#2a908a]">{name}</span>
                        </div>
                        {oneLiner && (
                          <p class="text-xs text-[#6b7280] mt-0.5">{oneLiner}</p>
                        )}
                      </a>
                    </div>
                  );
                })}
              </div>
            )}

            {goal.skills.length === 0 && !isAdmin && (
              <p class="text-sm text-[#6b7280] italic">No skills assigned yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Admin: Manage Skills panel */}
      {isAdmin && (
        <div class="border-t border-[#ede9d5]">
          <button
            onClick={onToggleExpand}
            class="w-full px-6 py-3 flex items-center justify-between text-sm font-medium text-[#6b7280] hover:bg-[#f7f5e7]/50 transition-colors"
          >
            <span class="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="text-[#38b5ad]">
                <path d="M8 1a1 1 0 011 1v5h5a1 1 0 110 2H9v5a1 1 0 11-2 0V9H2a1 1 0 010-2h5V2a1 1 0 011-1z" />
              </svg>
              Manage Skills
              {saving && <span class="text-xs text-[#6b7280] ml-2">Saving...</span>}
            </span>
            <svg
              class={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isExpanded && (
            <div class="px-6 pb-5">
              {/* Sortable skill list */}
              {goal.skills.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={goal.skills.map(s => s.skill_id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div class="space-y-2 mb-4">
                      {goal.skills.map((gs, idx) => (
                        <div class="flex items-center gap-2" key={gs.skill_id}>
                          <span class="text-xs font-bold text-[#6b7280] w-5 text-right flex-shrink-0">
                            {idx + 1}
                          </span>
                          <div class="flex-1">
                            <SortableSkillRow
                              goalSkill={gs}
                              skillInfo={skillMap.get(gs.skill_id)}
                              onRemove={() => handleRemoveSkill(gs.skill_id)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <p class="text-sm text-[#6b7280] italic mb-4">No skills assigned yet. Add one below.</p>
              )}

              {/* Add skill dropdown */}
              <div class="flex items-center gap-2 pt-2 border-t border-[#ede9d5]">
                <select
                  value={addingSkillId}
                  onChange={(e) => setAddingSkillId((e.target as HTMLSelectElement).value)}
                  class="flex-1 text-sm border border-[#ede9d5] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#38b5ad]"
                >
                  <option value="">Add a skill...</option>
                  {availableSkills.map(s => (
                    <option value={s.skillId} key={s.skillId}>
                      {s.skillId} — {s.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddSkill}
                  disabled={!addingSkillId}
                  class="px-4 py-2 text-sm font-bold text-white bg-[#38b5ad] rounded-lg hover:bg-[#2a908a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>

              {/* Delete goal */}
              <div class="flex items-center gap-2 mt-3 pt-3 border-t border-[#ede9d5]">
                <button
                  onClick={onDelete}
                  class="text-xs px-3 py-1 rounded font-medium text-red-600 hover:bg-red-50 transition-colors border border-red-200"
                >
                  Delete Goal
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main component ──

export default function WorkflowsManager({
  initialGoals,
  allSkills,
  currentUser,
  baseUrl,
}: WorkflowsManagerProps) {
  const [goals, setGoals] = useState<GoalWithSkills[]>(initialGoals);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);

  // New goal form state
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalSlug, setNewGoalSlug] = useState('');
  const [newGoalDesc, setNewGoalDesc] = useState('');
  const [newGoalParentId, setNewGoalParentId] = useState('');
  const [creating, setCreating] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  const skillMap = new Map<string, SkillInfo>(
    allSkills.map(s => [s.skillId, s])
  );

  const topLevelGoals = goals.filter(g => !g.parent_id);

  // Non-admins only see goals with skills
  const visibleGoals = isAdmin ? goals : goals.filter(g => g.skills.length > 0);

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleNameChange = (name: string) => {
    setNewGoalName(name);
    if (!newGoalSlug || newGoalSlug === generateSlug(newGoalName)) {
      setNewGoalSlug(generateSlug(name));
    }
  };

  // ── Create goal ──
  const handleCreateGoal = async (e: Event) => {
    e.preventDefault();
    if (!newGoalName.trim() || !newGoalSlug.trim()) return;

    if (goals.some(g => g.slug === newGoalSlug)) {
      alert('A goal with this slug already exists.');
      return;
    }

    setCreating(true);
    const newDisplayOrder = goals.length + 1;

    const { data, error } = await supabase
      .from('goals')
      .insert({
        name: newGoalName.trim(),
        slug: newGoalSlug.trim(),
        description: newGoalDesc.trim() || null,
        parent_id: newGoalParentId || null,
        display_order: newDisplayOrder,
      })
      .select()
      .single();

    if (error) {
      alert('Failed to create goal: ' + error.message);
    } else if (data) {
      const parentName = newGoalParentId
        ? goals.find(g => g.id === newGoalParentId)?.name
        : undefined;
      setGoals([...goals, { ...data, skills: [], parent_name: parentName }]);
      setNewGoalName('');
      setNewGoalSlug('');
      setNewGoalDesc('');
      setNewGoalParentId('');
      setShowNewGoalForm(false);
    }
    setCreating(false);
  };

  // ── Delete goal ──
  const handleDeleteGoal = async (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    if (!confirm(`Delete "${goal.name}" and all its skill associations? This cannot be undone.`)) return;

    const prev = goals;
    setGoals(goals.filter(g => g.id !== goalId));

    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      alert('Failed to delete goal: ' + error.message);
      setGoals(prev);
    }
  };

  // ── Update goal (skill changes from child) ──
  const handleGoalUpdate = useCallback((updated: GoalWithSkills) => {
    setGoals(prev => prev.map(g => g.id === updated.id ? updated : g));
  }, []);

  return (
    <div class="space-y-6">
      {/* Admin: New Goal button */}
      {isAdmin && (
        <div class="flex justify-end">
          <button
            onClick={() => setShowNewGoalForm(!showNewGoalForm)}
            class="px-4 py-2 text-sm font-bold text-white bg-[#38b5ad] rounded-lg hover:bg-[#2a908a] transition-colors"
          >
            {showNewGoalForm ? 'Cancel' : '+ New Goal'}
          </button>
        </div>
      )}

      {/* Admin: New goal form */}
      {isAdmin && showNewGoalForm && (
        <div class="bg-white rounded-xl border border-[#ede9d5] p-6">
          <h2 class="text-lg font-bold text-[#1a1a1a] mb-4">Add New Goal</h2>
          <form onSubmit={handleCreateGoal} class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-bold text-[#6b7280] uppercase">Goal Name *</label>
                <input
                  type="text"
                  value={newGoalName}
                  onInput={(e) => handleNameChange((e.target as HTMLInputElement).value)}
                  required
                  class="mt-1 w-full text-sm border border-[#ede9d5] rounded-lg px-3 py-2 focus:outline-none focus:border-[#38b5ad]"
                  placeholder="e.g., Build a website"
                />
              </div>
              <div>
                <label class="text-xs font-bold text-[#6b7280] uppercase">Slug *</label>
                <input
                  type="text"
                  value={newGoalSlug}
                  onInput={(e) => setNewGoalSlug((e.target as HTMLInputElement).value)}
                  required
                  class="mt-1 w-full text-sm border border-[#ede9d5] rounded-lg px-3 py-2 focus:outline-none focus:border-[#38b5ad] font-mono"
                  placeholder="build-a-website"
                />
              </div>
            </div>
            <div>
              <label class="text-xs font-bold text-[#6b7280] uppercase">Description</label>
              <input
                type="text"
                value={newGoalDesc}
                onInput={(e) => setNewGoalDesc((e.target as HTMLInputElement).value)}
                class="mt-1 w-full text-sm border border-[#ede9d5] rounded-lg px-3 py-2 focus:outline-none focus:border-[#38b5ad]"
                placeholder="Brief description shown to users"
              />
            </div>
            <div>
              <label class="text-xs font-bold text-[#6b7280] uppercase">Parent Goal (optional — for sub-goals)</label>
              <select
                value={newGoalParentId}
                onChange={(e) => setNewGoalParentId((e.target as HTMLSelectElement).value)}
                class="mt-1 w-full text-sm border border-[#ede9d5] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#38b5ad]"
              >
                <option value="">None (top-level goal)</option>
                {topLevelGoals.map(g => (
                  <option value={g.id} key={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={creating || !newGoalName.trim() || !newGoalSlug.trim()}
              class="px-4 py-2 text-sm font-bold text-white bg-[#38b5ad] rounded-lg hover:bg-[#2a908a] transition-colors disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Goal'}
            </button>
          </form>
        </div>
      )}

      {/* Goal cards */}
      {visibleGoals.length > 0 ? (
        visibleGoals.map((goal, idx) => (
          <WorkflowGoalCard
            key={goal.id}
            goal={goal}
            goalIndex={idx}
            allSkills={allSkills}
            skillMap={skillMap}
            isAdmin={isAdmin}
            isExpanded={expandedGoalId === goal.id}
            onToggleExpand={() => setExpandedGoalId(expandedGoalId === goal.id ? null : goal.id)}
            onUpdate={handleGoalUpdate}
            onDelete={() => handleDeleteGoal(goal.id)}
            baseUrl={baseUrl}
          />
        ))
      ) : (
        <div class="bg-white rounded-xl border border-[#ede9d5] p-12 text-center">
          <h3 class="text-lg font-bold text-[#1a1a1a] mb-2">No Workflows Available</h3>
          <p class="text-sm text-[#6b7280] max-w-md mx-auto">
            {isAdmin
              ? 'No goals configured yet. Create your first goal above, or run the database migration to seed defaults.'
              : 'Workflows are generated from goals configured by admins.'}
          </p>
        </div>
      )}
    </div>
  );
}
