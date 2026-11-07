"use client";
import { useEffect, useMemo, useState } from "react";
import { categories, menu } from "../data/menu";
import { createDemoOrder, pickupSlots } from "../lib/checkout";
import type { CartLine, DietaryTag, MenuCategory, Order } from "../lib/domain";
import { cartTotals, filterMenu, formatMoney, setQuantity } from "../lib/menu";
import { browserStore } from "../lib/persistence";
import { repeatOrderLines } from "../lib/orderHistory";

export function MenuExperience() {
  const [category,setCategory] = useState<MenuCategory | "All">("All");
  const [dietary,setDietary] = useState<DietaryTag | "All">("All");
  const [search,setSearch] = useState("");
  const [cart,setCart] = useState<CartLine[]>([]);
  const [orders,setOrders] = useState<Order[]>([]);
  const [hydrated,setHydrated] = useState(false);
  const [open,setOpen] = useState(false);
  const [step,setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [confirmed,setConfirmed] = useState<Order | null>(null);
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [pickupTime,setPickupTime] = useState("");
  const [slots,setSlots] = useState<string[]>([]);
  const [errors,setErrors] = useState<Record<string,string>>({});
  const filtered = useMemo(() => filterMenu(menu,{category,dietary,search}),[category,dietary,search]);
  const totals = useMemo(() => cartTotals(cart),[cart]);

  useEffect(() => { setCart(browserStore.loadCart()); setOrders(browserStore.loadOrders()); setSlots(pickupSlots()); setHydrated(true); },[]);
  useEffect(() => { if(hydrated) browserStore.saveCart(cart); },[cart,hydrated]);
  useEffect(() => { if(open) { const onKey=(event:KeyboardEvent) => { if(event.key === "Escape") setOpen(false); }; window.addEventListener("keydown",onKey); document.body.style.overflow="hidden"; return () => { window.removeEventListener("keydown",onKey); document.body.style.overflow=""; }; } },[open]);

  function changeCart(itemId:string,quantity:number) {
    setCart((current) => setQuantity(current,itemId,quantity));
  }
  function addItem(itemId:string) {
    setCart((current) => setQuantity(current,itemId,(current.find((line) => line.itemId===itemId)?.quantity ?? 0)+1));
  }
  function openCart() { setStep("cart"); setErrors({}); setOpen(true); }
  function submitOrder(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result=createDemoOrder({lines:cart,name,email,pickupTime});
    if(!result.ok) { setErrors(Object.fromEntries(result.errors.map((error) => [error.field,error.message]))); return; }
    browserStore.saveOrder(result.order);
    setOrders(browserStore.loadOrders());
    browserStore.clearCart();
    setCart([]);
    setConfirmed(result.order);
    setErrors({});
    setStep("success");
  }

  return <section id="menu" className="menu-section section-shell" aria-labelledby="menu-title">
    <div className="menu-heading"><div><div className="section-kicker">02 / Eat well</div><h2 id="menu-title">The menu<span style={{color:"var(--rust)"}}>.</span></h2></div><p>Something bright to begin, something warm from the hearth, and always room for dessert.</p></div>
    <div className="menu-toolbar">
      <input className="menu-search" type="search" aria-label="Search the menu" placeholder="Find something good..." value={search} onChange={(event) => setSearch(event.target.value)} />
      <select className="dietary-select" aria-label="Dietary preference" value={dietary} onChange={(event) => setDietary(event.target.value as DietaryTag | "All")}><option value="All">All diets</option><option>Vegetarian</option><option>Vegan</option><option>Gluten-free</option></select>
      <button className="cart-pill" type="button" onClick={openCart} aria-label={"Open your basket with " + totals.itemCount + " items"}>Your basket <b>{totals.itemCount}</b></button>
    </div>
    <div className="category-tabs" role="group" aria-label="Menu categories">
      {(["All",...categories] as const).map((value) => <button key={value} type="button" aria-pressed={category===value} onClick={() => setCategory(value)}>{value}</button>)}
    </div>
    <div className="menu-grid" aria-live="polite">
      {filtered.length ? filtered.map((item,index) => <article className="menu-card" key={item.id}>
        <div className="menu-card-top"><span>{item.category}</span><span>{String(index+1).padStart(2,"0")} / 16</span></div>
        <h3>{item.name}</h3><p>{item.description}</p>
        <div className="menu-card-bottom"><strong>{formatMoney(item.priceCents)}</strong><button className="add-button" type="button" onClick={() => addItem(item.id)} aria-label={"Add " + item.name + " to basket"}>+</button></div>
        <div className="tag-list">{item.tags.join(" · ") || "\u00a0"}</div>
      </article>) : <div className="empty-menu"><h3>Nothing on this menu yet.</h3><p>Try another search or dietary choice.</p><button type="button" onClick={() => {setSearch("");setDietary("All");setCategory("All");}}>Show everything</button></div>}
    </div>
    {orders.length > 0 && <section className="order-history" aria-label="Saved order previews"><div><span className="section-kicker">Your table, your way</span><h3>Come back to a favourite.</h3></div><div className="order-history-list">{orders.slice(0,3).map((order) => <article key={order.id}><span>{new Date(order.createdAt).toLocaleDateString("en-CA",{month:"short",day:"numeric"})} · {order.lines.reduce((sum,line) => sum+line.quantity,0)} items</span><strong>{formatMoney(order.totalCents)}</strong><button type="button" onClick={() => {setCart(repeatOrderLines(order));setStep("cart");setOpen(true);}}>Add again ↗</button></article>)}</div></section>}
    <div className="menu-cart-mobile"><button className="cart-pill" type="button" onClick={openCart}>View basket · {totals.itemCount} items · {formatMoney(totals.totalCents)}</button></div>
    {open && <><button className="drawer-backdrop" aria-label="Close basket" type="button" onClick={() => setOpen(false)}></button><aside className="order-drawer" role="dialog" aria-modal="true" aria-label={step==="success"?"Order preview":"Your basket"}>
      <div className="drawer-header"><h2>{step==="success"?"All set.":"Your basket"}</h2><button className="icon-close" type="button" onClick={() => setOpen(false)} aria-label="Close basket">×</button></div>
      {step==="success" && confirmed ? <div className="order-confirmation"><div className="check-circle">✓</div><h3>Your preview is saved.</h3><p>Order preview <strong>{confirmed.id}</strong> for {confirmed.name} at {new Date(confirmed.pickupTime).toLocaleString("en-CA",{dateStyle:"medium",timeStyle:"short"})}.</p><p className="drawer-disclaimer">This is an interactive portfolio concept. No order was sent to a restaurant and no payment was taken.</p><button className="drawer-primary" type="button" onClick={() => {setOpen(false);setStep("cart");}}>Back to the table</button></div> : step==="checkout" ? <div className="drawer-content"><button className="checkout-back" type="button" onClick={() => setStep("cart")}>← Back to basket</button><form className="checkout-form" onSubmit={submitOrder} noValidate><label>Your name<input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />{errors.name && <span className="form-error">{errors.name}</span>}</label><label>Email address<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />{errors.email && <span className="form-error">{errors.email}</span>}</label><label>Pickup time<select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} required><option value="">Choose a time</option>{slots.map((slot) => <option key={slot} value={slot}>{new Date(slot).toLocaleString("en-CA",{weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}</option>)}</select>{errors.pickupTime && <span className="form-error">{errors.pickupTime}</span>}</label>{errors.cart && <p className="form-error">{errors.cart}</p>}<div className="cart-summary"><div className="total"><span>Total incl. HST</span><span>{formatMoney(totals.totalCents)}</span></div></div><p className="drawer-disclaimer">Preview only. No payment or real order is submitted.</p><button className="drawer-primary" type="submit">Create order preview ↗</button></form></div> : <div className="drawer-content">{cart.length ? <>{cart.map((line) => {const item=menu.find((entry) => entry.id===line.itemId);return item ? <div className="cart-line" key={line.itemId}><div><h3>{item.name}</h3><small>{formatMoney(item.priceCents)} each</small></div><div className="quantity-control"><button type="button" onClick={() => changeCart(item.id,line.quantity-1)} aria-label={"Remove one " + item.name}>−</button><span>{line.quantity}</span><button type="button" onClick={() => changeCart(item.id,line.quantity+1)} aria-label={"Add one " + item.name}>+</button></div></div> : null;})}<div className="cart-summary"><div><span>Subtotal</span><span>{formatMoney(totals.subtotalCents)}</span></div><div><span>HST 13%</span><span>{formatMoney(totals.taxCents)}</span></div><div className="total"><span>Total</span><span>{formatMoney(totals.totalCents)}</span></div></div><p className="drawer-disclaimer">This concept saves your basket in this browser. No payment is collected.</p><button className="drawer-primary" type="button" onClick={() => setStep("checkout")}>Continue to pickup ↗</button></> : <div className="drawer-empty"><span aria-hidden="true">✳</span><h3>A little room for something good.</h3><p>Your basket is empty. Add a dish from the menu to begin.</p><button className="drawer-primary" type="button" onClick={() => setOpen(false)}>Explore the menu</button></div>}</div>}
    </aside></>}
  </section>;
}
