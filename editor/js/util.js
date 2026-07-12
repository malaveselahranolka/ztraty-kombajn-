// Pomocné funkce
export const uid = () => 'sl_' + Math.random().toString(36).slice(2, 9);

export function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Text s **tučným** → bezpečné HTML (nejdřív escape, pak **…** → <b>)
export function md(s) {
  return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function el(tag, attrs = {}, children = []) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
    else if (v != null) n.setAttribute(k, v);
  }
  for (const c of [].concat(children)) if (c != null) n.append(c);
  return n;
}

export function pad2(n) { return String(n).padStart(2, '0'); }

export function download(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = el('div', { id: 'toast' }); document.body.append(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2200);
}

// SVG ikony
export const ICON = {
  swipe: '<svg viewBox="0 0 30 18" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 9h24M20 3l6 6-6 6"/></svg>',
  save:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>',
  plus:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
};

// Načte obrázek z file inputu, zmenší na maxW a zkomprimuje → data URL (JPEG).
// Drží velikost rozumnou pro localStorage i export.
export function readImageFile(file, maxW, quality, cb) {
  if (!file || !/^image\//.test(file.type)) { cb(null); return; }
  const rd = new FileReader();
  rd.onload = () => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      try { cb(c.toDataURL('image/jpeg', quality)); } catch { cb(null); }
    };
    img.onerror = () => cb(null);
    img.src = rd.result;
  };
  rd.onerror = () => cb(null);
  rd.readAsDataURL(file);
}
