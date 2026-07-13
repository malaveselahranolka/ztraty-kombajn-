// Registr typů slajdů: render do HTML + definice polí pro formulář
import { escapeHtml as esc, md, pad2, ICON } from './util.js';

// **x** → červený highlight (pro nadpisy)
const hl = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<span class="hl">$1</span>');
// **x** → červené em (cover / cta titulky)
const em = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<em>$1</em>');

const BRAIN = `<svg class="brain-ico" viewBox="0 0 200 160" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M36 88 C 30 66 40 52 56 54 C 54 40 74 38 80 52 C 86 40 104 40 108 54 C 116 42 134 44 136 56 C 148 46 166 54 168 72 C 178 84 176 100 162 106 C 158 118 146 120 138 114 C 136 126 128 136 120 134 C 116 138 112 130 114 120 C 98 124 78 124 68 114 C 58 120 44 114 44 102 C 34 100 32 94 36 88 Z"/><path d="M58 72 C 70 76 70 90 58 94"/><path d="M84 64 C 96 70 94 86 82 90"/><path d="M110 66 C 124 72 122 90 108 94"/><path d="M140 74 C 152 82 148 96 136 98"/><path d="M92 100 C 106 104 108 118 96 120"/></svg>`;
const brand   = (ctx) => { const t = esc(ctx.logo || 'FA'); return `<div class="brand"><span class="brand-mark">${BRAIN}<span class="fa"><i>${t.slice(0, 1)}</i>${t.slice(1)}</span></span></div>`; };
const cTop    = (ctx) => `<span class="counter"><b>${pad2(ctx.page)}</b> / ${pad2(ctx.total)}</span>`;
const footClr = (ctx) => ctx.theme === 'dark' ? 'var(--steel-lt)' : 'var(--steel)';
const knurl   = () => `<div class="knurl"><div class="knurl-fill"></div></div>`;

