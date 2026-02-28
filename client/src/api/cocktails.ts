import type { Cocktail } from "@/types/cocktail";

const BASE = "/cocktails";

export async function fetchCocktails(): Promise<Cocktail[]> {
  const res = await fetch(BASE);
  const json = await res.json();
  return json.data;
}

export async function createCocktail(
  data: Partial<Omit<Cocktail, "id">> = {}
): Promise<Cocktail> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

export async function updateCocktail(
  id: number,
  data: Partial<Omit<Cocktail, "id">>
): Promise<Cocktail> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

export async function deleteCocktail(id: number): Promise<void> {
  await fetch(`${BASE}/${id}`, { method: "DELETE" });
}

export async function reorderCocktails(ids: number[]): Promise<Cocktail[]> {
  const res = await fetch(`${BASE}/reorder`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  const json = await res.json();
  return json.data;
}
