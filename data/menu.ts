import type { MenuCategory, MenuItem } from "../lib/domain";

export const categories: MenuCategory[] = ["Small plates", "From the hearth", "Pasta & grains", "Something sweet", "Drinks"];

export const menu: MenuItem[] = [
  { id:"whipped-ricotta", name:"Whipped ricotta & hot honey", category:"Small plates", description:"Lemon zest, garden thyme, toasted sourdough, a little heat.", priceCents:1500, tags:["Vegetarian"], available:true, featured:true },
  { id:"tomato-toast", name:"Late-harvest tomato toast", category:"Small plates", description:"Ripe tomato, basil, garlic oil, grilled country loaf.", priceCents:1400, tags:["Vegan"], available:true },
  { id:"beet-salad", name:"Charred beet & citrus", category:"Small plates", description:"Blood orange, shaved fennel, pistachio, orange blossom.", priceCents:1600, tags:["Vegan","Gluten-free"], available:true },
  { id:"crispy-potatoes", name:"Crispy rosemary potatoes", category:"Small plates", description:"Sea salt, preserved lemon aioli, fresh rosemary.", priceCents:1100, tags:["Vegetarian","Gluten-free"], available:true },
  { id:"hearth-chicken", name:"Hearth-roasted chicken", category:"From the hearth", description:"Half bird, smoky pan jus, spring onion, herb salad.", priceCents:3200, tags:["Gluten-free"], available:true, featured:true },
  { id:"miso-carrots", name:"Ember-glazed carrots", category:"From the hearth", description:"White miso, sesame crunch, coriander and lime.", priceCents:2300, tags:["Vegetarian","Gluten-free"], available:true },
  { id:"braised-short-rib", name:"Red wine short rib", category:"From the hearth", description:"Slow-braised beef, celery root purée, pickled shallot.", priceCents:3900, tags:["Gluten-free"], available:true },
  { id:"market-fish", name:"Market fish, brown butter", category:"From the hearth", description:"Pan-seared catch, capers, tender greens, lemon.", priceCents:3600, tags:["Gluten-free"], available:true },
  { id:"wild-mushroom-pasta", name:"Wild mushroom mafaldine", category:"Pasta & grains", description:"Hand-torn mushrooms, silky cream, aged parmesan, parsley.", priceCents:2800, tags:["Vegetarian"], available:true, featured:true },
  { id:"saffron-risotto", name:"Saffron & squash risotto", category:"Pasta & grains", description:"Roasted squash, crisp sage, cultured butter.", priceCents:2700, tags:["Vegetarian","Gluten-free"], available:true },
  { id:"slow-ragu", name:"Sunday ragu pappardelle", category:"Pasta & grains", description:"Slow-cooked beef, tomato, rosemary, parmesan.", priceCents:3100, tags:[], available:true },
  { id:"olive-cake", name:"Olive oil cake", category:"Something sweet", description:"Orange curd, whipped mascarpone, flaky salt.", priceCents:1300, tags:["Vegetarian"], available:true },
  { id:"chocolate-pot", name:"Dark chocolate pot", category:"Something sweet", description:"70% chocolate, cultured cream, cocoa nib.", priceCents:1200, tags:["Vegetarian","Gluten-free"], available:true },
  { id:"pear-spritz", name:"Pear & rosemary spritz", category:"Drinks", description:"Pear, rosemary cordial, lemon and sparkling water.", priceCents:900, tags:["Vegan","Gluten-free"], available:true },
  { id:"hibiscus-tonic", name:"Hibiscus house tonic", category:"Drinks", description:"Hibiscus, grapefruit, juniper and soda.", priceCents:850, tags:["Vegan","Gluten-free"], available:true },
  { id:"espresso", name:"After-dinner espresso", category:"Drinks", description:"A short, bright double shot.", priceCents:500, tags:["Vegan","Gluten-free"], available:true }
];