export const TYPES = {
  cover: {
    label: 'Úvod / Cover', themed: false,
    make: () => ({ bg: '', eyebrow: 'Slovník · Základy', title: 'Slovník', titleEm: 'síly',
      sub: 'Zkratky a pojmy, co potkáš v každém plánu — vysvětlené česky. Ulož si a měj po ruce.', swipe: 'Swipe' }),
    fields: [
      { k: 'bg',      l: 'Pozadí (foto)', t: 'image' },
      { k: 'eyebrow', l: 'Štítek (eyebrow)', t: 'text' },
      { k: 'title',   l: 'Titulek (bílá část)', t: 'text' },
      { k: 'titleEm', l: 'Titulek (červená část)', t: 'text' },
      { k: 'sub',     l: 'Podtitulek', t: 'area' },
      { k: 'swipe',   l: 'Swipe text', t: 'text' },
    ],
    render: (s, ctx) => ({ cls: 's-cover', html: `
      ${s.bg ? `<div class="photo"><img src="${s.bg}" alt="" /></div><div class="tint"></div>` : `<div class="bg"></div>`}<div class="shade"></div>
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

  photo: {
    label: 'Foto (na pozadí)', themed: false,
    make: () => ({ bg: '', eyebrow: 'Technika · Dřep', title: 'Co hlídat', titleEm: 've dřepu',
      sub: 'Popisek přes fotku — drž ho krátký, ať je čitelný.' }),
    fields: [
      { k: 'bg',      l: 'Foto na pozadí', t: 'image' },
      { k: 'eyebrow', l: 'Štítek (eyebrow)', t: 'text' },
      { k: 'title',   l: 'Nadpis (bílá část)', t: 'text' },
      { k: 'titleEm', l: 'Nadpis (červená část)', t: 'text' },
      { k: 'sub',     l: 'Podtitulek', t: 'area' },
    ],
    render: (s, ctx) => ({ cls: 's-cover', html: `
      ${s.bg ? `<div class="photo"><img src="${s.bg}" alt="" /></div><div class="tint"></div>` : `<div class="bg"></div>`}<div class="shade"></div>
      <div class="cover-inner">
        <div class="cover-top">${brand(ctx)}${cTop(ctx)}</div>
        <div class="cover-body">
          <div class="eyebrow" style="color:#fff">${esc(s.eyebrow)}</div>
          <h2 class="cover-title" style="font-size:92px">${esc(s.title)}<em>${esc(s.titleEm)}</em></h2>
          ${s.sub ? `<p class="cover-sub">${esc(s.sub)}</p>` : ''}
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

  chart: {
    label: 'Graf (sloupce)', themed: true,
    make: () => ({ eyebrow: 'Data · Objem', title: 'Objem: hlavní vs. accessory',
      note: '// týdenní počet sérií na partii', footNote: 'série / týden', rows: [
        { label: 'Hlavní', value: '14', color: 'red' },
        { label: 'Accessory', value: '4', color: 'steel' },
        { label: '„Ideál"', value: '9', color: 'teal' },
      ] }),
    rows: { key: 'rows', cols: [
      { k: 'label', l: 'Popisek (pod sloupcem)' },
      { k: 'value', l: 'Hodnota (číslo)' },
      { k: 'color', l: 'Barva', type: 'select', options: [['red', 'červená'], ['steel', 'šedá'], ['teal', 'tyrkys'], ['sand', 'písková']] },
    ] },
    fields: [
      { k: 'eyebrow', l: 'Štítek', t: 'text' },
      { k: 'title',   l: 'Nadpis grafu', t: 'text' },
      { k: 'note',    l: 'Popisek (mono, // …)', t: 'text' },
      { k: 'footNote',l: 'Patička', t: 'text' },
    ],
    render: (s, ctx) => {
      const rows = (s.rows || []).slice(0, 7);
      const vals = rows.map(r => Math.max(0, parseFloat(String(r.value).replace(',', '.')) || 0));
      const maxV = Math.max(1, ...vals);
      const n = Math.max(1, rows.length);
      const x0 = 96, x1 = 900, baseY = 468, topY = 70;
      const step = (x1 - x0) / n, bw = Math.min(128, step * 0.62);
      const cmap = { red: '#D93A21', steel: '#6B7686', teal: '#3E8E9A', sand: '#C7A24B' };
      const xc = ctx.theme === 'dark' ? '#9AA3AE' : '#4A4F59';
      let bars = '', vlab = '', xlab = '';
      rows.forEach((r, i) => {
        const v = vals[i], h = (v / maxV) * (baseY - topY);
        const bx = x0 + i * step + (step - bw) / 2, col = cmap[r.color] || '#D93A21';
        bars += `<rect x="${bx.toFixed(0)}" y="${(baseY - h).toFixed(0)}" width="${bw.toFixed(0)}" height="${h.toFixed(0)}" rx="3" fill="${col}"/>`;
        vlab += `<text x="${(bx + bw / 2).toFixed(0)}" y="${(baseY - h - 16).toFixed(0)}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="27" font-weight="600" fill="${col}">${esc(r.value)}</text>`;
        xlab += `<text x="${(bx + bw / 2).toFixed(0)}" y="${(baseY + 36).toFixed(0)}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="22" fill="${xc}">${esc(r.label)}</text>`;
      });
      const grid = ctx.theme === 'dark' ? '#2C313B' : '#CFD2C9';
      const axis = ctx.theme === 'dark' ? '#ECEDE8' : '#14161B';
      return { cls: 's-' + ctx.theme, html: `
      ${knurl()}
      <div class="head-row"><div class="eyebrow">${esc(s.eyebrow)}</div>${cTop(ctx)}</div>
      <div class="chart-wrap">
        <h3 class="chart-title">${esc(s.title)}</h3>
        <p class="chart-note">${esc(s.note)}</p>
        <svg class="chart" viewBox="0 0 960 540" preserveAspectRatio="xMidYMid meet">
          <g stroke="${grid}" stroke-width="1"><line x1="96" y1="170" x2="900" y2="170"/><line x1="96" y1="270" x2="900" y2="270"/><line x1="96" y1="370" x2="900" y2="370"/></g>
          <line x1="96" y1="468" x2="900" y2="468" stroke="${axis}" stroke-width="2"/>
          <g>${bars}</g><g>${vlab}</g><g>${xlab}</g>
        </svg>
      </div>
      <div class="foot-row">${brand(ctx)}<span class="counter" style="color:${footClr(ctx)}">${esc(s.footNote)}</span></div>` };
    },
  },

  table: {
    label: 'Porovnání (A vs B)', themed: true,
    make: () => ({ eyebrow: 'Srovnání', title: 'Účelové **vs.** náhodné', crit: 'Kritérium',
      col1: 'Účelové', col2: 'Náhodné', footNote: '', rows: [
        { k: 'Výběr cviku', a: 'dle slabiny', b: 'dle nálady' },
        { k: 'Progrese', a: 'zapsaná', b: 'žádná' },
        { k: 'Objem', a: 'řízený', b: 'náhodný' },
        { k: 'Přenos na SBD', a: 'vysoký', b: 'nejistý' },
      ] }),
    rows: { key: 'rows', cols: [
      { k: 'k', l: 'Kritérium' },
      { k: 'a', l: 'Sloupec A' },
      { k: 'b', l: 'Sloupec B' },
    ] },
    fields: [
      { k: 'eyebrow', l: 'Štítek', t: 'text' },
      { k: 'title',   l: 'Nadpis (**červené**)', t: 'text' },
      { k: 'crit',    l: 'Záhlaví 1. sloupce', t: 'text' },
      { k: 'col1',    l: 'Záhlaví A (červené)', t: 'text' },
      { k: 'col2',    l: 'Záhlaví B', t: 'text' },
      { k: 'footNote',l: 'Patička', t: 'text' },
    ],
    render: (s, ctx) => {
      const body = (s.rows || []).map(r =>
        `<div class="crow"><span class="ck">${esc(r.k)}</span><span class="cv cv1">${esc(r.a)}</span><span class="cv cv2">${esc(r.b)}</span></div>`).join('');
      return { cls: 's-' + ctx.theme, html: `
      ${knurl()}
      <div class="head-row"><div class="eyebrow">${esc(s.eyebrow)}</div>${cTop(ctx)}</div>
      <h2 class="slide-h" style="font-size:70px; margin-top:34px">${hl(s.title)}</h2>
      <div class="ctable">
        <div class="crow chead"><span>${esc(s.crit)}</span><span class="c1">${esc(s.col1)}</span><span class="c2">${esc(s.col2)}</span></div>
        ${body}
      </div>
      <div class="foot-row">${brand(ctx)}<span class="counter" style="color:${footClr(ctx)}">${esc(s.footNote)}</span></div>` };
    },
  },

  steps: {
    label: 'Kroky / Důvody', themed: true,
    make: () => ({ eyebrow: '3 důvody', footNote: '', rows: [
      { h: 'Chybí cíl', b: 'Accessory se dělá „na pocit", ne proti konkrétní slabině.', m: 'cvik **bez důvodu** = ztracený objem' },
      { h: 'Neměří se', b: 'Žádná progrese ani zápis → nevíš, jestli to vůbec funguje.', m: 'bez **progrese** není adaptace' },
      { h: 'Krade regeneraci', b: 'Objem navíc bez plánu ubírá zdroje hlavním cvikům.', m: 'únava **předběhne** zisk' },
    ] }),
    rows: { key: 'rows', cols: [
      { k: 'h', l: 'Nadpis kroku' },
      { k: 'b', l: 'Text', area: true },
      { k: 'm', l: 'Detail (mono, **tučné**)' },
    ] },
    fields: [
      { k: 'eyebrow', l: 'Štítek', t: 'text' },
      { k: 'footNote',l: 'Patička', t: 'text' },
    ],
    render: (s, ctx) => {
      const items = (s.rows || []).map((r, i) =>
        `<div class="step"><div class="num">${i + 1}</div><div><h4 class="st-h">${esc(r.h)}</h4><p class="st-b">${esc(r.b)}</p>${r.m ? `<div class="st-m">${md(r.m)}</div>` : ''}</div></div>`).join('');
      return { cls: 's-' + ctx.theme, html: `
      <div class="head-row"><div class="eyebrow">${esc(s.eyebrow)}</div>${cTop(ctx)}</div>
      <div class="steps">${items}</div>
      <div class="foot-row">${brand(ctx)}<span class="counter" style="color:${footClr(ctx)}">${esc(s.footNote)}</span></div>` };
    },
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
