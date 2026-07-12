// Výchozí projekt = slovník síly (6 slajdů), stejný obsah jako v artefaktu.
export const DEFAULT_PROJECT = {
  title: 'Slovník síly',
  logo: 'FA',
  slides: [
    { id: 'sl_cover', type: 'cover', theme: 'chalk',
      eyebrow: 'Slovník · Základy', title: 'Slovník', titleEm: 'síly',
      sub: 'Zkratky a pojmy, co potkáš v každém tréninkovém plánu — vysvětlené česky. Ulož si a měj po ruce.',
      swipe: 'Swipe' },

    { id: 'sl_int', type: 'gloss', theme: 'chalk', eyebrow: 'Intenzita & námaha', rows: [
      { abbr: 'RPE',   def: 'rate of perceived exertion – **míra vnímaného úsilí na škále 1–10** (RPE 10 = maximální úsilí, RPE 6 = nižší úsilí).' },
      { abbr: 'RIR',   def: 'reps in reserve – **počet opakování v rezervě** (RIR 0 = 0 v rezervě, RIR 2 = 2 v rezervě atd.).' },
      { abbr: '1RM',   def: 'one rep max – **maximum na jedno opakování.**' },
      { abbr: 'e1RM',  def: 'estimated one rep max – **odhad 1RM** z lehčí série na základě **opakování a RPE** (100 kg 5× RPE 10 = cca 115 kg).' },
      { abbr: 'TM',    def: 'training max – **tréninkové maximum.**' },
      { abbr: 'AMRAP', def: 'as many reps as possible – **co nejvíce opakování** do svalového/technického **selhání.**' },
    ] },

    { id: 'sl_plan1', type: 'gloss', theme: 'dark', eyebrow: 'Plán', rows: [
      { abbr: 'BB',        def: 'barbell – **dlouhá osa.**' },
      { abbr: 'DB',        def: 'dumbbell – **jednoručka.**' },
      { abbr: 'Frekvence', def: '**frekvence zatížení** na **partii/sval** během jednoho **týdne.**' },
      { abbr: 'SBD',       def: 'squat, bench, deadlift – **dřep, bench, mrtvý tah.**' },
      { abbr: 'ROM',       def: 'range of motion – **rozsah pohybu.**' },
      { abbr: 'Tempo',     def: '**rychlost** provedení **cviku** v **určité fáze pohybu** udávané v x-x-x (například na benchi 1-3-1 excentrická spodní fáze, delší pauza a normální koncentrická fáze).' },
    ] },

    { id: 'sl_plan2', type: 'gloss', theme: 'chalk', eyebrow: 'Plán', rows: [
      { abbr: 'Makrocyklus', def: '**dlouhodobý plán**, obvykle na **6-12 měsíců.**' },
      { abbr: 'Mezocyklus',  def: '**středně dlouhá fáze** plánu **3-8 týdnů** (nejčastěji 4) s **konkrétním cílem** (peaking, budování objemu atd.).' },
      { abbr: 'Mikrocyklus', def: '**nejkratší** plánovací **jednotka**, zpravidla **1 týden** obsahující **jednotlivé tréninky** (SBD dny, doplňkové dny atd.).' },
      { abbr: 'Deload',      def: '**období** (nejčastěji 1 týden) **snížené tréninkové zátěže**, jehož **cílem** je **snížení akumulované únavy** z předešlých tréninků. Jsou 2 typy – **plánovaný** a **autoregulační** (dle potřeby).' },
      { abbr: 'TS',          def: 'top set – **nejtěžší** plánovaná **série tréninku.**' },
      { abbr: 'BO / BOS',    def: 'back-off set/s – **lehčí pracovní série** s cílem **přidání** kvalitního tréninkového **objemu** při **menší únavě.**' },
    ] },

    { id: 'sl_ost', type: 'gloss', theme: 'dark', eyebrow: 'Ostatní', rows: [
      { abbr: 'BW',     def: 'body weight – **tělesná hmotnost.**' },
      { abbr: 'DOTS',   def: 'bodový systém pro **porovnání výkonů** napříč hmotnostními **kategoriemi.**' },
      { abbr: 'PR',     def: 'personal record – **osobní rekord.**' },
      { abbr: 'DUP',    def: 'Daily Undulating Periodization.' },
      { abbr: 'IPF GL', def: '**IPF** bodový systém **pro porovnání výkonů** napříč hmotnostními **kategoriemi.**' },
      { abbr: 'LP',     def: 'lineární periodizace.' },
    ] },

    { id: 'sl_cta', type: 'cta', theme: 'dark',
      eyebrow: 'Ulož si slovník', title: 'Žádná zkratka', titleEm: 'tě nepřekvapí.',
      primary: 'Ulož příspěvek', secondary: 'Sleduj profil',
      next: 'Chybí ti pojem? **Napiš do komentářů — doplním →**' },
  ],
};
