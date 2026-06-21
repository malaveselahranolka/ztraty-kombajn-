/*
 * Přednastavené plodiny s orientační hmotností tisíce zrn (HTZ) v gramech.
 * Hodnoty jsou typické průměry – uživatel je může v aplikaci upravit
 * podle laboratorního rozboru konkrétní partie.
 */
const CROPS = [
  { group: "Obiloviny", items: [
    { id: "wheat",      name: "Pšenice",          tgw: 45 },
    { id: "barley",     name: "Ječmen",           tgw: 43 },
    { id: "rye",        name: "Žito",             tgw: 32 },
    { id: "triticale",  name: "Tritikale",        tgw: 42 },
    { id: "oat",        name: "Oves",             tgw: 33 },
    { id: "corn",       name: "Kukuřice (zrno)",  tgw: 300 },
  ]},
  { group: "Olejniny", items: [
    { id: "rape",       name: "Řepka",            tgw: 5 },
    { id: "sunflower",  name: "Slunečnice",       tgw: 60 },
    { id: "mustard",    name: "Hořčice",          tgw: 4 },
    { id: "poppy",      name: "Mák",              tgw: 0.5 },
    { id: "soy",        name: "Sója",             tgw: 160 },
    { id: "flax",       name: "Len",              tgw: 6 },
  ]},
  { group: "Vlastní", items: [
    { id: "custom",     name: "Vlastní (zadej HTZ)", tgw: 40 },
  ]},
];
