const test = require("node:test");
const assert = require("node:assert/strict");
const { menu } = require("../.test-dist/data/menu.js");
const { filterMenu, setQuantity, cartTotals } = require("../.test-dist/lib/menu.js");
const { pickupSlots, createDemoOrder } = require("../.test-dist/lib/checkout.js");
const { availableTimes, availableTable, createReservation } = require("../.test-dist/lib/reservations.js");

test("menu search combines category and dietary restrictions", () => {
  const results = filterMenu(menu,{category:"Small plates",dietary:"Vegan",search:"tomato"});
  assert.equal(results.length,1);
  assert.equal(results[0].id,"tomato-toast");
  assert.equal(filterMenu(menu,{search:"no such dish"}).length,0);
});

test("cart normalizes quantities and calculates Canadian HST", () => {
  const lines = setQuantity([], "whipped-ricotta", 1);
  const withEspresso = setQuantity(lines,"espresso",2);
  assert.deepEqual(cartTotals(withEspresso),{subtotalCents:2500,taxCents:325,totalCents:2825,itemCount:3});
  assert.equal(setQuantity(withEspresso,"espresso",100)[1].quantity,20);
  assert.equal(setQuantity(withEspresso,"espresso",0).length,1);
});

test("pickup order validation prevents empty and invalid requests", () => {
  const now = new Date("2026-11-06T15:00:00Z");
  const slot = pickupSlots(now)[0];
  const invalid = createDemoOrder({lines:[],name:"A",email:"invalid",pickupTime:slot},now);
  assert.equal(invalid.ok,false);
  assert.deepEqual(invalid.errors.map((error) => error.field),["cart","name","email"]);
  const valid = createDemoOrder({lines:[{itemId:"espresso",quantity:1}],name:"Alex Rivera",email:"ALEX@example.com",pickupTime:slot},now);
  assert.equal(valid.ok,true);
  assert.equal(valid.order.totalCents,565);
  assert.equal(valid.order.email,"alex@example.com");
});

test("reservation slots obey opening day and lead time", () => {
  const now = new Date("2026-11-06T14:00:00Z");
  assert.deepEqual(availableTimes("2026-11-09",2,[],now),[]);
  assert.equal(availableTimes("2026-11-07",2,[],now).includes("18:00"),true);
  assert.equal(availableTimes("2026-11-05",2,[],now).length,0);
});

test("table assignment and overlapping seating prevent overbooking", () => {
  const now = new Date("2026-11-06T14:00:00Z");
  const bookings = [];
  for(let i=0;i<5;i+=1) {
    const result = createReservation({date:"2026-11-07",time:"18:00",partySize:2,guestName:"Guest " + i,email:"guest@example.com",notes:""},bookings,new Date(now.getTime()+i));
    assert.equal(result.ok,true);
    bookings.push(result.reservation);
  }
  assert.equal(availableTable("2026-11-07","18:00",2,bookings),null);
  assert.equal(availableTable("2026-11-07","19:00",2,bookings),null);
  assert.notEqual(availableTable("2026-11-07","20:00",2,bookings),null);
  const full = createReservation({date:"2026-11-07",time:"18:00",partySize:2,guestName:"Late Guest",email:"late@example.com",notes:""},bookings,now);
  assert.equal(full.ok,false);
});

const { parseSavedOrders, parseSavedReservations, repeatOrderLines } = require("../.test-dist/lib/orderHistory.js");

test("saved previews reject malformed records and recalculate totals", () => {
  const order={id:"ME-1",name:"Alex",email:"alex@example.com",pickupTime:"2026-11-08T18:00:00.000Z",createdAt:"2026-11-07T12:00:00.000Z",lines:[{itemId:"espresso",quantity:2}],totalCents:1};
  const parsed=parseSavedOrders([null,{...order,lines:[{itemId:"unknown",quantity:2}]},order]);
  assert.equal(parsed.length,1);
  assert.equal(parsed[0].totalCents,1130);
  assert.deepEqual(repeatOrderLines(parsed[0]),[{itemId:"espresso",quantity:2}]);
});

test("saved reservation parser ignores invalid or corrupted entries", () => {
  const good={id:"ME-R-1",date:"2026-11-08",time:"18:00",partySize:3,tableId:"window-4",guestName:"Alex",email:"alex@example.com",notes:"",createdAt:"2026-11-07T12:00:00.000Z"};
  assert.deepEqual(parseSavedReservations([{...good,tableId:"unknown"},good]),[good]);
});
