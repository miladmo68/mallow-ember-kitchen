export type MenuCategory = "Small plates" | "From the hearth" | "Pasta & grains" | "Something sweet" | "Drinks";
export type DietaryTag = "Vegetarian" | "Vegan" | "Gluten-free";
export type MenuItem = {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  priceCents: number;
  tags: DietaryTag[];
  image?: string;
  imageCredit?: string;
  featured?: boolean;
  available: boolean;
};
export type CartLine = { itemId: string; quantity: number };
export type OrderType = "Pickup" | "Dine-in";
export type CartTotals = { subtotalCents: number; taxCents: number; totalCents: number; itemCount: number };
export type Reservation = { id: string; date: string; time: string; partySize: number; tableId: string; guestName: string; email: string; notes: string; createdAt: string };
export type Order = { id: string; type: OrderType; lines: CartLine[]; subtotalCents: number; taxCents: number; totalCents: number; name: string; email: string; pickupTime: string; createdAt: string };
