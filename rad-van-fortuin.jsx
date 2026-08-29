import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Trophy, RotateCcw, Sparkles, Check, X, Shuffle } from "lucide-react";

// ============================================================
// PUZZEL-DATABASE — vul dit gerust aan met eigen zinnen.
// category: "gezegde" | "filmtitel" | "liedtitel" | "zin" | "vraag"
// age:      "kind" | "jongvolwassen" | "volwassen_makkelijk" | "volwassen_moeilijk"
// prompt:   optioneel — alleen gebruikt bij category "vraag" (de vraag zelf)
// text:     de zin/het antwoord dat geraden moet worden (hoofdletters)
// ============================================================
const PUZZLES = [
  // --- kind ---
  { id: "p1", category: "gezegde", age: "kind", text: "BETER LAAT DAN NOOIT" },
  { id: "p2", category: "gezegde", age: "kind", text: "DE VROEGE VOGEL VANGT DE WORM" },
  { id: "p3", category: "gezegde", age: "kind", text: "AL DOENDE LEERT MEN" },
  { id: "p4", category: "filmtitel", age: "kind", text: "DE LEEUWENKONING" },
  { id: "p5", category: "filmtitel", age: "kind", text: "TOY STORY" },
  { id: "p6", category: "filmtitel", age: "kind", text: "FROZEN" },
  { id: "p7", category: "liedtitel", age: "kind", text: "IN DE MANESCHIJN" },
  { id: "p8", category: "zin", age: "kind", text: "OEFENING BAART KUNST" },
  { id: "p33", category: "vraag", age: "kind", prompt: "Hoe heet de baby van een hond?", text: "PUPPY" },

  // --- jongvolwassen ---
  { id: "p9", category: "gezegde", age: "jongvolwassen", text: "APPELS MET PEREN VERGELIJKEN" },
  { id: "p10", category: "gezegde", age: "jongvolwassen", text: "EEN KAT IN DE ZAK KOPEN" },
  { id: "p11", category: "gezegde", age: "jongvolwassen", text: "OP EIEREN LOPEN" },
  { id: "p12", category: "filmtitel", age: "jongvolwassen", text: "HARRY POTTER" },
  { id: "p13", category: "filmtitel", age: "jongvolwassen", text: "JURASSIC PARK" },
  { id: "p14", category: "liedtitel", age: "jongvolwassen", text: "RADIO GAGA" },
  { id: "p15", category: "liedtitel", age: "jongvolwassen", text: "ZOUTELANDE" },
  { id: "p16", category: "zin", age: "jongvolwassen", text: "STILLE WATEREN HEBBEN DIEPE GRONDEN" },
  { id: "p34", category: "vraag", age: "jongvolwassen", prompt: "Wat is de hoofdstad van Spanje?", text: "MADRID" },

  // --- volwassen_makkelijk ---
  { id: "p17", category: "gezegde", age: "volwassen_makkelijk", text: "VAN DE REGEN IN DE DROP" },
  { id: "p18", category: "gezegde", age: "volwassen_makkelijk", text: "MET DE DEUR IN HUIS VALLEN" },
  { id: "p19", category: "gezegde", age: "volwassen_makkelijk", text: "BOTER BIJ DE VIS" },
  { id: "p20", category: "filmtitel", age: "volwassen_makkelijk", text: "ZWARTBOEK" },
  { id: "p21", category: "filmtitel", age: "volwassen_makkelijk", text: "SOOF" },
  { id: "p22", category: "liedtitel", age: "volwassen_makkelijk", text: "VLIEGER" },
  { id: "p23", category: "zin", age: "volwassen_makkelijk", text: "WIE KAATST MOET DE BAL VERWACHTEN" },
  { id: "p24", category: "zin", age: "volwassen_makkelijk", text: "HOOGMOED KOMT VOOR DE VAL" },
  { id: "p35", category: "vraag", age: "volwassen_makkelijk", prompt: "Welk element heeft chemisch symbool Au?", text: "GOUD" },

  // --- volwassen_moeilijk ---
  { id: "p25", category: "gezegde", age: "volwassen_moeilijk", text: "DE KOGEL IS DOOR DE KERK" },
  { id: "p26", category: "gezegde", age: "volwassen_moeilijk", text: "IEMAND EEN HAK ZETTEN" },
  { id: "p27", category: "gezegde", age: "volwassen_moeilijk", text: "OP GROTE VOET LEVEN" },
  { id: "p28", category: "gezegde", age: "volwassen_moeilijk", text: "HET ONDERSTE UIT DE KAN WILLEN" },
  { id: "p29", category: "filmtitel", age: "volwassen_moeilijk", text: "THE GODFATHER" },
  { id: "p30", category: "filmtitel", age: "volwassen_moeilijk", text: "TITANIC" },
  { id: "p31", category: "liedtitel", age: "volwassen_moeilijk", text: "BLOED ZWEET EN TRANEN" },
  { id: "p32", category: "zin", age: "volwassen_moeilijk", text: "DE KOEK IS OP" },
  { id: "p36", category: "vraag", age: "volwassen_moeilijk", prompt: "Wie schreef de roman '1984'?", text: "GEORGE ORWELL" },
];

