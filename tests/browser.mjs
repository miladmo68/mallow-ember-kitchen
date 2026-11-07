import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const root = join(process.cwd(),"out");
const mime={".html":"text/html; charset=utf-8",".css":"text/css",".js":"text/javascript",".json":"application/json",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml",".ico":"image/x-icon"};
const server=createServer(async (req,res) => {
  const pathname=decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname);
  const target=normalize(join(root,pathname.endsWith("/")?pathname+"index.html":pathname));
  if(!target.startsWith(root)) {res.writeHead(403).end();return;}
  try {const body=await readFile(target);res.writeHead(200,{"content-type":mime[extname(target)]??"application/octet-stream"}).end(body);}
  catch {res.writeHead(404).end("Not found");}
});
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
let browser;
try {
  await new Promise((resolve)=>server.listen(0,"127.0.0.1",resolve));
  const origin="http://127.0.0.1:"+server.address().port;
  browser=await chromium.launch({headless:true});
  await mkdir("public/screenshots",{recursive:true});
  for (const [name,viewport] of [["desktop",{width:1440,height:900}],["mobile",{width:390,height:844}]]) {
    const context=await browser.newContext({viewport,deviceScaleFactor:1});
    const page=await context.newPage();
    const errors=[];
    page.on("pageerror",(error)=>errors.push(error.message));
    const response=await page.goto(origin+"/",{waitUntil:"networkidle"});
    assert(response?.status()===200,name+": HTML status");
    assert(await page.getByRole("heading",{name:/Come hungry/i}).isVisible(),name+": hero");
    assert(await page.locator(".hero-photo img").evaluate((img)=>img.complete&&img.naturalWidth>0),name+": licensed image");
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),name+": horizontal overflow");
    await page.screenshot({path:"public/screenshots/"+name+".png",fullPage:true});
    await page.getByRole("searchbox",{name:"Search the menu"}).fill("tomato");
    assert(await page.locator(".menu-card").count()===1,name+": search");
    await page.getByRole("searchbox",{name:"Search the menu"}).fill("");
    await page.getByRole("combobox",{name:"Dietary preference"}).selectOption("Vegan");
    assert(await page.locator(".menu-card").count()>0,name+": dietary filter");
    await page.getByRole("combobox",{name:"Dietary preference"}).selectOption("All");
    await page.getByRole("button",{name:"Add Whipped ricotta & hot honey to basket"}).click();
    await page.getByRole("button",{name:/Open your basket with 1 items/}).click();
    assert(await page.getByRole("dialog",{name:"Your basket"}).isVisible(),name+": basket");
    await page.getByRole("button",{name:/Continue to pickup/}).click();
    await page.getByRole("button",{name:/Create order preview/}).click();
    assert(await page.getByText(/Enter a name between/).isVisible(),name+": checkout validation");
    await page.getByLabel("Your name").first().fill("Alex Rivera");
    await page.getByLabel("Email address").first().fill("alex@example.com");
    await page.getByLabel("Pickup time").selectOption({index:1});
    await page.getByRole("button",{name:/Create order preview/}).click();
    assert(await page.getByText("Your preview is saved.").isVisible(),name+": order preview");
    await page.getByRole("button",{name:/Back to the table/}).click();
    assert(await page.getByRole("button",{name:/Add again/}).isVisible(),name+": order history");
    await page.getByRole("button",{name:/Add again/}).click();
    await page.keyboard.press("Escape");
    assert(await page.getByRole("dialog",{name:"Your basket"}).count()===0,name+": escape");
    const reserve=page.locator("#reserve");
    await reserve.locator(".time-grid button").first().click();
    await reserve.getByPlaceholder("Name for the table").fill("Alex Rivera");
    await reserve.getByPlaceholder("you@example.com").fill("alex@example.com");
    await reserve.getByRole("button",{name:/Reserve a table preview/}).click();
    assert(await reserve.getByText(/See you around/).isVisible(),name+": reservation");
    await reserve.getByRole("button",{name:"Cancel preview"}).click();
    assert(await reserve.getByRole("heading",{name:"Saved in this browser"}).count()===0,name+": cancel reservation");
    assert(errors.length===0,name+": JavaScript errors "+errors.join("; "));
    await context.close();
  }
  console.log("PASS desktop/mobile: page, images, overflow, search, diet, cart, checkout, order history, escape, reservation, cancellation");
} finally {await browser?.close();await new Promise((resolve)=>server.close(resolve));}
