"use strict";

/* ---------- pomocné funkce ---------- */
const $ = (id) => document.getElementById(id);
const fmt = (n, dec = 1) =>
  isFinite(n)
    ? n.toLocaleString("cs-CZ", { minimumFractionDigits: dec, maximumFractionDigits: dec })
    : "–";

const cropById = (id) => {
  for (const g of CROPS) {
    const found = g.items.find((c) => c.id === id);
    if (found) return found;
  }
  return null;
};

/* ---------- stav ---------- */
const STORAGE_KEY = "ztraty-kombajn-historie";

/* ---------- inicializace plodin ---------- */
function initCrops() {
  const sel = $("crop");
  CROPS.forEach((g) => {
    const og = document.createElement("optgroup");
    og.label = g.group;
    g.items.forEach((c) => {
      const o = document.createElement("option");
      o.value = c.id;
      o.textContent = `${c.name} (HTZ ${fmt(c.tgw, c.tgw < 1 ? 1 : 0)} g)`;
      og.appendChild(o);
    });
    sel.appendChild(og);
  });
  sel.value = "wheat";
  syncCropDefaults();
}

function syncCropDefaults() {
  const c = cropById($("crop").value);
  if (c) {
    $("tgw").value = c.tgw;
    $("price").value = c.price;
  }
}

/* ---------- počítadla měření (řádky se zrny) ---------- */
function addCountRow(container) {
  const row = document.createElement("div");
  row.className = "count-row";
  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.step = "1";
  input.inputMode = "numeric";
  input.placeholder = "počet zrn";
  input.addEventListener("input", recalc);
  const del = document.createElement("button");
  del.type = "button";
  del.className = "btn-del";
  del.textContent = "✕";
  del.title = "Odebrat měření";
  del.addEventListener("click", () => {
    row.remove();
    recalc();
  });
  row.append(input, del);
  container.appendChild(row);
  input.focus();
}

function averageOf(container) {
  const vals = [...container.querySelectorAll("input")]
    .map((i) => parseFloat(i.value))
    .filter((v) => isFinite(v) && v >= 0);
  if (!vals.length) return { avg: 0, n: 0 };
  const sum = vals.reduce((a, b) => a + b, 0);
  return { avg: sum / vals.length, n: vals.length };
}

/* ---------- plocha rámečku ---------- */
function getArea() {
  const mode = document.querySelector("#areaMode .active").dataset.mode;
  if (mode === "area") {
    return parseFloat($("frameArea").value) || 0;
  }
  const w = (parseFloat($("frameW").value) || 0) / 100; // cm -> m
  const l = (parseFloat($("frameL").value) || 0) / 100;
  return w * l;
}

/* ---------- hlavní výpočet ----------
 * kg/ha = (zrn / plocha[m²]) * HTZ[g]/1000 [g/zrno] * 10000 [m²/ha] / 1000 [g->kg]
 */
function lossKgHa(grainsPerFrame, area, tgw) {
  if (!area || !tgw) return 0;
  const perM2 = grainsPerFrame / area;
  return (perM2 * (tgw / 1000) * 10000) / 1000; // kg/ha
}

function evaluate(percent) {
  if (percent == null || !isFinite(percent)) return null;
  if (percent < 1) return { cls: "good", text: "Výborné nastavení (< 1 % výnosu)" };
  if (percent < 2) return { cls: "ok", text: "Přijatelné ztráty (1–2 % výnosu)" };
  if (percent < 3) return { cls: "warn", text: "Zvýšené ztráty (2–3 %) – zvaž seřízení" };
  return { cls: "bad", text: "Vysoké ztráty (> 3 %) – seřiď kombajn" };
}

let lastResult = null;