const AGE_LABEL = {
  kind: "Kinderen",
  jongvolwassen: "Jongvolwassenen",
  volwassen_makkelijk: "Volwassenen (makkelijk)",
  volwassen_moeilijk: "Volwassenen (moeilijk)",
};
const CATEGORY_LABEL = {
  gezegde: "Gezegde",
  filmtitel: "Filmtitel",
  liedtitel: "Liedtitel",
  zin: "Bekende zin",
  vraag: "Kennisvraag",
};

// ============================================================
// RAD-SEGMENTEN
// ============================================================
const WHEEL_SEGMENTS = [
  { type: "points", value: 300 },
  { type: "points", value: 500 },
  { type: "points", value: 200 },
  { type: "special", value: "BANKROET" },
  { type: "points", value: 400 },
  { type: "points", value: 600 },
  { type: "points", value: 250 },
  { type: "special", value: "BEURT_KWIJT" },
  { type: "points", value: 800 },
  { type: "points", value: 350 },
  { type: "points", value: 1000 },
  { type: "special", value: "GRATIS_LETTER" },
  { type: "points", value: 450 },
  { type: "points", value: 700 },
  { type: "points", value: 300 },
  { type: "points", value: 550 },
];
const POINT_COLORS = ["#F2B705", "#E85D75", "#22D3C7", "#9B7BF2"];
const SPECIAL_COLOR = { BANKROET: "#14171F", BEURT_KWIJT: "#5A6088", GRATIS_LETTER: "#2ECC71" };
const SPECIAL_LABEL = { BANKROET: "BANKROET", BEURT_KWIJT: "BEURT KWIJT", GRATIS_LETTER: "GRATIS LETTER" };

function segColor(seg, i) {
  if (seg.type === "special") return SPECIAL_COLOR[seg.value];
  return POINT_COLORS[i % POINT_COLORS.length];
}
function segLabel(seg) {
  return seg.type === "special" ? SPECIAL_LABEL[seg.value] : String(seg.value);
}

