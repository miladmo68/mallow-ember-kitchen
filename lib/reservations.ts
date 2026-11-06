import type { Reservation } from "./domain";

export const tables = [
  { id:"oak-2a", seats:2 }, { id:"oak-2b", seats:2 },
  { id:"window-4", seats:4 }, { id:"garden-4", seats:4 },
  { id:"hearth-6", seats:6 }
] as const;

const serviceTimes = ["12:00","12:30","13:00","13:30","18:00","18:30","19:00","19:30","20:00"];
const durationMinutes = 90;
export type ReservationInput = { date:string; time:string; partySize:number; guestName:string; email:string; notes:string };
export type ReservationResult = { ok:true; reservation:Reservation } | { ok:false; message:string };

function minuteOfDay(value:string):number {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}
function isOverlapping(left:string, right:string):boolean {
  return Math.abs(minuteOfDay(left) - minuteOfDay(right)) < durationMinutes;
}
function validDate(date:string):Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const parsed = new Date(date + "T12:00:00");
  return Number.isNaN(parsed.getTime()) || [parsed.getFullYear(),String(parsed.getMonth()+1).padStart(2,"0"),String(parsed.getDate()).padStart(2,"0")].join("-") !== date ? null : parsed;
}

export function availableTable(date:string,time:string,partySize:number,existing:Reservation[]):string | null {
  if (!Number.isInteger(partySize) || partySize < 1 || partySize > 6) return null;
  const occupied = new Set(existing.filter((reservation) => reservation.date === date && isOverlapping(reservation.time,time)).map((reservation) => reservation.tableId));
  const table = tables.filter((candidate) => candidate.seats >= partySize && !occupied.has(candidate.id)).sort((a,b) => a.seats - b.seats)[0];
  return table?.id ?? null;
}

export function availableTimes(date:string,partySize:number,existing:Reservation[],now:Date = new Date()):string[] {
  const day = validDate(date);
  if (!day || day.getDay() === 1) return [];
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const difference = Math.floor((day.getTime() - today.getTime()) / 86_400_000);
  if (difference < 0 || difference > 30) return [];
  return serviceTimes.filter((time) => {
    const slot = new Date(day.getFullYear(),day.getMonth(),day.getDate(),...time.split(":").map(Number));
    return slot.getTime() > now.getTime() + 90 * 60_000 && availableTable(date,time,partySize,existing) !== null;
  });
}

export function createReservation(input:ReservationInput,existing:Reservation[],now:Date = new Date()):ReservationResult {
  const guestName = input.guestName.trim();
  const email = input.email.trim().toLowerCase();
  const notes = input.notes.trim();
  if (guestName.length < 2 || guestName.length > 80) return { ok:false,message:"Enter a guest name between 2 and 80 characters." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok:false,message:"Enter a valid email address." };
  if (notes.length > 300) return { ok:false,message:"Keep notes under 300 characters." };
  if (!availableTimes(input.date,input.partySize,existing,now).includes(input.time)) return { ok:false,message:"That seating is unavailable. Choose another time." };
  const tableId = availableTable(input.date,input.time,input.partySize,existing);
  if (!tableId) return { ok:false,message:"That table has just filled. Choose another time." };
  return { ok:true,reservation:{
    id:"ME-R-" + now.getTime().toString(36).toUpperCase(),
    date:input.date,time:input.time,partySize:input.partySize,tableId,
    guestName,email,notes,createdAt:now.toISOString()
  }};
}

export function nextBookableDates(now:Date = new Date()):string[] {
  return Array.from({length:31},(_,offset) => new Date(now.getFullYear(),now.getMonth(),now.getDate()+offset))
    .filter((date) => date.getDay() !== 1)
    .map((date) => [date.getFullYear(),String(date.getMonth()+1).padStart(2,"0"),String(date.getDate()).padStart(2,"0")].join("-"));
}
