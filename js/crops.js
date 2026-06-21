/*
 * Přednastavené plodiny s orientační hmotností tisíce zrn (HTZ) v gramech
 * a orientační výkupní cenou v Kč/t.
 * Hodnoty jsou typické průměry – uživatel je může v aplikaci upravit
 * podle laboratorního rozboru, resp. aktuální výkupní ceny.
 */
const CROPS = [
  { group: "Obiloviny", items: [
    { id: "wheat",      name: "Pšenice",          tgw: 45,  price: 5000 },
    { id: "barley",     name: "Ječmen",           tgw: 43,  price: 4800 },
    { id: "rye",        name: "Žito",             tgw: 32,  price: 4500 },
    { id: "triticale",  name: "Tritikale",        tgw: 42,  price: 4500 },
    { id: "oat",        name: "Oves",             tgw: 33,  price: 4500 },
    { id: "corn",       name: "Kukuřice (zrno)",  tgw: 300, price: 4500 },
  ]},
  { group: "Olejniny", items: [
    { id: "rape",       name: "Řepka",            tgw: 5,   price: 11000 },
    { id: "sunflower",  name: "Slunečnice",       tgw: 60,  price: 10000 },
    { id: "mustard",    name: "Hořčice",          tgw: 4,   price: 15000 },
    { id: "poppy",      name: "Mák",              tgw: 0.5, price: 40000 },
    { id: "soy",        name: "Sója",             tgw: 160, price: 12000 },
    { id: "flax",       name: "Len",              tgw: 6,   price: 12000 },
  ]},
  { group: "Vlastní", items: [
    { id: "custom",     name: "Vlastní (zadej HTZ)", tgw: 40, price: 5000 },
  ]},
];