const PLAYER_COLORS = ["#F2B705", "#22D3C7", "#E85D75", "#9B7BF2"];
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const SOLVE_BONUS = 500;
const FREE_LETTER_LABEL = "Gratis letter!";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function normalize(str) {
  return str
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}
function shade(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// --- Geluid (Web Audio, geen externe bestanden nodig) ---
let sharedAudioCtx = null;
function getAudioCtx() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!sharedAudioCtx) sharedAudioCtx = new Ctx();
    if (sharedAudioCtx.state === "suspended") sharedAudioCtx.resume();
    return sharedAudioCtx;
  } catch (e) {
    return null;
  }
}
function playClick(volume = 0.18) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(1200, now);
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.07);
}
function playLandChime() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now + i * 0.05);
    gain.gain.linearRampToValueAtTime(0.22, now + i * 0.05 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + i * 0.05);
    osc.stop(now + i * 0.05 + 0.55);
  });
}
function playCorrectBlip() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(660, now);
  osc.frequency.exponentialRampToValueAtTime(990, now + 0.15);
  gain.gain.setValueAtTime(0.22, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.22);
}
function playWrongBuzz() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(160, now);
  osc.frequency.exponentialRampToValueAtTime(90, now + 0.3);
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.34);
}
// Plant klik-momenten die uitdoven zoals een echt rad met pinnetjes (snel -> langzaam)
function scheduleSpinClicks(durationMs) {
  const ticks = 26;
  for (let i = 0; i < ticks; i++) {
    const t = i / (ticks - 1);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic, zelfde gevoel als de rad-animatie
    const delay = eased * durationMs;
    setTimeout(() => playClick(), delay);
  }
}
function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function slicesPath(cx, cy, r, startAngle, endAngle) {
  const start = polar(cx, cy, r, endAngle);
  const end = polar(cx, cy, r, startAngle);
  const large = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y} Z`;
}

// ============================================================
// APP
// ============================================================
export default function RadVanFortuin() {
  const [screen, setScreen] = useState("start"); // start | wheel | guessing | solving | round-end | game-end
  const [numPlayers, setNumPlayers] = useState(2);
  const [names, setNames] = useState({ 0: "", 1: "", 2: "", 3: "" });
  const [ageFilter, setAgeFilter] = useState({
    kind: true,
    jongvolwassen: true,
    volwassen_makkelijk: true,
    volwassen_moeilijk: true,
  });

  const [players, setPlayers] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [queue, setQueue] = useState([]);
  const [puzzle, setPuzzle] = useState(null);
  const [revealed, setRevealed] = useState(new Set());
  const [usedLetters, setUsedLetters] = useState(new Set());
  const [wheelDeg, setWheelDeg] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [pendingValue, setPendingValue] = useState(null);
  const [message, setMessage] = useState("");
  const [solveInput, setSolveInput] = useState("");
  const [roundWinnerIdx, setRoundWinnerIdx] = useState(null);
  const [freeLetterFlash, setFreeLetterFlash] = useState(null);

  const spinResultRef = useRef(null);

  const puzzleAlphaSet = useMemo(() => {
    if (!puzzle) return new Set();
    return new Set(puzzle.text.toUpperCase().split("").filter((ch) => /[A-Z]/.test(ch)));
  }, [puzzle]);

  const isFullyRevealed = useMemo(() => {
    if (!puzzle) return false;
    for (const ch of puzzleAlphaSet) if (!revealed.has(ch)) return false;
    return true;
  }, [puzzle, puzzleAlphaSet, revealed]);

  const toggleAge = (key) => setAgeFilter((f) => ({ ...f, [key]: !f[key] }));

  const buildQueue = useCallback(() => {
    const active = Object.entries(ageFilter).filter(([, v]) => v).map(([k]) => k);
    const pool = active.length ? PUZZLES.filter((p) => active.includes(p.age)) : PUZZLES;
    return shuffle(pool.length ? pool : PUZZLES);
  }, [ageFilter]);

  const loadPuzzle = useCallback((q) => {
    let list = q;
    if (list.length === 0) list = buildQueue();
    const next = list[0];
    setQueue(list.slice(1));
    setPuzzle(next);
    setRevealed(new Set());
    setUsedLetters(new Set());
    setRoundWinnerIdx(null);
  }, [buildQueue]);

  const startGame = () => {
    const ps = Array.from({ length: numPlayers }, (_, i) => ({
      id: i,
      name: (names[i] && names[i].trim()) || `Speler ${i + 1}`,
      color: PLAYER_COLORS[i],
      total: 0,
      puzzleScore: 0,
    }));
    setPlayers(ps);
    setCurrentIdx(0);
    const q = buildQueue();
    loadPuzzle(q);
    setMessage("");
    setScreen("wheel");
  };

  const advanceTurn = () => setCurrentIdx((i) => (i + 1) % players.length);

  const finishRound = (winnerIdx, bonus) => {
    setPlayers((ps) =>
      ps.map((p, i) => (i === winnerIdx ? { ...p, total: p.total + bonus, puzzleScore: 0 } : { ...p, puzzleScore: 0 }))
    );
    setRevealed(new Set(puzzleAlphaSet));
    setRoundWinnerIdx(winnerIdx);
    setScreen("round-end");
  };

  const spin = () => {
    if (spinning || screen !== "wheel") return;
    setSpinning(true);
    setMessage("");
    const idx = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    spinResultRef.current = idx;
    const span = 360 / WHEEL_SEGMENTS.length;
    const midAngle = idx * span + span / 2;
    const targetMod = (360 - midAngle + 360) % 360;
    const curMod = ((wheelDeg % 360) + 360) % 360;
    const extra = (targetMod - curMod + 360) % 360;
    const newDeg = wheelDeg + 5 * 360 + extra;
    setWheelDeg(newDeg);
    scheduleSpinClicks(4000);
    setTimeout(() => {
      setSpinning(false);
      playLandChime();
      const seg = WHEEL_SEGMENTS[spinResultRef.current];
      handleSpinResult(seg);
    }, 4000);
  };

  const handleSpinResult = (seg) => {
    if (seg.type === "points") {
      setPendingValue(seg.value);
      setScreen("guessing");
      return;
    }
    if (seg.value === "BANKROET") {
      playWrongBuzz();
      setPlayers((ps) => ps.map((p, i) => (i === currentIdx ? { ...p, total: p.total - p.puzzleScore, puzzleScore: 0 } : p)));
      setMessage(`Bankroet! ${players[currentIdx]?.name} verliest de punten van deze puzzel.`);
      advanceTurn();
      return;
    }
    if (seg.value === "BEURT_KWIJT") {
      setMessage(`Beurt kwijt voor ${players[currentIdx]?.name}.`);
      advanceTurn();
      return;
    }
    if (seg.value === "GRATIS_LETTER") {
      const hidden = [...puzzleAlphaSet].filter((ch) => !revealed.has(ch));
      if (hidden.length === 0) {
        setMessage("Geen verborgen letters meer — spin opnieuw!");
        return;
      }
      const free = hidden[Math.floor(Math.random() * hidden.length)];
      const nextRevealed = new Set(revealed);
      nextRevealed.add(free);
      setRevealed(nextRevealed);
      setFreeLetterFlash(free);
      setTimeout(() => setFreeLetterFlash(null), 1200);
      setMessage(`${FREE_LETTER_LABEL} de letter "${free}" is onthuld.`);
      const stillHidden = [...puzzleAlphaSet].some((ch) => !nextRevealed.has(ch));
      if (!stillHidden) finishRound(currentIdx, SOLVE_BONUS);
      return;
    }
  };

  const guessLetter = (letter) => {
    if (screen !== "guessing" || usedLetters.has(letter)) return;
    const nextUsed = new Set(usedLetters);
    nextUsed.add(letter);
    setUsedLetters(nextUsed);
    const count = puzzle.text.toUpperCase().split("").filter((ch) => ch === letter).length;
    if (count > 0) {
      playCorrectBlip();
      const points = pendingValue * count;
      setPlayers((ps) => ps.map((p, i) => (i === currentIdx ? { ...p, total: p.total + points, puzzleScore: p.puzzleScore + points } : p)));
      const nextRevealed = new Set(revealed);
      nextRevealed.add(letter);
      setRevealed(nextRevealed);
      setMessage(`Juist! "${letter}" komt ${count}x voor — +${points} punten.`);
      const stillHidden = [...puzzleAlphaSet].some((ch) => !nextRevealed.has(ch));
      if (!stillHidden) {
        finishRound(currentIdx, SOLVE_BONUS);
      } else {
        setScreen("wheel");
      }
    } else {
      playWrongBuzz();
      setMessage(`"${letter}" komt niet voor. Beurt gaat naar de volgende speler.`);
      advanceTurn();
      setScreen("wheel");
    }
  };

  useEffect(() => {
    if (screen !== "guessing") return;
    const handler = (e) => {
      const k = e.key.toUpperCase();
      if (ALPHABET.includes(k)) guessLetter(k);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screen, usedLetters, revealed, pendingValue, currentIdx, puzzle]); // eslint-disable-line

  const openSolve = () => {
    setSolveInput("");
    setScreen("solving");
  };

  const submitSolve = () => {
    const guess = normalize(solveInput);
    const target = normalize(puzzle.text);
    if (guess.length > 0 && guess === target) {
      playLandChime();
      finishRound(currentIdx, SOLVE_BONUS);
    } else {
      playWrongBuzz();
      setMessage(`Helaas, dat is niet juist. Beurt gaat naar de volgende speler.`);
      advanceTurn();
      setScreen("wheel");
    }
  };

  const nextPuzzle = () => {
    setMessage("");
    loadPuzzle(queue);
    setScreen("wheel");
  };

  const endGame = () => setScreen("game-end");

  const winnerFinal = useMemo(() => {
    if (players.length === 0) return null;
    return players.reduce((best, p) => (p.total > best.total ? p : best), players[0]);
  }, [players]);

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tileIn { 0% { transform: scale(0.4) rotate(-8deg); opacity: 0; } 70% { transform: scale(1.12) rotate(3deg); opacity: 1; } 100% { transform: scale(1) rotate(0); } }
        @keyframes freeLetterGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(46,204,113,0.6);} 50% { box-shadow: 0 0 0 10px rgba(46,204,113,0);} }
        @keyframes pulseBorder { 0%,100% { box-shadow: 0 0 18px rgba(242,183,5,0.5);} 50% { box-shadow: 0 0 30px rgba(242,183,5,0.9);} }
        * { box-sizing: border-box; }
        .key-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.15); }
        .key-btn { transition: transform 0.1s ease, filter 0.1s ease; }
        .spin-btn:active:not(:disabled) { transform: scale(0.95); }
        .age-chip { transition: all 0.15s ease; cursor: pointer; }
      `}</style>

      {screen === "start" && (
        <div style={styles.startWrap}>
          <div style={styles.eyebrow}>WOORD- EN KENNISSPEL</div>
          <h1 style={styles.title}>Rad van Fortuin</h1>
          <p style={styles.subtitle}>
            Draai aan het rad voor punten, kies een letter en raad de zin. Los 'm helemaal op voor de ronde-winst. 1 tot 4 spelers.
          </p>

          <div style={styles.sectionLabel}>Aantal spelers</div>
          <div style={styles.playerCountRow}>
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setNumPlayers(n)}
                style={{
                  ...styles.countBtn,
                  background: numPlayers === n ? "#F2B705" : "transparent",
                  color: numPlayers === n ? "#141B2E" : "#F5F3EA",
                  borderColor: "#F2B705",
                }}
              >
                {n}
              </button>
            ))}
          </div>

          <div style={styles.nameGrid}>
            {Array.from({ length: numPlayers }).map((_, i) => (
              <div key={i} style={styles.nameInputWrap}>
                <label style={{ ...styles.nameLabel, color: PLAYER_COLORS[i] }}>Naam speler {i + 1}</label>
                <input
                  className="name-input"
                  style={{ ...styles.nameInput, borderColor: PLAYER_COLORS[i] }}
                  placeholder={`Speler ${i + 1}`}
                  value={names[i]}
                  maxLength={16}
                  onChange={(e) => setNames((n) => ({ ...n, [i]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <div style={styles.sectionLabel}>Niveaus</div>
          <div style={styles.ageRow}>
            {Object.keys(AGE_LABEL).map((key) => (
              <div
                key={key}
                className="age-chip"
                onClick={() => toggleAge(key)}
                style={{
                  ...styles.ageChip,
                  background: ageFilter[key] ? "rgba(242,183,5,0.2)" : "rgba(139,147,196,0.08)",
                  borderColor: ageFilter[key] ? "#F2B705" : "rgba(139,147,196,0.3)",
                  color: ageFilter[key] ? "#F2B705" : "#9BA1C9",
                }}
              >
                {AGE_LABEL[key]}
              </div>
            ))}
          </div>

          <button style={styles.primaryBtn} onClick={startGame}>
            <Sparkles size={18} style={{ marginRight: 8 }} />
            Start het spel
          </button>
        </div>
      )}

      {screen !== "start" && puzzle && (
        <div style={styles.gameWrap}>
          <div style={styles.scoreRow}>
            {players.map((p, i) => (
              <div
                key={p.id}
                style={{
                  ...styles.scoreCard,
                  borderColor: i === currentIdx ? p.color : "rgba(139,147,196,0.25)",
                  boxShadow: i === currentIdx ? `0 0 20px ${p.color}88` : "none",
                }}
              >
                <div style={{ ...styles.scoreName, color: p.color }}>{p.name}</div>
                <div style={styles.scoreValue}>{p.total}</div>
              </div>
            ))}
          </div>

          <div style={styles.categoryBadge}>{CATEGORY_LABEL[puzzle.category]}</div>
          {puzzle.category === "vraag" && <div style={styles.promptText}>{puzzle.prompt}</div>}

          <div style={styles.board}>
            {puzzle.text.split(" ").map((word, wi) => (
              <div key={wi} style={styles.wordGroup}>
                {word.split("").map((ch, ci) => {
                  const isAlpha = /[A-Z]/i.test(ch);
                  const shown = !isAlpha || revealed.has(ch.toUpperCase());
                  const justFreed = freeLetterFlash === ch.toUpperCase();
                  return (
                    <div
                      key={ci}
                      style={{
                        ...styles.tile,
                        background: shown
                          ? "linear-gradient(160deg, #FBF7E8, #ECE2C0)"
                          : "radial-gradient(circle at 30% 22%, rgba(255,255,255,0.18), transparent 55%), repeating-linear-gradient(45deg, #1B8874 0px, #1B8874 5px, #11604E 5px, #11604E 10px)",
                        border: shown ? "2px solid #C9BD8F" : "2px solid #0A2A22",
                        animation: shown && isAlpha ? "tileIn 0.35s ease-out" : justFreed ? "freeLetterGlow 1.2s ease-in-out" : "none",
                      }}
                    >
                      {shown ? ch : ""}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {message && <div style={styles.messageBar}>{message}</div>}

          {screen === "wheel" && (
            <div style={styles.wheelArea}>
              <Wheel deg={wheelDeg} spinning={spinning} />
              <div style={styles.wheelControls}>
                <button className="spin-btn" style={styles.spinBtn} disabled={spinning} onClick={spin}>
                  <Shuffle size={18} style={{ marginRight: 8 }} />
                  {spinning ? "Rad draait..." : `${players[currentIdx]?.name} draait`}
                </button>
                <button style={styles.solveBtn} disabled={spinning} onClick={openSolve}>
                  Zin oplossen
                </button>
              </div>
            </div>
          )}

          {screen === "guessing" && (
            <div style={styles.guessArea}>
              <div style={{ ...styles.guessValue, color: PLAYER_COLORS[currentIdx] }}>
                {players[currentIdx]?.name} kiest een letter voor {pendingValue} punten
              </div>
              <div style={styles.keyboard}>
                {ALPHABET.map((letter) => (
                  <button
                    key={letter}
                    className="key-btn"
                    disabled={usedLetters.has(letter)}
                    onClick={() => guessLetter(letter)}
                    style={{
                      ...styles.keyBtn,
                      opacity: usedLetters.has(letter) ? 0.25 : 1,
                      cursor: usedLetters.has(letter) ? "not-allowed" : "pointer",
                    }}
                  >
                    {letter}
                  </button>
                ))}
              </div>
              <button style={styles.solveBtn} onClick={openSolve}>
                Zin oplossen
              </button>
            </div>
          )}

          {screen === "solving" && (
            <div style={styles.solveOverlay}>
              <div style={styles.solveCard}>
                <div style={{ ...styles.guessValue, color: PLAYER_COLORS[currentIdx] }}>
                  {players[currentIdx]?.name}, wat is de volledige zin?
                </div>
                <input
                  autoFocus
                  style={styles.solveInput}
                  value={solveInput}
                  onChange={(e) => setSolveInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitSolve()}
                  placeholder="Typ hier je antwoord..."
                />
                <div style={styles.solveButtonRow}>
                  <button style={{ ...styles.primaryBtn, background: "#2ECC71" }} onClick={submitSolve}>
                    <Check size={18} style={{ marginRight: 8 }} />
                    Bevestigen
                  </button>
                  <button style={styles.cancelBtn} onClick={() => setScreen("wheel")}>
                    <X size={18} style={{ marginRight: 8 }} />
                    Annuleren
                  </button>
                </div>
              </div>
            </div>
          )}

          {screen === "round-end" && (
            <div style={styles.roundEndPanel}>
              <Trophy size={32} color={PLAYER_COLORS[roundWinnerIdx]} />
              <div style={{ ...styles.roundEndTitle, color: PLAYER_COLORS[roundWinnerIdx] }}>
                {players[roundWinnerIdx]?.name} wint deze puzzel! (+{SOLVE_BONUS})
              </div>
              <div style={styles.roundEndButtons}>
                <button style={styles.primaryBtn} onClick={nextPuzzle}>
                  Volgende puzzel →
                </button>
                <button style={styles.cancelBtn} onClick={endGame}>
                  Spel beëindigen
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {screen === "game-end" && (
        <div style={styles.overlay}>
          <div style={styles.gameoverCard}>
            <Trophy size={44} color={winnerFinal?.color} style={{ marginBottom: 8 }} />
            <div style={{ ...styles.gameoverEyebrow, color: winnerFinal?.color }}>EINDWINNAAR</div>
            <h2 style={{ ...styles.gameoverTitle, color: winnerFinal?.color }}>{winnerFinal?.name}</h2>
            <div style={styles.finalScores}>
              {[...players]
                .sort((a, b) => b.total - a.total)
                .map((p) => (
                  <div key={p.id} style={{ ...styles.finalScoreRow, color: p.color }}>
                    <span>{p.name}</span>
                    <span>{p.total} punten</span>
                  </div>
                ))}
            </div>
            <button style={styles.primaryBtn} onClick={() => setScreen("start")}>
              <RotateCcw size={18} style={{ marginRight: 8 }} />
              Nieuw spel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Wheel({ deg, spinning }) {
  const cx = 150, cy = 150, r = 145;
  const span = 360 / WHEEL_SEGMENTS.length;
  return (
    <div style={styles.wheelWrap}>
      <div style={styles.wheelPointer} />
      <svg
        viewBox="0 0 300 300"
        style={{
          width: "min(70vw, 340px)",
          height: "min(70vw, 340px)",
          transform: `rotate(${deg}deg)`,
          transition: spinning ? "transform 4s cubic-bezier(0.15, 0.85, 0.25, 1)" : "none",
        }}
      >
        <circle cx={cx} cy={cy} r={r + 6} fill="#141B4D" stroke="#F2B705" strokeWidth="4" />
        {WHEEL_SEGMENTS.map((seg, i) => {
          const start = i * span, end = (i + 1) * span, mid = start + span / 2;
          const labelPos = polar(cx, cy, r * 0.68, mid);
          return (
            <g key={i}>
              <path d={slicesPath(cx, cy, r, start, end)} fill={segColor(seg, i)} stroke="#0B1130" strokeWidth="1.5" />
              <text
                x={labelPos.x}
                y={labelPos.y}
                fill={seg.type === "special" ? "#fff" : "#141B2E"}
                fontSize={seg.type === "special" ? 10 : 15}
                fontWeight="800"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${mid} ${labelPos.x} ${labelPos.y})`}
                fontFamily="'Courier New', monospace"
              >
                {segLabel(seg)}
              </text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={22} fill="#F2B705" stroke="#141B2E" strokeWidth="3" />
      </svg>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================
const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "radial-gradient(ellipse at 50% 0%, rgba(242,183,5,0.08), transparent 55%), #0B1130",
    color: "#F5F3EA",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: "clamp(10px, 2vh, 24px) clamp(10px, 3vw, 32px)",
  },
  startWrap: { maxWidth: 640, margin: "0 auto", textAlign: "center" },
  eyebrow: { fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: "0.25em", color: "#F2B705", marginBottom: 10 },
  title: { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 38, margin: "0 0 14px" },
  subtitle: { fontSize: 15, color: "#D8DCF2", lineHeight: 1.5, marginBottom: 24 },
  sectionLabel: { fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: "0.1em", color: "#9BA1C9", margin: "18px 0 10px" },
  playerCountRow: { display: "flex", justifyContent: "center", gap: 10, marginBottom: 8 },
  countBtn: { width: 44, height: 44, borderRadius: 12, border: "1.5px solid", fontWeight: 800, fontSize: 16, cursor: "pointer" },
  nameGrid: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, marginTop: 14 },
  nameInputWrap: { display: "flex", flexDirection: "column", gap: 6, textAlign: "left" },
  nameLabel: { fontFamily: "'Courier New', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" },
  nameInput: { background: "rgba(20,27,77,0.6)", border: "1.5px solid", borderRadius: 10, padding: "10px 14px", fontSize: 15, color: "#F5F3EA", outline: "none", width: 160, fontFamily: "inherit" },
  ageRow: { display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 },
  ageChip: { border: "1.5px solid", borderRadius: 999, padding: "8px 16px", fontSize: 13, fontWeight: 700 },
  primaryBtn: { display: "inline-flex", alignItems: "center", background: "#F2B705", color: "#141B2E", border: "none", borderRadius: 999, padding: "14px 28px", fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 24 },
  cancelBtn: { display: "inline-flex", alignItems: "center", background: "transparent", color: "#D8DCF2", border: "1.5px solid rgba(139,147,196,0.4)", borderRadius: 999, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" },

  gameWrap: { maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 },
  scoreRow: { display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", width: "100%" },
  scoreCard: { border: "1.5px solid", borderRadius: 14, padding: "8px 16px", background: "rgba(20,27,77,0.6)", textAlign: "center", minWidth: 100, transition: "box-shadow 0.3s ease" },
  scoreName: { fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 12 },
  scoreValue: { fontSize: 20, fontWeight: 800 },

  categoryBadge: { fontFamily: "'Courier New', monospace", fontSize: 12, letterSpacing: "0.15em", color: "#F2B705", border: "1px solid #F2B705", borderRadius: 999, padding: "4px 14px" },
  promptText: { fontFamily: "Georgia, serif", fontSize: "clamp(15px, 2vw, 19px)", color: "#F5F3EA", textAlign: "center", maxWidth: 700 },

  board: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "clamp(10px, 2vw, 20px)",
    background: "linear-gradient(155deg, #1B2461, #0D1338)",
    border: "3px solid #F2B705",
    borderRadius: 20,
    padding: "clamp(16px, 2.4vw, 28px)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.08)",
  },
  wordGroup: { display: "flex", gap: "clamp(3px, 0.6vw, 6px)" },
  tile: {
    width: "clamp(26px, 4.6vw, 40px)",
    height: "clamp(32px, 5.8vw, 48px)",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "clamp(15px, 2.5vw, 21px)",
    color: "#141B2E",
    boxShadow: "0 3px 5px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
  },

  messageBar: { fontFamily: "'Courier New', monospace", fontSize: 13, color: "#F2B705", textAlign: "center", minHeight: 18 },

  wheelArea: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16 },
  wheelWrap: { position: "relative", display: "flex", justifyContent: "center" },
  wheelPointer: { position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderTop: "22px solid #F2B705", zIndex: 5, filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.5))" },
  wheelControls: { display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" },
  spinBtn: { display: "flex", alignItems: "center", background: "#F2B705", color: "#141B2E", border: "none", borderRadius: 999, padding: "14px 26px", fontSize: 15, fontWeight: 800, cursor: "pointer" },
  solveBtn: { display: "flex", alignItems: "center", background: "transparent", color: "#22D3C7", border: "1.5px solid #22D3C7", borderRadius: 999, padding: "14px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" },

  guessArea: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" },
  guessValue: { fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 15, textAlign: "center" },
  keyboard: { display: "grid", gridTemplateColumns: "repeat(9, minmax(0,1fr))", gap: 8, maxWidth: 480 },
  keyBtn: { width: "clamp(30px, 6vw, 42px)", height: "clamp(30px, 6vw, 42px)", borderRadius: 8, border: "none", background: "#22D3C7", color: "#141B2E", fontWeight: 800, fontSize: 15 },

  solveOverlay: { position: "fixed", inset: 0, background: "rgba(6,9,28,0.94)", backdropFilter: "blur(4px)", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease-out" },
  solveCard: { background: "rgba(20,27,77,0.95)", border: "1px solid rgba(242,183,5,0.3)", borderRadius: 20, padding: "clamp(20px, 3vw, 36px)", maxWidth: 480, width: "90%", textAlign: "center", display: "flex", flexDirection: "column", gap: 16 },
  solveInput: { background: "rgba(11,17,48,0.8)", border: "1.5px solid #F2B705", borderRadius: 10, padding: "12px 16px", fontSize: 16, color: "#F5F3EA", outline: "none" },
  solveButtonRow: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },

  roundEndPanel: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, animation: "fadeIn 0.3s ease-out" },
  roundEndTitle: { fontFamily: "Georgia, serif", fontSize: 20, textAlign: "center" },
  roundEndButtons: { display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 6 },

  overlay: { position: "fixed", inset: 0, background: "rgba(6,9,28,0.94)", backdropFilter: "blur(4px)", zIndex: 30, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.25s ease-out" },
  gameoverCard: { textAlign: "center", maxWidth: 420, width: "90%" },
  gameoverEyebrow: { fontFamily: "'Courier New', monospace", fontSize: 13, letterSpacing: "0.25em", marginBottom: 6 },
  gameoverTitle: { fontFamily: "Georgia, serif", fontSize: 34, margin: "0 0 18px" },
  finalScores: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 },
  finalScoreRow: { display: "flex", justifyContent: "space-between", fontFamily: "'Courier New', monospace", fontSize: 14, fontWeight: 700 },
};
