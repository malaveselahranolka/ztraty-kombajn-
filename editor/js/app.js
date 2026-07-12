import { TYPES, makeSlide } from './templates.js';
import { renderSlideElement } from './render.js';
import { DEFAULT_PROJECT } from './default-project.js';
import { exportSlide, exportAll, exportJSON, importJSON } from './export.js';
import { $, el, toast, pad2, readImageFile } from './util.js';

const LS = 'chalkiron:project';
let project = load();
let sel = 0;
let scale = 2; // export pixelRatio

function load() {
  try { const p = JSON.parse(localStorage.getItem(LS)); if (p && Array.isArray(p.slides) && p.slides.length) return p; }
  catch {}
  return structuredClone(DEFAULT_PROJECT);
}
let saveT;
function save() {
  clearTimeout(saveT);
  saveT = setTimeout(() => {
    try { localStorage.setItem(LS, JSON.stringify(project)); }
    catch { toast('Úložiště je plné — fotky se neuloží mezi sezeními. Exportuj projekt do .json.'); }
  }, 250);
}

/* ---------------- scaled mount ---------------- */
function mount(container, node, targetW, targetH = 1350) {
  const k = targetW / 1080;
  container.style.width = targetW + 'px';
  container.style.height = (targetH * k) + 'px';
  const wrap = el('div', { class: 'scaler' });
  wrap.style.transform = `scale(${k})`;
  wrap.append(node);
  container.innerHTML = ''; container.append(wrap);
}

/* ---------------- LEFT: slide list ---------------- */
function renderList() {
  const list = $('#slideList'); list.innerHTML = '';
  project.slides.forEach((s, i) => {
    const item = el('div', { class: 'slide-item' + (i === sel ? ' sel' : ''), onclick: () => selectSlide(i) });
    const thumb = el('div', { class: 'thumb' });
    item.append(thumb);
    item.append(el('div', { class: 'meta' }, [
      el('span', { class: 'ix' }, pad2(i + 1)),
      el('span', { class: 'ty' }, TYPES[s.type].label.split(' ')[0]),
    ]));
    const btns = el('div', { class: 'row-btns' });
    btns.append(mkBtn('↑', e => { e.stopPropagation(); move(i, -1); }));
    btns.append(mkBtn('↓', e => { e.stopPropagation(); move(i, 1); }));
    btns.append(mkBtn('⧉', e => { e.stopPropagation(); duplicate(i); }));  // duplikovat
    btns.append(mkBtn('✕', e => { e.stopPropagation(); removeSlide(i); }));
    item.append(btns);
    list.append(item);
    // thumbnail render
    const w = thumb.clientWidth || 200;
    mount(thumb, renderSlideElement(project, i), w);
  });
}
function mkBtn(txt, on) { const b = el('button', { onclick: on }); b.textContent = txt; b.title = txt; return b; }

function refreshThumb(i) {
  const item = $$('#slideList .slide-item')[i];
  if (!item) return;
  const thumb = item.querySelector('.thumb');
  mount(thumb, renderSlideElement(project, i), thumb.clientWidth || 200);
}
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------------- CENTER: preview ---------------- */
const isMobile = () => window.matchMedia('(max-width: 860px)').matches;

function renderPreview() {
  const stage = $('#stage'), wrap = $('#preview');
  const availW = stage.clientWidth - (isMobile() ? 28 : 60);
  let k;
  if (isMobile()) {
    k = Math.min(availW / 1080, 0.62);                       // na mobilu podle šířky
  } else {
    const availH = stage.clientHeight - 60;
    k = Math.min(availW / 1080, availH / 1350, 0.62);
  }
  if (!(k > 0)) k = 0.3;
  mount(wrap, renderSlideElement(project, sel), 1080 * k);
}

