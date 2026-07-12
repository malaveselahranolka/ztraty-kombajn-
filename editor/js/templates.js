// Registr typů slajdů: render do HTML + definice polí pro formulář
import { escapeHtml as esc, md, pad2, ICON } from './util.js';

// **x** → červený highlight (pro nadpisy)
const hl = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<span class="hl">$1</span>');
// **x** → červené em (cover / cta titulky)
const em = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<em>$1</em>');

const brand   = (ctx) => { const t = esc(ctx.logo || 'FA'); return `<div class="brand"><span class="brand-mark"><i>${t.slice(0, 1)}</i>${t.slice(1)}</span></div>`; };
const cTop    = (ctx) => `<span class="counter"><b>${pad2(ctx.page)}</b> / ${pad2(ctx.total)}</span>`;
const footClr = (ctx) => ctx.theme === 'dark' ? 'var(--steel-lt)' : 'var(--steel)';
const knurl   = () => `<div class="knurl"><div class="knurl-fill"></div></div>`;

export const TYPES = {
  cover: {
    label: 'Úvod / Cover', themed: false,
    make: () => ({ eyebrow: 'Slovník · Základy', title: 'Slovník', titleEm: 'síly',
      sub: 'Zkratky a pojmy, co potkáš v každém plánu — vysvětlené česky. Ulož si a měj po ruce.', swipe: 'Swipe' }),
    fields: [
      { k: 'eyebrow', l: 'Štítek (eyebrow)', t: 'text' },
      { k: 'title',   l: 'Titulek (bílá část)', t: 'text' },
      { k: 'titleEm', l: 'Titulek (červená část)', t: 'text' },
      { k: 'sub',     l: 'Podtitulek', t: 'area' },
      { k: 'swipe',   l: 'Swipe text', t: 'text' },
    ],
    render: (s, ctx) => ({ cls: 's-cover', html: `
      <div class="bg"></div><div class="shade"></div>
      <div class="cover-inner">
        <div class="cover-top">${brand(ctx)}${cTop(ctx)}</div>
        <div class="cover-body">
          <div class="eyebrow">${esc(s.eyebrow)}</div>
          <h2 class="cover-title">${esc(s.title)}<em>${esc(s.titleEm)}</em></h2>
          <p class="cover-sub">${esc(s.sub)}</p>
          <div class="cover-foot"><span class="swipe">${esc(s.swipe)} ${ICON.swipe}</span></div>
        </div>
      </div>` }),
  },

  gloss: {
    label: 'Glosář (víc pojmů)', themed: true,
    make: () => ({ eyebrow: 'Intenzita & námaha', rows: [
      { abbr: 'RPE', def: 'rate of perceived exertion – **míra vnímaného úsilí na škále 1–10**.' },
      { abbr: 'RIR', def: 'reps in reserve – **počet opakování v rezervě**.' },
      { abbr: '1RM', def: 'one rep max – **maximum na jedno opakování.**' },
    ] }),
    rows: { key: 'rows', cols: [ { k: 'abbr', l: 'Zkratka' }, { k: 'def', l: 'Definice (**tučné**)', area: true } ] },
    fields: [ { k: 'eyebrow', l: 'Sekce (eyebrow)', t: 'text' } ],
    render: (s, ctx) => ({ cls: 's-' + ctx.theme, html: `
      ${knurl()}
      <div class="head-row"><div class="eyebrow">${esc(s.eyebrow)}</div>${cTop(ctx)}</div>
      <div class="gloss">
        ${(s.rows || []).map(r => `<div class="gloss-row"><div class="gloss-abbr">${esc(r.abbr)}</div><div class="gloss-def">${md(r.def)}</div></div>`).join('')}
      </div>
      <div class="foot-row">${brand(ctx)}<span class="counter" style="color:${footClr(ctx)}">${pad2(ctx.group)} / ${pad2(ctx.groupTotal)} skupin</span></div>` }),
  },

  term: {
    label: 'Pojem (jeden)', themed: true,
    make: () => ({ eyebrow: 'Zkratka', abbr: 'RPE', full: 'Rate of Perceived Exertion',
      def: 'Jak těžká byla série na škále 6–10. Deset = na maximum, nic v záloze.',
      egLabel: 'Příklad', eg: '@8 = zvládl bys ještě **2 opakování**.', footNote: 'míra námahy' }),
    fields: [
      { k: 'eyebrow', l: 'Štítek', t: 'text' },
      { k: 'abbr',    l: 'Zkratka (velká)', t: 'text' },
      { k: 'full',    l: 'Plný název', t: 'text' },
      { k: 'def',     l: 'Definice', t: 'area' },
      { k: 'egLabel', l: 'Popisek příkladu', t: 'text' },
      { k: 'eg',      l: 'Příklad (**tučné**)', t: 'area' },
      { k: 'footNote',l: 'Poznámka v patičce', t: 'text' },
    ],
    render: (s, ctx) => ({ cls: 's-' + ctx.theme, html: `
      ${knurl()}
      <div class="head-row"><div class="eyebrow">${esc(s.eyebrow)}</div>${cTop(ctx)}</div>
      <div class="term">
        <h2 class="term-abbr">${esc(s.abbr)}</h2>
        <div class="term-full">${esc(s.full)}</div>
        <p class="term-def">${md(s.def)}</p>
        ${s.eg ? `<div class="term-eg"><span class="k">${esc(s.egLabel)}</span>${md(s.eg)}</div>` : ''}
      </div>
      <div class="foot-row">${brand(ctx)}<span class="counter" style="color:${footClr(ctx)}">${esc(s.footNote)}</span></div>` }),
  },

  concept: {
    label: 'Text / Koncept', themed: true,
    make: () => ({ eyebrow: 'Co to je', title: 'Tělo se adaptuje jen na podnět, **který nezná.**',
      body: 'Když týdny zvedáš stejnou váhu za stejný počet opakování, sval nemá důvod sílit.',
      calloutK: 'Princip', calloutV: 'Stejný podnět = stejný výsledek.', footTag: 'Technika' }),
    fields: [
      { k: 'eyebrow',  l: 'Štítek', t: 'text' },
      { k: 'title',    l: 'Nadpis (**červené**)', t: 'area' },
      { k: 'body',     l: 'Text', t: 'area' },
      { k: 'calloutK', l: 'Callout — štítek', t: 'text' },
      { k: 'calloutV', l: 'Callout — text', t: 'text' },
      { k: 'footTag',  l: 'Patička — tag', t: 'text' },
    ],
    render: (s, ctx) => ({ cls: 's-' + ctx.theme, html: `
      ${knurl()}
      <div class="head-row"><div class="eyebrow">${esc(s.eyebrow)}</div>${cTop(ctx)}</div>
      <h2 class="slide-h">${hl(s.title)}</h2>
      <p class="body-copy">${esc(s.body)}</p>
      <div class="callout"><div class="k">${esc(s.calloutK)}</div><div class="v">${esc(s.calloutV)}</div></div>
      <div class="foot-row">${brand(ctx)}<div class="rail">${esc(s.footTag)}</div></div>` }),
  },

  stat: {
    label: 'Velké číslo', themed: true, defaultTheme: 'dark',
    make: () => ({ eyebrow: 'Kolik přidávat', num: '2–5', small: '%',
      label: 'o tolik zvyšuj týdenní objem, ne víc.',
      sub: '// Rychlejší nárůst = únava předběhne regeneraci.', footNote: 'objem = série × reps × kg' }),
    fields: [
      { k: 'eyebrow', l: 'Štítek', t: 'text' },
      { k: 'num',     l: 'Číslo', t: 'text' },
      { k: 'small',   l: 'Malý dovětek (%, ×…)', t: 'text' },
      { k: 'label',   l: 'Popisek', t: 'area' },
      { k: 'sub',     l: 'Poznámka', t: 'area' },
      { k: 'footNote',l: 'Patička', t: 'text' },
    ],
    render: (s, ctx) => ({ cls: 's-' + ctx.theme + ' s-stat', html: `
      ${knurl()}
      <div class="head-row" style="position:absolute; top:var(--pad); left:var(--pad); right:var(--pad);">
        <div class="eyebrow">${esc(s.eyebrow)}</div>${cTop(ctx)}</div>
      <div class="stat-num">${esc(s.num)}${s.small ? `<small>${esc(s.small)}</small>` : ''}</div>
      <div class="stat-label">${esc(s.label)}</div>
      <p class="stat-sub">${esc(s.sub)}</p>
      <div class="foot-row" style="position:absolute; bottom:var(--pad); left:var(--pad); right:var(--pad);">
        ${brand(ctx)}<span class="counter" style="color:${footClr(ctx)}">${esc(s.footNote)}</span></div>` }),
  },

  facts: {
    label: 'Fakta', themed: true,
    make: () => ({ eyebrow: 'Fakta · Objem', title: 'Co říká výzkum', rows: [
      { fv: '10–20', fvSmall: 'sérií / sval / týden', ft: 'Rozmezí, kde roste **většina lidí** nejlíp.' },
      { fv: '48 h',  fvSmall: 'minimální pauza', ft: 'Než stejnou svalovou skupinu zatížíš znovu **naplno**.' },
    ], footNote: 'zdroj: meta-analýzy' }),
    rows: { key: 'rows', cols: [ { k: 'fv', l: 'Číslo' }, { k: 'fvSmall', l: 'Popisek pod číslem' }, { k: 'ft', l: 'Text (**tučné**)', area: true } ] },
    fields: [
      { k: 'eyebrow', l: 'Štítek', t: 'text' },
      { k: 'title',   l: 'Nadpis', t: 'text' },
      { k: 'footNote',l: 'Patička', t: 'text' },
    ],
    render: (s, ctx) => ({ cls: 's-' + ctx.theme, html: `
      <div class="head-row"><div class="eyebrow">${esc(s.eyebrow)}</div>${cTop(ctx)}</div>
      <h2 class="slide-h" style="font-size:72px; margin-top:34px">${esc(s.title)}</h2>
      <div class="facts">
        ${(s.rows || []).map(r => `<div class="fact"><div class="fv">${esc(r.fv)}<small>${esc(r.fvSmall)}</small></div><div class="ft">${md(r.ft)}</div></div>`).join('')}
      </div>
      <div class="foot-row">${brand(ctx)}<span class="counter" style="color:${footClr(ctx)}">${esc(s.footNote)}</span></div>` }),
  },

  cta: {
    label: 'Závěr / CTA', themed: false,
    make: () => ({ eyebrow: 'Ulož si slovník', title: 'Žádná zkratka', titleEm: 'tě nepřekvapí.',
      primary: 'Ulož příspěvek', secondary: 'Sleduj profil', next: 'Chybí ti pojem? **Napiš do komentářů →**' }),
    fields: [
      { k: 'eyebrow',  l: 'Štítek', t: 'text' },
      { k: 'title',    l: 'Nadpis (bílá část)', t: 'text' },
      { k: 'titleEm',  l: 'Nadpis (červená část)', t: 'text' },
      { k: 'primary',  l: 'Tlačítko 1', t: 'text' },
      { k: 'secondary',l: 'Tlačítko 2', t: 'text' },
      { k: 'next',     l: 'Řádek dole (**tučné**)', t: 'area' },
    ],
    render: (s, ctx) => ({ cls: 's-dark', html: `
      <div class="head-row">${brand(ctx)}${cTop(ctx)}</div>
      <div class="cta-body">
        <div class="eyebrow" style="margin-bottom:26px">${esc(s.eyebrow)}</div>
        <h2 class="cta-h">${esc(s.title)} <em>${esc(s.titleEm)}</em></h2>
        <div class="cta-actions">
          <span class="pill pill-solid">${ICON.save} ${esc(s.primary)}</span>
          <span class="pill pill-ghost">${ICON.plus} ${esc(s.secondary)}</span>
        </div>
        <div class="cta-next">${md(s.next)}</div>
      </div>` }),
  },
};

// Vytvoří nový slajd daného typu
export function makeSlide(type) {
  const t = TYPES[type];
  return { id: 'sl_' + Math.random().toString(36).slice(2, 9), type,
    theme: t.defaultTheme || 'chalk', ...t.make() };
}
