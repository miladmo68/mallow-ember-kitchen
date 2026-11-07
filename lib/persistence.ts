import type { CartLine, Order, Reservation } from "./domain";
import { normaliseCart } from "./menu";
import { parseSavedOrders, parseSavedReservations } from "./orderHistory";

const PREFIX = "mallow-ember-v1";
const KEYS = { cart:PREFIX + ":cart", orders:PREFIX + ":orders", reservations:PREFIX + ":reservations" };

function readValue(key: string): unknown {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(key) ?? "[]") as unknown; }
  catch { return []; }
}
function writeArray<T>(key: string, items: T[]): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, JSON.stringify(items)); } catch { /* storage can be restricted */ }
}
export const browserStore = {
  loadCart(): CartLine[] { const value=readValue(KEYS.cart); return normaliseCart(Array.isArray(value)?value as CartLine[]:[]); },
  saveCart(lines: CartLine[]): void { writeArray(KEYS.cart, normaliseCart(lines)); },
  loadOrders(): Order[] { return parseSavedOrders(readValue(KEYS.orders)); },
  saveOrder(order: Order): void { writeArray(KEYS.orders, [order, ...this.loadOrders()].slice(0,20)); },
  loadReservations(): Reservation[] { return parseSavedReservations(readValue(KEYS.reservations)); },
  saveReservation(booking: Reservation): void { writeArray(KEYS.reservations, [booking, ...this.loadReservations()].slice(0,30)); },
  cancelReservation(id: string): void { writeArray(KEYS.reservations, this.loadReservations().filter((booking) => booking.id !== id)); },
  clearCart(): void { writeArray(KEYS.cart, []); }
};
