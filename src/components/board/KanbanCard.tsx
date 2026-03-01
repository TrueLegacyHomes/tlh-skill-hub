import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card, Profile } from '../../lib/types';

/** Card type badge colors */
const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  problem_definition: { bg: '#e6f7f6', text: '#2a908a' },
  sop: { bg: '#ede9d5', text: '#6b7280' },
  new_product_plan: { bg: '#ede0f7', text: '#7c3aed' },
  system_change_request: { bg: '#fee2e2', text: '#dc2626' },
  report_dashboard: { bg: '#dbeafe', text: '#2563eb' },
  automation_plan: { bg: '#fef3c7', text: '#d97706' },
  template: { bg: '#d1fae5', text: '#059669' },
  skill_improvement: { bg: '#e6f7f6', text: '#0f4676' },
  engineering_build: { bg: '#fce7f3', text: '#db2777' },
  other: { bg: '#f3f4f6', text: '#6b7280' },
};

/** Display names for card types */
const TYPE_LABELS: Record<string, string> = {
  problem_definition: 'Problem',
  sop: 'SOP',
  new_product_plan: 'Product Plan',
  system_change_request: 'Change Request',
  report_dashboard: 'Report',
  automation_plan: 'Automation',
  template: 'Template',
  skill_improvement: 'Skill',
  engineering_build: 'Engineering',
  other: 'Other',
};

/** Priority labels */
const PRIORITY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'P1', color: '#dc2626' },
  2: { label: 'P2', color: '#d97706' },
  3: { label: 'P3', color: '#6b7280' },
};

interface KanbanCardProps {
  card: Card;
  profiles: Record<string, Profile>;
  onClick: (card: Card) => void;
  isDragOverlay?: boolean;
}

export default function KanbanCard({ card, profiles, onClick, isDragOverlay }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: 'card', card },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const typeColor = TYPE_COLORS[card.card_type] || TYPE_COLORS.other;
  const typeLabel = TYPE_LABELS[card.card_type] || 'Other';
  const priority = PRIORITY_LABELS[card.priority] || PRIORITY_LABELS[2];
  const creator = profiles[card.created_by];
  const assignee = card.assigned_to ? profiles[card.assigned_to] : null;

  const handleClick = (e: MouseEvent) => {
    // Don't open modal if the user is dragging
    if (!(e.target as HTMLElement).closest('[data-no-click]')) {
      onClick(card);
    }
  };

  const cardContent = (
    <div
      class="bg-white rounded-lg border border-[#ede9d5] p-3 cursor-pointer hover:shadow-md hover:border-[#38b5ad] transition-all group"
      style={!isDragOverlay ? style : undefined}
      onClick={handleClick}
    >
      {/* Top row: type badge + priority */}
      <div class="flex items-center justify-between mb-2">
        <span
          class="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
          style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
        >
          {typeLabel}
        </span>
        <span
          class="text-[10px] font-bold px-1.5 py-0.5 rounded"
          style={{ color: priority.color }}
        >
          {priority.label}
        </span>
      </div>

      {/* Title */}
      <h4 class="text-sm font-bold text-[#1a1a1a] mb-1 leading-tight line-clamp-2">
        {card.title}
      </h4>

      {/* Description preview */}
      {card.description && (
        <p class="text-xs text-[#6b7280] mb-2 leading-relaxed line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Department */}
      {card.department && (
        <div class="text-[10px] text-[#6b7280] mb-2">
          {card.department.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
        </div>
      )}

      {/* Bottom row: score + assignee */}
      <div class="flex items-center justify-between mt-1 pt-2 border-t border-[#ede9d5]">
        {/* Impact score */}
        <div class="flex items-center gap-1">
          <span class="text-[10px] text-[#6b7280]">Score</span>
          <span class="text-xs font-bold text-[#0f4676]">{card.composite_score}</span>
        </div>

        {/* Time saved */}
        {card.time_saved_hours > 0 && (
          <div class="text-[10px] text-[#2a908a]">
            ~{card.time_saved_hours}h/wk saved
          </div>
        )}

        {/* Assignee avatar or creator initials */}
        <div class="flex items-center gap-1">
          {assignee ? (
            <div
              class="w-5 h-5 rounded-full bg-[#38b5ad] text-white text-[10px] font-bold flex items-center justify-center"
              title={assignee.full_name}
            >
              {assignee.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </div>
          ) : creator ? (
            <div
              class="w-5 h-5 rounded-full bg-[#ede9d5] text-[#6b7280] text-[10px] font-bold flex items-center justify-center"
              title={creator.full_name}
            >
              {creator.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  if (isDragOverlay) {
    return <div class="rotate-2 shadow-xl">{cardContent}</div>;
  }

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      {cardContent}
    </div>
  );
}
