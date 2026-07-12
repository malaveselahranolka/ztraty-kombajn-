# 🏋️ CHALK & IRON — editor carouselů

Webový **editor powerliftingových Instagram carouselů** postavený na design systému
**CHALK & IRON** (grafit, křídová bílá, soudcovská červená, mono „data rail", FA logo).

🔗 **Živá aplikace:** _(po zapnutí Pages)_ `https://<uživatel>.github.io/chalk-iron-editor/`

## Co to umí

- 🧱 **Skládání carouselu** ze slajdů — přidání, duplikace, mazání, přesun nahoru/dolů
- 🎞️ **7 typů slajdů:** Úvod / Cover · Glosář (víc pojmů) · Pojem · Text / Koncept · Velké číslo · Fakta · Závěr / CTA
- 👁️ **Živý náhled** ve skutečném rozlišení **1080 × 1350 px**
- 🔢 **Automatická počítadla** stránek (`0X / 0Y`) i skupin glosáře (`0A / 0B skupin`)
- ✍️ **Zvýraznění** přes `**text**` (tučně / červeně v nadpisech)
- ☀️/🌙 **Motiv** (světlý / tmavý) per slajd
- 🅵🅰 **Konfigurovatelné logo** vlevo dole (výchozí `FA`)
- 💾 **Autosave** do prohlížeče + export/import projektu jako **.json**
- 🖼️ **Export do PNG** (1×/2×/3×) jednotlivě nebo **všech slajdů do ZIP**

## Použití

Otevři živou aplikaci (nebo `index.html`). Vlevo je seznam slajdů, uprostřed náhled,
vpravo formulář vybraného slajdu. Edituj text, přidávej položky glosáře, přepínej motiv.
Až jsi hotový, klikni **⬇ Vše (ZIP)** a nahraj obrázky na Instagram.

Projekt startuje s ukázkovým slovníkem síly (6 slajdů) — přes **Výchozí** ho kdykoli obnovíš.

## Technologie

Čistý statický web (HTML + CSS + ES moduly), bez build kroku.
Export obrázků: [`html-to-image`](https://github.com/bubkoo/html-to-image) + [`JSZip`](https://stuk.github.io/jszip/) (z CDN).
Fonty: Archivo + IBM Plex Sans/Mono (Google Fonts).

## Nasazení (GitHub Pages)

Repozitář obsahuje workflow `.github/workflows/deploy-pages.yml`, který při pushi do
`main` nasadí celý kořen na GitHub Pages (Pages se zapnou automaticky).
V nastavení repa stačí mít **Settings → Pages → Source: GitHub Actions**.

## Struktura

```
index.html            – UI editoru
css/slides.css        – styly slajdů (náhled i export)
css/editor.css        – chrome editoru
js/templates.js       – typy slajdů (render + pole formuláře)
js/default-project.js – výchozí slovník
js/render.js          – vykreslení slajdu + výpočet počítadel
js/export.js          – export PNG / ZIP / JSON
js/app.js             – hlavní logika editoru
js/util.js            – pomocné funkce
```
