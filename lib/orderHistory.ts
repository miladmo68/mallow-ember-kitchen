import { menu } from "../data/menu";
import type { CartLine, Order, Reservation } from "./domain";
import { cartTotals, normaliseCart } from "./menu";
import { tables } from "./reservations";

export function parseSavedOrders(value: unknown): Order[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((candidate): Order[] => {
    if (!candidate || typeof candidate !== "object") return [];
    const raw = candidate as Record<string, unknown>;
    if (typeof raw.id !== "string" || typeof raw.name !== "string" || typeof raw.email !== "string" ||
        typeof raw.pickupTime !== "string" || typeof raw.createdAt !== "string" || !Array.isArray(raw.lines)) return [];
    const lines = normaliseCart(raw.lines as CartLine[], menu);
    if (!lines.length || Number.isNaN(Date.parse(raw.pickupTime)) || Number.isNaN(Date.parse(raw.createdAt))) return [];
    const totals = cartTotals(lines, menu);
    return [{ id:raw.id, type:"Pickup", lines, subtotalCents:totals.subtotalCents, taxCents:totals.taxCents,
      totalCents:totals.totalCents, name:raw.name, email:raw.email, pickupTime:raw.pickupTime, createdAt:raw.createdAt }];
  }).slice(0,20);
}

export function parseSavedReservations(value: unknown): Reservation[] {
  if (!Array.isArray(value)) return [];
  return value.filter((candidate): candidate is Reservation => {
    if (!candidate || typeof candidate !== "object") return false;
    const raw = candidate as Record<string, unknown>;
    return typeof raw.id === "string" && typeof raw.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.date) &&
      typeof raw.time === "string" && /^\d{2}:\d{2}$/.test(raw.time) && Number.isInteger(raw.partySize) &&
      Number(raw.partySize) >= 1 && Number(raw.partySize) <= 6 && tables.some((table) => table.id === raw.tableId) &&
      typeof raw.guestName === "string" && typeof raw.email === "string" && typeof raw.notes === "string" &&
      typeof raw.createdAt === "string";
  }).slice(0,30);
}

export function repeatOrderLines(order: Order): CartLine[] {
  return normaliseCart(order.lines,menu);
}
