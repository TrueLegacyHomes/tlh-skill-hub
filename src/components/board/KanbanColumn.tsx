import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Card, Column, Profile } from '../../lib/types';
import KanbanCard from './KanbanCard';

/** Column header colors — TLH brand palette: teal → navy → purple → warm gray */
const COLUMN_COLORS: Record<string, string> = {
  submitted: '#38b5ad',           // teal (brand primary)
  under_review: '#0f4676',        // navy (brand secondary)
  changes_requested: '#c07a3e',   // warm copper (complements cream background)
  approved: '#2a908a',            // deep teal (positive, on-brand)
  engineering_queued: '#3d5a80',  // slate blue (bridge to engineering)
  in_progress: '#a47eaf',         // purple (brand secondary)
  done: '#7a7568',                // warm gray (muted, complete)
  archived: '#a39e93',            // light warm gray
};

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
  profiles: Record<string, Profile>;
  onCardClick: (card: Card) => void;
}

export default function KanbanColumn({ column, cards, profiles, onCardClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', column },
  });

  const headerColor = column.color || COLUMN_COLORS[column.status] || '#38b5ad';
  const isAtWipLimit = column.wip_limit !== null && cards.length >= column.wip_limit;
  const cardIds = cards.map(c => c.id);

  return (
    <div
      class="flex flex-col min-w-[260px] max-w-[300px] bg-[#f7f5e7] rounded-xl"
      style={{ flex: '1 0 260px' }}
    >
      {/* Column header */}
      <div
        class="px-3 py-2.5 rounded-t-xl flex items-center justify-between"
        style={{ backgroundColor: headerColor }}
      >
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-bold text-white">{column.name}</h3>
          <span class="text-xs font-medium text-white/80 bg-white/20 rounded-full px-1.5 py-0.5">
            {cards.length}
          </span>
        </div>
        {column.wip_limit !== null && (
          <span
            class={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
              isAtWipLimit ? 'bg-red-500/30 text-white' : 'bg-white/20 text-white/80'
            }`}
          >
            WIP: {cards.length}/{column.wip_limit}
          </span>
        )}
      </div>

      {/* Cards area */}
      <div
        ref={setNodeRef}
        class={`flex-1 p-2 space-y-2 min-h-[120px] transition-colors rounded-b-xl ${
          isOver ? 'bg-[#e6f7f6]' : ''
        }`}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.length === 0 ? (
            <div class="flex items-center justify-center h-20 border-2 border-dashed border-[#ede9d5] rounded-lg">
              <p class="text-xs text-[#6b7280]">Drop cards here</p>
            </div>
          ) : (
            cards.map(card => (
              <KanbanCard
                key={card.id}
                card={card}
                profiles={profiles}
                onClick={onCardClick}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