/* ---------------- mobile tabs ---------------- */
let tab = 'prev';
function setTab(t) {
  tab = t;
  $('.workspace').className = 'workspace tab-' + t;
  document.querySelectorAll('#mobtabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
  requestAnimationFrame(() => { if (t === 'prev') renderPreview(); if (t === 'list') renderList(); });
}

/* ---------------- RIGHT: form ---------------- */
function renderForm() {
  const f = $('#form'); f.innerHTML = '';
  const s = project.slides[sel];
  if (!s) { f.innerHTML = '<div class="empty">Žádný slajd.<br>Přidej slajd vlevo.</div>'; return; }
  const def = TYPES[s.type];

  f.append(el('div', { class: 'form-head' }, [
    el('h2', {}, def.label),
    el('span', { class: 'ix', style: 'font-family:IBM Plex Mono,monospace;font-size:12px;color:var(--steel)' }, `#${pad2(sel + 1)}`),
  ]));

  // theme toggle
  if (def.themed) {
    const seg = el('div', { class: 'seg full' });
    ['chalk', 'dark'].forEach(th => {
      const b = el('button', { class: (s.theme || 'chalk') === th ? 'on' : '', onclick: () => { s.theme = th; softAll(); } });
      b.textContent = th === 'chalk' ? '☀ Světlý' : '🌙 Tmavý';
      seg.append(b);
    });
    f.append(el('div', { class: 'field' }, [el('label', {}, 'Motiv'), seg]));
  }

  // simple fields
  (def.fields || []).forEach(fl => {
    const wrap = el('div', { class: 'field' });
    wrap.append(el('label', {}, fl.l));
    if (fl.t === 'image') { wrap.append(imageField(s, fl)); f.append(wrap); return; }
    const inp = fl.t === 'area' ? el('textarea') : el('input', { type: 'text' });
    inp.value = s[fl.k] ?? '';
    inp.addEventListener('input', () => { s[fl.k] = inp.value; softAll(); });
    wrap.append(inp);
    f.append(wrap);
  });

  // rows editor
  if (def.rows) f.append(rowsEditor(s, def.rows));

  f.append(el('div', { class: 'hint', style: 'margin-top:18px' },
    [document.createTextNode('Tip: '), codeSpan('**text**'), document.createTextNode(' = tučně / zvýrazněno.')]));
}
function codeSpan(t) { const c = el('code'); c.textContent = t; return c; }

function imageField(s, fl) {
  const box = el('div');
  const has = !!s[fl.k];
  if (has) {
    const prev = el('div', { class: 'img-prev' });
    prev.style.backgroundImage = `url("${s[fl.k]}")`;
    box.append(prev);
  }
  const pick = el('label', { class: 'btn btn-sm', style: 'cursor:pointer;margin-right:8px' });
  pick.textContent = has ? 'Změnit foto' : '⬆ Nahrát foto';
  const inp = el('input', { type: 'file', accept: 'image/*', style: 'display:none' });
  inp.addEventListener('change', e => {
    const file = e.target.files[0]; if (!file) return;
    pick.textContent = 'Načítám…';
    readImageFile(file, 1280, 0.82, url => {
      if (url) { s[fl.k] = url; renderForm(); softAll(); }
      else { toast('Nešlo načíst obrázek'); pick.textContent = has ? 'Změnit foto' : '⬆ Nahrát foto'; }
    });
    e.target.value = '';
  });
  pick.append(inp); box.append(pick);
  if (has) {
    const rm = el('button', { class: 'btn btn-sm ghost', onclick: () => { delete s[fl.k]; renderForm(); softAll(); } });
    rm.textContent = 'Odebrat';
    box.append(rm);
  }
  return box;
}

function rowsEditor(s, spec) {
  const wrap = el('div', { class: 'field' });
  wrap.append(el('label', {}, 'Položky'));
  const box = el('div', { class: 'rows-editor' });
  const rows = s[spec.key] || (s[spec.key] = []);
  rows.forEach((r, ri) => {
    const card = el('div', { class: 'row-card' });
    const top = el('div', { class: 'rc-top' });
    const first = spec.cols[0];
    const fi = el('input', { type: 'text', placeholder: first.l });
    fi.value = r[first.k] ?? ''; fi.addEventListener('input', () => { r[first.k] = fi.value; softAll(); });
    top.append(fi);
    const del = el('button', { class: 'rc-del', onclick: () => { rows.splice(ri, 1); renderForm(); softAll(); } }); del.textContent = '✕';
    top.append(del);
    card.append(top);
    spec.cols.slice(1).forEach(col => {
      const c = col.area ? el('textarea', { placeholder: col.l }) : el('input', { type: 'text', placeholder: col.l });
      c.value = r[col.k] ?? ''; c.addEventListener('input', () => { r[col.k] = c.value; softAll(); });
      card.append(c);
    });
    const mv = el('div', { class: 'rc-move' });
    mv.append(mkBtn('↑', () => { if (ri > 0) { [rows[ri - 1], rows[ri]] = [rows[ri], rows[ri - 1]]; renderForm(); softAll(); } }));
    mv.append(mkBtn('↓', () => { if (ri < rows.length - 1) { [rows[ri + 1], rows[ri]] = [rows[ri], rows[ri + 1]]; renderForm(); softAll(); } }));
    card.append(mv);
    box.append(card);
  });
  const add = el('button', { class: 'add-row', onclick: () => { rows.push(Object.fromEntries(spec.cols.map(c => [c.k, '']))); renderForm(); softAll(); } });
  add.textContent = '+ Přidat položku';
  box.append(add);
  wrap.append(box);
  return wrap;
}

/* ---------------- actions ---------------- */
function selectSlide(i) { sel = i; renderList(); renderPreview(); renderForm(); if (isMobile()) setTab('edit'); }
function softAll() { renderPreview(); refreshThumb(sel); save(); }

function move(i, d) {
  const j = i + d; if (j < 0 || j >= project.slides.length) return;
  [project.slides[i], project.slides[j]] = [project.slides[j], project.slides[i]];
  if (sel === i) sel = j; else if (sel === j) sel = i;
  renderList(); renderPreview(); renderForm(); save();
}
function duplicate(i) {
  const copy = structuredClone(project.slides[i]); copy.id = 'sl_' + Math.random().toString(36).slice(2, 9);
  project.slides.splice(i + 1, 0, copy); sel = i + 1;
  renderList(); renderPreview(); renderForm(); save();
}
function removeSlide(i) {
  if (project.slides.length <= 1) { toast('Musí zůstat aspoň 1 slajd'); return; }
  project.slides.splice(i, 1); if (sel >= project.slides.length) sel = project.slides.length - 1;
  renderList(); renderPreview(); renderForm(); save();
}
function addSlide(type) {
  project.slides.splice(sel + 1, 0, makeSlide(type)); sel += 1;
  renderList(); renderPreview(); renderForm(); save();
  const m = document.getElementById('addMenu'); if (m) m.style.display = 'none';
}

/* ---------------- topbar wiring ---------------- */
function initTopbar() {
  const t = $('#projTitle'); t.value = project.title || '';
  t.addEventListener('input', () => { project.title = t.value; save(); });
  const lg = $('#projLogo'); lg.value = project.logo || 'FA';
  lg.addEventListener('input', () => { project.logo = lg.value || 'FA'; renderList(); renderPreview(); save(); });

  // add menu (přes style.display — inline display:flex by přebilo [hidden])
  const menu = $('#addMenu');
  menu.style.display = 'none';
  Object.entries(TYPES).forEach(([k, v]) => {
    const b = el('button', { class: 'btn btn-sm', onclick: () => addSlide(k) }); b.textContent = v.label;
    menu.append(b);
  });
  $('#btnAdd').addEventListener('click', e => {
    e.stopPropagation();
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
  });
  document.addEventListener('click', e => { if (!e.target.closest('#addWrap')) menu.style.display = 'none'; });

  $('#btnPng').addEventListener('click', () => exportSlide(project, sel, scale));
  $('#btnZip').addEventListener('click', async () => {
    const b = $('#btnZip'); const old = b.textContent; b.disabled = true;
    await exportAll(project, scale, (i, n) => { b.textContent = `Export ${i}/${n}…`; });
    b.textContent = old; b.disabled = false;
  });
  $('#btnSaveJson').addEventListener('click', () => exportJSON(project));
  $('#fileJson').addEventListener('change', e => {
    const file = e.target.files[0]; if (!file) return;
    importJSON(file, p => { project = p; sel = 0; initTopbar(); renderAll(); save(); });
    e.target.value = '';
  });
  $('#btnReset').addEventListener('click', () => {
    if (!confirm('Načíst výchozí slovník a zahodit aktuální projekt?')) return;
    project = structuredClone(DEFAULT_PROJECT); sel = 0; $('#projTitle').value = project.title; $('#projLogo').value = project.logo;
    renderAll(); save();
  });

  const seg = $('#scaleSeg');
  seg.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    seg.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on');
    scale = Number(b.dataset.s);
  }));

  document.querySelectorAll('#mobtabs button').forEach(b =>
    b.addEventListener('click', () => setTab(b.dataset.tab)));
}

function renderAll() { renderList(); renderPreview(); renderForm(); }

/* ---------------- boot ---------------- */
let rzT;
window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(() => { renderList(); renderPreview(); }, 150); });
document.fonts.ready.then(() => { renderList(); renderPreview(); });
initTopbar();
renderAll();
setTab('prev');
