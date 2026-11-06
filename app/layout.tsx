import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mallow & Ember | A table worth staying for",
  description: "A seasonal neighborhood table. Explore the menu, plan pickup, and find your evening.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
