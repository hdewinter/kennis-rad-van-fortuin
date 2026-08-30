# Kennis Rad van Fortuin

Wheel-of-Fortune-stijl woord-/kennisspel voor 1-4 spelers, gebouwd als React
(Claude-artifact) spel. Zie `DESIGN.md` voor de volledige opzet en
spelregels, en `data/puzzles.json` voor de (uitbreidbare) puzzel-database.

## Live spelen
https://hdewinter.github.io/kennis-rad-van-fortuin/

## Bestanden
- `rad-van-fortuin.jsx` — de broncode (React component, single-file) —
  test 'm ook als Claude-artifact in de chat
- `DESIGN.md` — opzet, spelregels, scoring, deployment, openstaande punten
- `data/puzzles.json` — leesbare puzzel-database (bron van waarheid; wordt
  door de live site echt ingeladen, `.jsx` heeft dezelfde data ook inline
  als terugval voor gebruik in een Claude-artifact)

## Verdergaan in een nieuwe chat
Geef Claude de link naar deze repo (of plak de inhoud van `DESIGN.md`) om
verder te bouwen zonder de context kwijt te raken. Openstaande punten staan
onderaan `DESIGN.md`.
