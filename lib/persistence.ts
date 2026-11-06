import type { CartLine, Order, Reservation } from "./domain";
import { normaliseCart } from "./menu";

const PREFIX = "mallow-ember-v1";
const KEYS = { cart:PREFIX + ":cart", orders:PREFIX + ":orders", reservations:PREFIX + ":reservations" };

function readArray<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value as T[] : [];
  } catch { return []; }
}

function writeArray<T>(key: string, items: T[]): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, JSON.stringify(items)); } catch { /* private browsing can restrict storage */ }
}

export const browserStore = {
  loadCart(): CartLine[] { return normaliseCart(readArray<CartLine>(KEYS.cart)); },
  saveCart(lines: CartLine[]): void { writeArray(KEYS.cart, normaliseCart(lines)); },
  loadOrders(): Order[] { return readArray<Order>(KEYS.orders).filter((order) => typeof order?.id === "string"); },
  saveOrder(order: Order): void { writeArray(KEYS.orders, [order, ...this.loadOrders()].slice(0, 20)); },
  loadReservations(): Reservation[] { return readArray<Reservation>(KEYS.reservations).filter((booking) => typeof booking?.id === "string"); },
  saveReservation(booking: Reservation): void { writeArray(KEYS.reservations, [booking, ...this.loadReservations()].slice(0, 30)); },
  cancelReservation(id: string): void { writeArray(KEYS.reservations, this.loadReservations().filter((booking) => booking.id !== id)); },
  clearCart(): void { writeArray(KEYS.cart, []); }
};
