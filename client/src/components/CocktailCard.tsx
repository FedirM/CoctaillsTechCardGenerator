import { useState, useEffect, useRef, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import type { Cocktail } from "@/types/cocktail";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";
import { RichTextEditor } from "./RichTextEditor";

const GLASS_OPTIONS = ["Highball", "Rocks", "Coupe", "Nick&Nora", "Bordo"] as const;
const ICE_OPTIONS = ["Crushed Ice", "Ice Cubes", "Large Cube"] as const;
const DEBOUNCE_MS = 500;

interface CocktailCardProps {
  cocktail: Cocktail;
  editing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate: (data: Partial<Omit<Cocktail, "id">>) => void;
}

export function CocktailCard({
  cocktail,
  editing,
  onEdit,
  onDelete,
  onUpdate,
}: CocktailCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cocktail.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [localData, setLocalData] = useState({
    name: cocktail.name,
    image: cocktail.image,
    glass: cocktail.glass,
    method: cocktail.method,
    ice: cocktail.ice,
    description: cocktail.description,
  });

  useEffect(() => {
    setLocalData({
      name: cocktail.name,
      image: cocktail.image,
      glass: cocktail.glass,
      method: cocktail.method,
      ice: cocktail.ice,
      description: cocktail.description,
    });
  }, [cocktail.name, cocktail.image, cocktail.glass, cocktail.method, cocktail.ice, cocktail.description]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedUpdate = useCallback(
    (field: string, value: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onUpdate({ [field]: value });
      }, DEBOUNCE_MS);
    },
    [onUpdate]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleFieldChange(field: keyof typeof localData, value: string) {
    setLocalData((prev) => ({ ...prev, [field]: value }));
    debouncedUpdate(field, value);
  }

  function handleImageChange(base64: string) {
    setLocalData((prev) => ({ ...prev, image: base64 }));
    onUpdate({ image: base64 });
  }

  function handleGlassChange(value: string) {
    setLocalData((prev) => ({ ...prev, glass: value }));
    onUpdate({ glass: value });
  }

  function handleIceChange(value: string) {
    const ice = value === "none" ? "" : value;
    setLocalData((prev) => ({ ...prev, ice }));
    onUpdate({ ice });
  }

  if (editing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex gap-4 rounded-xl border bg-white p-4 shadow-sm"
      >
        <div
          className="flex cursor-grab items-start pt-2 text-gray-400 hover:text-gray-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </div>

        <ImageUpload value={localData.image} onChange={handleImageChange} />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Cocktail name"
              value={localData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="flex-1 text-lg font-semibold"
            />
          </div>

          <div className="flex gap-3">
            <Select value={localData.glass} onValueChange={handleGlassChange}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Select glass" />
              </SelectTrigger>
              <SelectContent>
                {GLASS_OPTIONS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Method (e.g. Stir, Shake, Build)"
              value={localData.method}
              onChange={(e) => handleFieldChange("method", e.target.value)}
              className="flex-1"
            />

            <Select value={localData.ice || "none"} onValueChange={handleIceChange}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Ice (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No ice</SelectItem>
                {ICE_OPTIONS.map((ice) => (
                  <SelectItem key={ice} value={ice}>
                    {ice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <RichTextEditor
            content={localData.description}
            onChange={(html) => handleFieldChange("description", html)}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex gap-4 rounded-xl border bg-white p-4 shadow-sm"
    >
      <div
        className="flex cursor-grab items-start pt-2 text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </div>

      {cocktail.image ? (
        <img
          src={cocktail.image}
          alt={cocktail.name}
          className="h-40 w-40 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400 text-xs">
          No image
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">
            {cocktail.name || "Untitled"}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {(cocktail.method || cocktail.glass || cocktail.ice) && (
          <p className="text-sm text-gray-500">
            {[cocktail.method, cocktail.glass, cocktail.ice]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}

        {cocktail.description && (
          <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
            {cocktail.description}
          </p>
        )}
      </div>
    </div>
  );
}
