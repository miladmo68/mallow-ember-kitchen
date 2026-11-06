"use client";
import { useEffect, useMemo, useState } from "react";
import { availableTimes, createReservation, nextBookableDates } from "../lib/reservations";
import { browserStore } from "../lib/persistence";
import type { Reservation } from "../lib/domain";
import { photos } from "../lib/photos";

export function ReservationExperience() {
  const [dates,setDates] = useState<string[]>([]);
  const [date,setDate] = useState("");
  const [time,setTime] = useState("");
  const [partySize,setPartySize] = useState(2);
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [notes,setNotes] = useState("");
  const [bookings,setBookings] = useState<Reservation[]>([]);
  const [recent,setRecent] = useState<Reservation | null>(null);
  const [error,setError] = useState("");
  const slots = useMemo(() => availableTimes(date,partySize,bookings),[date,partySize,bookings]);

  useEffect(() => {
    const options=nextBookableDates();
    setDates(options);
    setDate(options[0] ?? "");
    setBookings(browserStore.loadReservations());
  },[]);
  function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result=createReservation({date,time,partySize,guestName:name,email,notes},bookings);
    if(!result.ok) {setError(result.message);return;}
    browserStore.saveReservation(result.reservation);
    setBookings(browserStore.loadReservations());
    setRecent(result.reservation);
    setError("");
    setTime("");
  }
  function cancel(id:string) {
    browserStore.cancelReservation(id);
    setBookings(browserStore.loadReservations());
    if(recent?.id===id) setRecent(null);
  }
  return <section id="reserve" className="reservation-section section-shell" aria-labelledby="reserve-title">
    <div className="reservation-intro"><div className="section-kicker">03 / Gather round</div><h2 id="reserve-title">The best nights<br /><em>start here.</em></h2><p>A seat for a quick catch-up, or a whole evening with your favourite people. Pick the time that feels right.</p><div className="reservation-photo"><img src={photos.room} alt="Editorial photo of a warmly lit restaurant table" loading="lazy" /></div></div>
    <div className="reservation-card">
      {recent ? <div className="reservation-success" role="status"><span className="success-icon">✳</span><p className="section-kicker">Your table preview</p><h3>See you around<br />the table.</h3><p>{recent.partySize} guests · {new Date(recent.date + "T12:00:00").toLocaleDateString("en-CA",{weekday:"long",month:"long",day:"numeric"})} at {recent.time}</p><p>Under {recent.guestName} · {recent.email}</p><p className="small-truth">This reservation is saved only in this browser. It has not been sent to a restaurant.</p><div className="success-actions"><button type="button" onClick={() => setRecent(null)}>Make another</button><button type="button" onClick={() => cancel(recent.id)}>Cancel preview</button></div></div> : <>
        <div className="reservation-card-top"><span>01 / 02</span><span>Find your table</span></div>
        <form onSubmit={submit} noValidate>
          <div className="reservation-fields"><label>When would you like to come?<select value={date} onChange={(event) => {setDate(event.target.value);setTime("");setError("");}} required><option value="">Choose a date</option>{dates.map((value) => <option key={value} value={value}>{new Date(value + "T12:00:00").toLocaleDateString("en-CA",{weekday:"short",month:"short",day:"numeric"})}</option>)}</select></label><label>How many at the table?<select value={partySize} onChange={(event) => {setPartySize(Number(event.target.value));setTime("");setError("");}}>{[1,2,3,4,5,6].map((size) => <option key={size} value={size}>{size} {size===1?"guest":"guests"}</option>)}</select></label></div>
          <fieldset className="time-fieldset"><legend>Available times</legend><div className="time-grid">{slots.length ? slots.map((slot) => <button type="button" key={slot} aria-pressed={time===slot} onClick={() => {setTime(slot);setError("");}}>{slot}</button>) : <p>No seats remain for this date and party size. Try another day.</p>}</div></fieldset>
          <div className="reservation-fields contact-fields"><label>Your name<input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Name for the table" /></label><label>Email address<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" /></label></div>
          <label className="notes-label">Anything we should know?<textarea value={notes} maxLength={300} onChange={(e) => setNotes(e.target.value)} placeholder="A celebration, accessibility needs, dietary notes..." rows={3} /></label>
          {error && <p className="reservation-error" role="alert">{error}</p>}
          <button type="submit" className="reservation-submit" disabled={!slots.length}>Reserve a table preview <span>↗</span></button>
          <p className="small-truth">Interactive concept only. This does not make a real booking.</p>
        </form>
      </>}
      {bookings.length > 0 && <div className="saved-bookings"><h4>Saved in this browser</h4>{bookings.map((booking) => <div className="saved-booking" key={booking.id}><span>{booking.date} · {booking.time} · {booking.partySize} guests</span><button type="button" onClick={() => cancel(booking.id)} aria-label={"Cancel reservation preview " + booking.id}>Cancel</button></div>)}</div>}
    </div>
  </section>;
}
