import fs from "fs";
import path from "path";
import { Cocktail } from "../types/cocktail";

const DB_PATH = path.join(__dirname, "cocktails.json");

export function readCocktails(): Cocktail[] {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as Cocktail[];
}

export function writeCocktails(data: Cocktail[]): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function nextId(): number {
  const cocktails = readCocktails();
  if (cocktails.length === 0) return 1;
  return Math.max(...cocktails.map((c) => c.id)) + 1;
}
