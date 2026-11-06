import { menu } from "../data/menu";
import { cartTotals, normaliseCart } from "./menu";
import type { CartLine, Order } from "./domain";

export type CheckoutInput = { lines: CartLine[]; name: string; email: string; pickupTime: string };
export type CheckoutError = { field: "cart" | "name" | "email" | "pickupTime"; message: string };
export type CheckoutResult = { ok: true; order: Order } | { ok: false; errors: CheckoutError[] };

export function localDate(date: Date): string {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

export function pickupSlots(now: Date = new Date()): string[] {
  const slots: string[] = [];
  for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);
    if (day.getDay() === 1) continue;
    for (const hour of [12, 13, 18, 19, 20]) {
      for (const minute of [0, 30]) {
        const slot = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute);
        if (slot.getTime() > now.getTime() + 45 * 60_000) slots.push(slot.toISOString());
      }
    }
  }
  return slots;
}

export function validateCheckout(input: CheckoutInput, now: Date = new Date()): CheckoutError[] {
  const errors: CheckoutError[] = [];
  if (!normaliseCart(input.lines, menu).length) errors.push({ field:"cart", message:"Add a dish before placing an order." });
  if (input.name.trim().length < 2 || input.name.trim().length > 80) errors.push({ field:"name", message:"Enter a name between 2 and 80 characters." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) errors.push({ field:"email", message:"Enter a valid email address." });
  if (!pickupSlots(now).includes(input.pickupTime)) errors.push({ field:"pickupTime", message:"Choose an available pickup time." });
  return errors;
}

export function createDemoOrder(input: CheckoutInput, now: Date = new Date()): CheckoutResult {
  const errors = validateCheckout(input, now);
  if (errors.length) return { ok:false, errors };
  const lines = normaliseCart(input.lines, menu);
  const totals = cartTotals(lines, menu);
  return {
    ok:true,
    order: {
      id: "ME-" + now.getTime().toString(36).toUpperCase(),
      type: "Pickup",
      lines,
      ...{ subtotalCents:totals.subtotalCents, taxCents:totals.taxCents, totalCents:totals.totalCents },
      name:input.name.trim(),
      email:input.email.trim().toLowerCase(),
      pickupTime:input.pickupTime,
      createdAt:now.toISOString()
    }
  };
}
