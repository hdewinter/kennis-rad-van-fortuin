# Rad van Fortuin — Kennis & Gezegden

Los spel/app, apart van "Kennis op een Rij". Voor 1-4 spelers.

## Kernidee
Klassiek Wheel-of-Fortune-format: draai aan het rad voor een puntenwaarde,
kies daarna een letter via het toetsenbord. Staat de letter in de zin? Dan
wordt hij onthuld en krijg je punten (waarde × aantal keer voorkomend), en
mag je opnieuw draaien. Je mag op elk moment i.p.v. draaien de hele zin
proberen op te lossen voor de ronde-winst.

## Rad-segmenten
16 vakken: puntenwaardes (200–1000) + 3 specials (geen Bankroet — bewust
verwijderd, te frustrerend voor een familiespel):
- **Verdubbelaar (x2)** — speler wint een verdubbelaar-token (stapelbaar).
  Mag op elk gewenst moment ingezet worden vóór het kiezen van een letter
  (bv. bij een letter die je vaak verwacht, zoals de E) — punten van die
  letter tellen dan dubbel. Wordt alleen verbruikt bij een score (mis =
  token blijft behouden). Dezelfde speler mag na het winnen opnieuw draaien.
- **Beurt kwijt** — beurt gaat direct door, geen letter kiezen.
- **Gratis letter** — een willekeurige nog-verborgen letter wordt gratis
  onthuld, dezelfde speler mag opnieuw draaien.

## Puzzel-database
Zie `data/puzzles.json` — dit is de leesbare/uitbreidbare bron. Velden:
`id`, `category` (gezegde / filmtitel / liedtitel / zin / vraag), `age`
(kind / jongvolwassen / volwassen_makkelijk / volwassen_moeilijk), optioneel
`prompt` (bij category "vraag"), en `text` (de te raden zin/het antwoord).

Bij spelstart kies je welke niveaus meedoen (chips aan/uit). De categorie
"vraag" hergebruikt het idee van de vragenbank uit "Kennis op een Rij":
`prompt` toont de vraag, `text` is het antwoord dat op het bord verschijnt.

> **Belangrijk voor beheer:** de code (`rad-van-fortuin.jsx`) heeft de
> puzzels nog **inline** staan (zelfde inhoud als `data/puzzles.json`) als
> terugval, omdat het Claude-artifact bij het testen in de chat geen losse
> bestanden kan inladen. De gedeployde web-app (GitHub Pages) laadt bij de
> eerste start wél echt `data/puzzles.json` in — daarna staat de database
> in de browser-opslag en bewerk je verder via het instellingenmenu.

## Scoring
- Score per speler is cumulatief over alle puzzels in het spel.
- Puzzel oplossen (zelf typen of laatste letter onthult alles) geeft een
  vaste bonus van 500 punten aan de speler die aan zet was.
- Kinderniveau (`age: "kind"`) bestaat uit simpele losse woordjes, geen
  lange zinnen — expliciete eis, zie `data/puzzles.json`.

## Instellingen (tandwiel-knop, altijd zichtbaar)
- **Spelbeheer**: "Ander woord" (huidige puzzel overslaan zonder score-impact)
  en "Spel opnieuw starten" (terug naar startscherm).
- **Niveaus**: aan/uit per leeftijdscategorie.
- **Categorieën**: blader door de hele database (ingebouwd + eigen
  puzzels — het is nu allemaal één en dezelfde, volledig bewerkbare lijst),
  filter op categorie, bewerk of verwijder losse puzzels inline.
- **Puzzel toevoegen**: los, als kwismaster — vrije categorie-tekst (Film,
  Muziek, Sport, ...), leeftijdsniveau, optionele hint/vraag, en het
  antwoord. Wordt bewaard via de persistente artifact-storage (blijft ook
  bij een volgende sessie beschikbaar).
- **Bulk (CSV)**: plak meerdere regels `categorie,leeftijd,tekst,vraag`
  tegelijk in; wordt geparsed en toegevoegd aan dezelfde database.
- **Handleiding**: korte spelregels in het Nederlands, direct in de app.

## Feedback bij een foute letter
Korte "splash"-melding in beeld (~1,2s, pop/fade-animatie): `"X" staat niet
op de kaart`, los van de permanente statusregel onder het bord.

## Status
- [x] Opzet gedeeld en afgestemd in gesprek
- [x] Eerste speelbare versie gebouwd (`rad-van-fortuin.jsx`)
- [x] Voorbeeld-database met 36 puzzels (9 per niveau, verdeeld over categorieën)
- [x] Live web-app op GitHub Pages: https://hdewinter.github.io/kennis-rad-van-fortuin/
- [x] `data/puzzles.json` wordt op de live site echt ingeladen (build via esbuild, broncode in `src/` op de `gh-pages`-branch is niet nodig — het gebundelde resultaat staat daar)
- [x] Rad is 3D (perspectief-tilt, kegelverloop per vak, metalen rand met bouten) en heeft lampjes die chasen tijdens het draaien en fel oplichten op het gewonnen vak, net als een echt rad
- [ ] Testen/feedback vanuit de speler
- [ ] Eventueel: geluid bij draaien/bankroet/oplossen (zoals bij "Kennis op een Rij")

## Deployment
- **Live site**: https://hdewinter.github.io/kennis-rad-van-fortuin/ (GitHub Pages,
  branch `gh-pages`, gebundeld met esbuild — React + lucide-react + de app
  in één `bundle.js`, plus `index.html` en `data/puzzles.json`)
- **Broncode**: staat op `main` (`rad-van-fortuin.jsx` + `data/puzzles.json`);
  dit is ook de versie die je als Claude-artifact in de chat kunt testen
- Buiten een Claude-artifact bestaat `window.storage` niet — de gebundelde
  site bevat daarom een kleine shim die dezelfde API aanbiedt maar alles in
  `localStorage` van de browser bewaart (per toestel)
- Om de live site opnieuw te bouwen na een wijziging in `rad-van-fortuin.jsx`:
  bundel met esbuild (React + react-dom + lucide-react als dependencies) naar
  `bundle.js`, kopieer `data/puzzles.json` mee, en push die drie bestanden
  (`index.html`, `bundle.js`, `data/puzzles.json`) naar de `gh-pages`-branch

## Verwant project
Het bordspel "Kennis op een Rij" (4-op-een-rij met buzzer-quiz) is een apart
project — komt in een eigen repo zodra daarvoor een token beschikbaar is.