function recalc() {
  const area = getArea();
  const tgw = parseFloat($("tgw").value) || 0;

  // info o ploše
  $("areaInfo").textContent = `${fmt(area, 3)} m²`;

  const total = averageOf($("totalCounts"));
  $("totalAvg").textContent = fmt(total.avg, 1);

  const headerOn = $("enableHeader").checked;
  const header = averageOf($("headerCounts"));
  $("headerAvg").textContent = fmt(header.avg, 1);

  const totalKg = lossKgHa(total.avg, area, tgw);
  const headerKg = lossKgHa(header.avg, area, tgw);
  const sepKg = Math.max(0, totalKg - headerKg);
  const perM2 = area ? total.avg / area : 0;

  const totalT = totalKg / 1000; // kg/ha -> t/ha
  $("rTotalKg").textContent = fmt(totalKg, 1);
  $("rTotalT").textContent = fmt(totalT, 3);
  $("rPerM2").textContent = fmt(perM2, 0);

  // finanční ztráta
  const price = parseFloat($("price").value); // Kč/t
  let moneyHa = null;
  const hasPrice = isFinite(price) && price > 0;
  $("boxMoney").classList.toggle("hidden", !hasPrice);
  if (hasPrice) {
    moneyHa = totalT * price; // Kč/ha
    $("rMoneyHa").textContent = fmt(moneyHa, 0);
  }

  // přepočet na celý pozemek
  const fieldHa = parseFloat($("fieldArea").value);
  const hasField = isFinite(fieldHa) && fieldHa > 0;
  $("boxField").classList.toggle("hidden", !hasField);
  let fieldT = null, fieldMoney = null;
  if (hasField) {
    fieldT = totalT * fieldHa; // t
    $("rFieldHa").textContent = fmt(fieldHa, fieldHa % 1 ? 1 : 0);
    $("rFieldT").textContent = fmt(fieldT, 2);
    $("rFieldMoney").textContent = hasPrice ? fmt(fieldT * price, 0) : "–";
    if (hasPrice) fieldMoney = fieldT * price;
  }

  // procenta z výnosu
  const yieldTha = parseFloat($("yield").value);
  let percent = null;
  if (isFinite(yieldTha) && yieldTha > 0) {
    const yieldKg = yieldTha * 1000; // t/ha -> kg/ha
    percent = (totalKg / (yieldKg + totalKg)) * 100;
    $("rTotalPerc").textContent = `${fmt(percent, 2)} %`;
  } else {
    $("rTotalPerc").textContent = "–";
  }

  // header / separace
  $("boxHeader").classList.toggle("hidden", !headerOn);
  $("boxSep").classList.toggle("hidden", !headerOn);
  if (headerOn) {
    $("rHeaderKg").textContent = fmt(headerKg, 1);
    $("rSepKg").textContent = fmt(sepKg, 1);
  }

  // hodnocení
  const v = $("verdict");
  if (total.n === 0) {
    v.className = "verdict";
    v.textContent = "Zadej počet spočítaných zrn pro výpočet.";
  } else if (percent != null) {
    const ev = evaluate(percent);
    v.className = `verdict ${ev.cls}`;
    v.textContent = ev.text;
  } else {
    v.className = "verdict ok";
    v.textContent = "Pro hodnocení v % zadej výnos plodiny.";
  }

  lastResult = {
    crop: cropById($("crop").value)?.name || "?",
    tgw, area, perM2,
    totalKg, totalT, headerKg: headerOn ? headerKg : null,
    sepKg: headerOn ? sepKg : null,
    percent, yieldTha: isFinite(yieldTha) ? yieldTha : null,
    moneyHa, fieldHa: hasField ? fieldHa : null, fieldT, fieldMoney,
    samples: total.n,
  };
}

/* ---------- historie (localStorage) ---------- */
function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}
function saveHistory(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function renderHistory() {
  const list = loadHistory();
  const el = $("history");
  $("clearHistory").classList.toggle("hidden", list.length === 0);
  if (!list.length) {
    el.innerHTML = '<p class="muted">Zatím žádná uložená měření.</p>';
    return;
  }
  el.innerHTML = "";
  list.forEach((r, idx) => {
    const item = document.createElement("div");
    item.className = "hist-item";
    const perc = r.percent != null ? ` · ${fmt(r.percent, 2)} %` : "";
    const money = r.moneyHa != null ? ` · ${fmt(r.moneyHa, 0)} Kč/ha` : "";
    item.innerHTML = `
      <div>
        <strong>${r.crop}</strong>
        <span class="muted"> ${r.date}</span><br />
        <span>${fmt(r.totalKg, 1)} kg/ha${perc}${money}</span>
      </div>`;
    const del = document.createElement("button");
    del.className = "btn-del";
    del.textContent = "✕";
    del.title = "Smazat záznam";
    del.addEventListener("click", () => {
      const l = loadHistory();
      l.splice(idx, 1);
      saveHistory(l);
      renderHistory();
    });
    item.appendChild(del);
    el.appendChild(item);
  });
}

function saveCurrent() {
  if (!lastResult || lastResult.samples === 0) {
    alert("Nejdřív zadej alespoň jedno měření zrn.");
    return;
  }
  const list = loadHistory();
  list.unshift({
    date: new Date().toLocaleString("cs-CZ"),
    crop: lastResult.crop,
    totalKg: lastResult.totalKg,
    percent: lastResult.percent,
    moneyHa: lastResult.moneyHa,
  });
  saveHistory(list.slice(0, 50));
  renderHistory();
}

/* ---------- události ---------- */
function bindEvents() {
  $("crop").addEventListener("change", () => {
    syncCropDefaults();
    recalc();
  });
  ["tgw", "frameW", "frameL", "frameArea", "yield", "price", "fieldArea"].forEach((id) =>
    $(id).addEventListener("input", recalc)
  );

  // přepínač způsobu zadání plochy
  document.querySelectorAll("#areaMode button").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll("#areaMode button").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      const dims = b.dataset.mode === "dims";
      $("dimsInputs").classList.toggle("hidden", !dims);
      $("areaInputs").classList.toggle("hidden", dims);
      recalc();
    });
  });

  $("addTotal").addEventListener("click", () => addCountRow($("totalCounts")));
  $("addHeader").addEventListener("click", () => addCountRow($("headerCounts")));

  $("enableHeader").addEventListener("change", (e) => {
    $("headerBlock").classList.toggle("hidden", !e.target.checked);
    if (e.target.checked && !$("headerCounts").children.length) {
      addCountRow($("headerCounts"));
    }
    recalc();
  });

  $("saveBtn").addEventListener("click", saveCurrent);
  $("clearHistory").addEventListener("click", () => {
    if (confirm("Opravdu smazat celou historii?")) {
      localStorage.removeItem(STORAGE_KEY);
      renderHistory();
    }
  });
}

/* ---------- start ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initCrops();
  bindEvents();
  addCountRow($("totalCounts"));
  renderHistory();
  recalc();
});
