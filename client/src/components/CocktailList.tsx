import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Cocktail } from "@/types/cocktail";
import { CocktailCard } from "./CocktailCard";

interface CocktailListProps {
  cocktails: Cocktail[];
  editingId: number | null;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<Omit<Cocktail, "id">>) => void;
  onReorder: (ids: number[]) => void;
}

export function CocktailList({
  cocktails,
  editingId,
  onEdit,
  onDelete,
  onUpdate,
  onReorder,
}: CocktailListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = cocktails.findIndex((c) => c.id === active.id);
    const newIndex = cocktails.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...cocktails];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    onReorder(reordered.map((c) => c.id));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={cocktails.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-4">
          {cocktails.map((cocktail) => (
            <CocktailCard
              key={cocktail.id}
              cocktail={cocktail}
              editing={editingId === cocktail.id}
              onEdit={() => onEdit(cocktail.id)}
              onDelete={() => onDelete(cocktail.id)}
              onUpdate={(data) => onUpdate(cocktail.id, data)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
