import { useState, useEffect, useCallback } from "react";
import type { Cocktail } from "@/types/cocktail";
import * as api from "@/api/cocktails";

export function useCocktails() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    api.fetchCocktails().then((data) => {
      setCocktails(data);
      setLoading(false);
    });
  }, []);

  const create = useCallback(async () => {
    const created = await api.createCocktail();
    setCocktails((prev) => [created, ...prev]);
    setEditingId(created.id);
    return created;
  }, []);

  const update = useCallback(
    async (id: number, data: Partial<Omit<Cocktail, "id">>) => {
      setCocktails((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...data } : c))
      );
      const updated = await api.updateCocktail(id, data);
      setCocktails((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );
    },
    []
  );

  const remove = useCallback(async (id: number) => {
    setCocktails((prev) => prev.filter((c) => c.id !== id));
    await api.deleteCocktail(id);
  }, []);

  const reorder = useCallback(async (ids: number[]) => {
    const updated = await api.reorderCocktails(ids);
    setCocktails(updated);

    setEditingId((prevEditingId) => {
      if (prevEditingId === null) return null;
      const position = ids.indexOf(prevEditingId);
      if (position === -1) return null;
      return ids.length - position;
    });
  }, []);

  return {
    cocktails,
    loading,
    editingId,
    setEditingId,
    create,
    update,
    remove,
    reorder,
  };
}
