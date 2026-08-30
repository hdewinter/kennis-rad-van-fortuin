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

> **Belangrijk voor beheer:** de huidige speel-versie (`rad-van-fortuin.jsx`)
> heeft de puzzels nog **inline** in de code staan (zelfde inhoud als
> `data/puzzles.json`), omdat het artifact geen bestanden kan inladen tijdens
> het testen in de chat. Zodra dit een echte web-app wordt (bijv. via Vite),
> laden we `data/puzzles.json` in plaats van de inline lijst — dan hoef je
> nog maar op één plek te bewerken.

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
- [ ] Testen/feedback vanuit de speler
- [ ] Eventueel: los data-bestand echt inladen (build-stap) i.p.v. inline lijst
- [ ] Eventueel: geluid bij draaien/bankroet/oplossen (zoals bij "Kennis op een Rij")

## Verwant project
Het bordspel "Kennis op een Rij" (4-op-een-rij met buzzer-quiz) is een apart
project — komt in een eigen repo zodra daarvoor een token beschikbaar is.
