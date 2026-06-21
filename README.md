# 🌾 Ztráty kombajnu

Webová aplikace pro **měření ztrát sklízecí mlátičky** (kombajnu) u **obilnin a olejnin** s přepočtem na **1 hektar**.

🔗 **Živá aplikace:** https://malaveselahranolka.github.io/ztraty-kombajn-/

Aplikace pomáhá agronomovi nebo obsluze kombajnu rychle v poli vyhodnotit, kolik
zrna padá za stroj, vyjádřit ztrátu v **kg/ha** i v **% z výnosu** a rozlišit,
zda ztráty vznikají na **žacím ústrojí** nebo při **mlácení a separaci**.

## Funkce

- 📋 Přednastavené plodiny s typickou **HTZ** (hmotnost tisíce zrn) – obiloviny i olejniny (řepka, slunečnice, mák, sója…)
- 📐 Zadání měřicí plochy buď **rozměry rámečku** (cm), nebo **plochou** (m²)
- 🔢 **Více měření** se automatickým průměrováním pro vyšší přesnost
- 🌱 Volitelné rozlišení **ztrát žacím ústrojím** vs. **celkových** → dopočet ztrát mlácením a separací
- 📊 Výsledek v **kg/ha**, **t/ha**, **zrn/m²** a **% z výnosu**
- 💰 **Finanční ztráta** v Kč/ha podle výkupní ceny + přepočet na **celý pozemek** (t a Kč)
- ✅ Slovní **hodnocení** (výborné / přijatelné / zvýšené / vysoké ztráty)
- 💾 **Historie měření** uložená lokálně v prohlížeči
- 📱 Funguje **offline**, optimalizováno pro mobil

## Jak měřit

1. Za jízdy kombajnu polož na zem rámeček o známé ploše (doporučeno **0,5 × 0,5 m = 0,25 m²**) tam, kam dopadají ztráty.
2. Spočítej všechna celá vypadlá zrna v rámečku. Měření **3–5× zopakuj** na různých místech.
3. Zadej **HTZ** dané plodiny (uprav podle rozboru – zásadní zejména u řepky).
4. Volitelně zadej **výnos** pro vyjádření ztráty v procentech.

## Výpočet

```
zrn/m²              = počet zrn ÷ plocha rámečku [m²]
ztráta [kg/ha]      = zrn/m² × HTZ[g] ÷ 1000 × 10 000 ÷ 1000
ztráta [%]          = ztráta[kg/ha] ÷ (výnos[kg/ha] + ztráta[kg/ha]) × 100
finanční [Kč/ha]    = ztráta[kg/ha] ÷ 1000 × cena[Kč/t]
ztráta za pozemek   = finanční[Kč/ha] × výměra[ha]
```

Kde `HTZ ÷ 1000` je hmotnost jednoho zrna v gramech a `10 000` je počet m² v hektaru.

> **Orientační hodnocení:** u obilovin se za přijatelné považují celkové ztráty
> přibližně do **1 % výnosu**, nad ~3 % je vhodné kombajn seřídit. U olejnin
> (zejména řepky) je nutné ztráty sledovat obzvlášť pečlivě kvůli velmi nízké HTZ.

## Spuštění

Není potřeba žádný build ani server. Stačí otevřít `index.html` v prohlížeči:

```bash
# lokálně přes jednoduchý server (volitelné)
python3 -m http.server 8000
# pak otevři http://localhost:8000
```

Případně nasaď přes **GitHub Pages** (Settings → Pages → branch `main`, root).

## Struktura

```
index.html      – struktura aplikace
css/style.css   – vzhled (mobile-first)
js/crops.js     – seznam plodin a přednastavené HTZ
js/app.js       – logika výpočtu, historie, interakce
```

## Poznámka

Přednastavené hodnoty HTZ jsou orientační průměry. Pro přesné výsledky vždy
použij HTZ z laboratorního rozboru konkrétní partie a měření dostatečně opakuj.
