import { menu } from "../data/menu";
import type { CartLine, CartTotals, DietaryTag, MenuCategory, MenuItem } from "./domain";

export type MenuQuery = { category?: MenuCategory | "All"; dietary?: DietaryTag | "All"; search?: string };

export function filterMenu(items: MenuItem[], query: MenuQuery): MenuItem[] {
  const search = query.search?.trim().toLocaleLowerCase() ?? "";
  return items.filter((item) =>
    item.available &&
    (!query.category || query.category === "All" || item.category === query.category) &&
    (!query.dietary || query.dietary === "All" || item.tags.includes(query.dietary)) &&
    (!search || [item.name, item.description, item.category, ...item.tags].join(" ").toLocaleLowerCase().includes(search))
  );
}

export function normaliseCart(lines: CartLine[], items: MenuItem[] = menu): CartLine[] {
  const byId = new Map(items.filter((item) => item.available).map((item) => [item.id, item]));
  const quantities = new Map<string, number>();
  for (const line of lines) {
    if (!line || typeof line !== "object" || typeof line.itemId !== "string" || !byId.has(line.itemId) || !Number.isSafeInteger(line.quantity) || line.quantity < 1) continue;
    quantities.set(line.itemId, Math.min(20, (quantities.get(line.itemId) ?? 0) + line.quantity));
  }
  return [...quantities.entries()].map(([itemId, quantity]) => ({ itemId, quantity }));
}

export function setQuantity(lines: CartLine[], itemId: string, quantity: number, items: MenuItem[] = menu): CartLine[] {
  if (!items.some((item) => item.id === itemId && item.available)) return normaliseCart(lines, items);
  const next = normaliseCart(lines, items).filter((line) => line.itemId !== itemId);
  if (Number.isSafeInteger(quantity) && quantity > 0) next.push({ itemId, quantity: Math.min(20, quantity) });
  return normaliseCart(next, items);
}

export function cartTotals(lines: CartLine[], items: MenuItem[] = menu): CartTotals {
  const itemMap = new Map(items.map((item) => [item.id, item]));
  const valid = normaliseCart(lines, items);
  const subtotalCents = valid.reduce((sum, line) => sum + (itemMap.get(line.itemId)?.priceCents ?? 0) * line.quantity, 0);
  const taxCents = Math.round(subtotalCents * 0.13);
  return { subtotalCents, taxCents, totalCents: subtotalCents + taxCents, itemCount: valid.reduce((sum, line) => sum + line.quantity, 0) };
}

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2 }).format(cents / 100);
}
