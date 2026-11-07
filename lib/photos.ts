/** Licensed editorial photography; see PHOTO_CREDITS.md. */
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const photos = {
  room: base + "/images/room.jpg",
  pasta: base + "/images/pasta.jpg",
  chicken: base + "/images/chicken.jpg",
  beets: base + "/images/beets.jpg"
} as const;
