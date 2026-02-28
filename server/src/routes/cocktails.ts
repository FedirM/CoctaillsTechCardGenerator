import { Router, Request, Response } from "express";
import { readCocktails, writeCocktails, nextId } from "../db/db";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  const cocktails = readCocktails();
  cocktails.sort((a, b) => b.id - a.id);
  res.json({ data: cocktails });
});

router.post("/", (req: Request, res: Response) => {
  const { name, image, glass, method, ice, description } = req.body;

  const cocktail = {
    id: nextId(),
    name: typeof name === "string" ? name.trim() : "",
    image: image ?? "",
    glass: glass ?? "",
    method: method ?? "",
    ice: ice ?? "",
    description: description ?? "",
  };

  const cocktails = readCocktails();
  cocktails.push(cocktail);
  writeCocktails(cocktails);

  res.status(201).json({ data: cocktail });
});

router.put("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const cocktails = readCocktails();
  const index = cocktails.findIndex((c) => c.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Cocktail not found" });
    return;
  }

  const { name, image, glass, method, ice, description } = req.body;

  if (name !== undefined) cocktails[index].name = name;
  if (image !== undefined) cocktails[index].image = image;
  if (glass !== undefined) cocktails[index].glass = glass;
  if (method !== undefined) cocktails[index].method = method;
  if (ice !== undefined) cocktails[index].ice = ice;
  if (description !== undefined) cocktails[index].description = description;

  writeCocktails(cocktails);

  res.json({ data: cocktails[index] });
});

router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const cocktails = readCocktails();
  const index = cocktails.findIndex((c) => c.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Cocktail not found" });
    return;
  }

  cocktails.splice(index, 1);
  writeCocktails(cocktails);

  res.json({ data: { id } });
});

router.patch("/reorder", (req: Request, res: Response) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.some((id: unknown) => typeof id !== "number")) {
    res.status(400).json({ error: "Body must contain { ids: number[] }" });
    return;
  }

  const cocktails = readCocktails();
  const byId = new Map(cocktails.map((c) => [c.id, c]));

  const reordered: typeof cocktails = [];
  for (let i = 0; i < ids.length; i++) {
    const cocktail = byId.get(ids[i]);
    if (!cocktail) {
      res.status(404).json({ error: `Cocktail with id ${ids[i]} not found` });
      return;
    }
    cocktail.id = ids.length - i;
    reordered.push(cocktail);
  }

  writeCocktails(reordered);
  reordered.sort((a, b) => b.id - a.id);
  res.json({ data: reordered });
});

export default router;
