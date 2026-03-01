import { useState, useEffect, useCallback } from 'preact/hooks';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { supabase } from '../../lib/supabase';
import type { Card, Column, Profile, CardStatus } from '../../lib/types';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import CardDetailModal from './CardDetailModal';
import NewCardForm from './NewCardForm';

interface KanbanBoardProps {
  initialColumns: Column[];
  initialCards: Card[];
  profiles: Record<string, Profile>;
  currentUser: Profile;
  boardId: string;
}

export default function KanbanBoard({
  initialColumns,
  initialCards,
  profiles,
  currentUser,
  boardId,
}: KanbanBoardProps) {
  const [columns] = useState<Column[]>(initialColumns);
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Shared authenticated browser client for realtime + mutations
  const client = supabase;

  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ── Realtime subscription ──────────────────────────────
  useEffect(() => {
    const channel = client
      .channel('cards-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cards', filter: `board_id=eq.${boardId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCards(prev => [...prev, payload.new as Card]);
          } else if (payload.eventType === 'UPDATE') {
            setCards(prev =>
              prev.map(c => (c.id === (payload.new as Card).id ? (payload.new as Card) : c))
            );
            // Update the selected card if it's the one that changed
            setSelectedCard(prev =>
              prev && prev.id === (payload.new as Card).id ? (payload.new as Card) : prev
            );
          } else if (payload.eventType === 'DELETE') {
            setCards(prev => prev.filter(c => c.id !== (payload.old as Card).id));
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [client, boardId]);

  // ── Filter cards ───────────────────────────────────────
  const filteredCards = cards.filter(card => {
    if (filterDepartment !== 'all' && card.department !== filterDepartment) return false;
    if (filterType !== 'all' && card.card_type !== filterType) return false;
    return true;
  });

  // Group cards by column
  const cardsByColumn = columns.reduce<Record<string, Card[]>>((acc, col) => {
    acc[col.id] = filteredCards
      .filter(c => c.column_id === col.id)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    return acc;
  }, {});

  // ── Drag handlers ─────────────────────────────────────
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const card = cards.find(c => c.id === active.id);
    if (card) setActiveCard(card);
  }, [cards]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeCardData = cards.find(c => c.id === activeId);
    if (!activeCardData) return;

    // Determine target column — either dropping on a card (use its column) or on a column directly
    let targetColumnId: string;
    const overCard = cards.find(c => c.id === overId);
    if (overCard) {
      targetColumnId = overCard.column_id;
    } else {
      // Dropping on a column directly
      targetColumnId = overId;
    }

    if (activeCardData.column_id !== targetColumnId) {
      setCards(prev =>
        prev.map(c =>
          c.id === activeId ? { ...c, column_id: targetColumnId } : c
        )
      );
    }
  }, [cards]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id as string;
    const card = cards.find(c => c.id === activeId);
    if (!card) return;

    // Figure out the target column
    let targetColumnId: string;
    const overCard = cards.find(c => c.id === (over.id as string));
    if (overCard) {
      targetColumnId = overCard.column_id;
    } else {
      targetColumnId = over.id as string;
    }

    const targetColumn = columns.find(c => c.id === targetColumnId);
    if (!targetColumn) return;

    // Check permission: admin can move anything; others can only move their own cards or assigned cards
    const isAdmin = currentUser.role === 'admin';
    const isOwner = card.created_by === currentUser.id;
    const isAssigned = card.assigned_to === currentUser.id;
    const isEngineer = currentUser.role === 'engineering';

    // Engineering can pick up from engineering_queued
    const canMove = isAdmin || isOwner || isAssigned ||
      (isEngineer && card.status === 'engineering_queued');

    if (!canMove) {
      // Revert: put card back to original column
      setCards(prev =>
        prev.map(c => c.id === activeId ? { ...c, column_id: card.column_id } : c)
      );
      return;
    }

    // Calculate new position
    const cardsInTargetColumn = cards
      .filter(c => c.column_id === targetColumnId && c.id !== activeId)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    const newPosition = cardsInTargetColumn.length;

    // Persist to Supabase
    const updates: Record<string, unknown> = {
      column_id: targetColumnId,
      status: targetColumn.status as CardStatus,
      position: newPosition,
    };

    // Set completed_at when moved to done
    if (targetColumn.status === 'done') {
      updates.completed_at = new Date().toISOString();
    }

    // Auto-assign engineer when they pick up a card
    if (targetColumn.status === 'in_progress' && isEngineer && !card.assigned_to) {
      updates.assigned_to = currentUser.id;
    }

    const { error } = await client
      .from('cards')
      .update(updates)
      .eq('id', activeId);

    if (error) {
      console.error('Failed to move card:', error.message);
      // Revert on error
      setCards(initialCards);
    } else {
      // Log activity for drag-and-drop moves
      const sourceColumn = columns.find(c => c.id === card.column_id);
      await client.from('activity_log').insert({
        actor_id: currentUser.id,
        action: 'card_moved',
        card_id: activeId,
        details: {
          title: card.title,
          from_status: sourceColumn?.status || card.status,
          to_status: targetColumn.status,
        },
      });

      // Notify card creator if someone else moved their card
      if (card.created_by !== currentUser.id) {
        await client.from('notifications').insert({
          recipient_id: card.created_by,
          card_id: activeId,
          type: 'card_moved',
          title: `Card moved: ${card.title}`,
          body: `${currentUser.full_name} moved your card to ${targetColumn.name}.`,
        });
      }
    }
  }, [cards, columns, currentUser, client, initialCards]);

  // ── Card created callback ──────────────────────────────
  const handleCardCreated = (newCard: Card) => {
    setCards(prev => [...prev, newCard]);
    setShowNewCardForm(false);
  };

  // ── Department options ─────────────────────────────────
  const departments = ['all', 'executive', 'operations', 'interior_design', 'estate_sales', 'home_acquisitions', 'care_placement', 'marketing', 'engineering'];
  const cardTypes = ['all', 'problem_definition', 'sop', 'new_product_plan', 'system_change_request', 'report_dashboard', 'automation_plan', 'template', 'skill_improvement', 'engineering_build'];

  const formatLabel = (s: string) => s === 'all' ? 'All' : s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div class="flex flex-col h-full">
      {/* Toolbar */}
      <div class="flex items-center gap-3 mb-4 flex-wrap">
        <button
          onClick={() => setShowNewCardForm(true)}
          class="px-4 py-2 text-sm font-bold text-white bg-[#38b5ad] rounded-lg hover:bg-[#2a908a] transition-colors"
        >
          + New Card
        </button>

        <div class="flex items-center gap-2 ml-auto">
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment((e.target as HTMLSelectElement).value)}
            class="text-xs border border-[#ede9d5] rounded-lg px-2 py-1.5 bg-white text-[#1a1a1a]"
          >
            {departments.map(d => (
              <option key={d} value={d}>{formatLabel(d)}</option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType((e.target as HTMLSelectElement).value)}
            class="text-xs border border-[#ede9d5] rounded-lg px-2 py-1.5 bg-white text-[#1a1a1a]"
          >
            {cardTypes.map(t => (
              <option key={t} value={t}>{formatLabel(t)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div class="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: '400px' }}>
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={cardsByColumn[column.id] || []}
              profiles={profiles}
              onCardClick={setSelectedCard}
            />
          ))}
        </div>

        {/* Drag overlay — follows cursor */}
        <DragOverlay>
          {activeCard ? (
            <KanbanCard
              card={activeCard}
              profiles={profiles}
              onClick={() => {}}
              isDragOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          profiles={profiles}
          currentUser={currentUser}
          columns={columns}
          onClose={() => setSelectedCard(null)}
          onCardUpdated={(updatedCard) => {
            setCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
            setSelectedCard(updatedCard);
          }}
        />
      )}

      {/* New Card Form */}
      {showNewCardForm && (
        <NewCardForm
          boardId={boardId}
          columns={columns}
          currentUser={currentUser}
          onClose={() => setShowNewCardForm(false)}
          onCreated={handleCardCreated}
        />
      )}
    </div>
  );
}
