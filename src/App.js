import { useState } from "react";
import "./App.css";

const SPRITES = {
  classicons: { count: 9 }, //0:druid, 1:priest, 2:warrior, 3:rogue, 4:paladin, 5:hunter, 6:mage, 7:shaman, 8:warlock
  raceicons: { count: 10 }, //0:human, 1: dwarf, 2: night elf, 3: gnome, 4: skyelf(A), 5: orc, 6: forsaken, 7: tauren, 8: troll, 9: skyelf(H)
};

const VALID_COMBOS = {
  0: [2, 4, 7, 9], // druid
  1: [0, 1, 2, 3, 6, 8],    // priest
  2: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // warrior
  3: [0, 1, 2, 3, 4, 5, 6, 8, 9], // rogue
  4: [0, 1, 6], // paladin
  5: [0, 1, 2, 4, 5, 7, 8, 9],// hunter
  6: [0, 3, 4, 5, 6, 8], // mage
  7: [1, 5, 7, 8, 9], // shaman
  8: [0, 3, 5, 6, 8] // warlock
}

const VALID_CHARACTERS = Object.entries(VALID_COMBOS).flatMap(
  ([classIndex, raceIndexes]) =>
    raceIndexes.map((raceIndex) => ({
      classIndex: Number(classIndex),
      raceIndex,
    }))
);

function Sprite({ sheet, index, label }) {
  const { count } = SPRITES[sheet];

  return (
    <div
      className={`sprite ${sheet}`}
      role="img"
      aria-label={label}
      style={{
        backgroundImage: `url("${process.env.PUBLIC_URL}/warboundassets/${sheet}.png")`,
        backgroundSize: "100% auto",
        backgroundPosition: `0 ${count > 1 ? (index / (count - 1)) * 100 : 0}%`,
      }}
    />
  );
}

function makeCharacter() {
  return VALID_CHARACTERS[Math.floor(Math.random() * VALID_CHARACTERS.length)];
}

export default function App() {
  const [character, setCharacter] = useState(makeCharacter);
  const [spinning, setSpinning] = useState(false);
  const [spinPhase, setSpinPhase] = useState("fast");
  const [stopped, setStopped] = useState({ class: true, race: true });
  const [message, setMessage] = useState("Spin to generate a character.");

  function spin() {
    if (spinning) return;

    setSpinning(true);
    setSpinPhase("fast");
    setStopped({ class: false, race: false });
    setMessage("Spinning…");
    const nextCharacter = makeCharacter();

    window.setTimeout(() => {
      setSpinPhase("medium");
    }, 900);

    window.setTimeout(() => {
      setSpinPhase("slow");
    }, 1500);

    window.setTimeout(() => {
      setCharacter((current) => ({
        ...current,
        classIndex: nextCharacter.classIndex,
      }));
      setStopped((current) => ({ ...current, class: true }));
    }, 2200);

    window.setTimeout(() => {
      setCharacter((current) => ({
        ...current,
        raceIndex: nextCharacter.raceIndex,
      }));
      setStopped((current) => ({ ...current, race: true }));
      setMessage("Your character is ready!");
      setSpinning(false);
    }, 2800);
  }

  return (
    <main className="page">
      <section className="machine" aria-label="Warbound Random Character Creator">
        <p className="eyebrow">WARBOUND</p>
        <h1>Character Generator</h1>
        <p className="subtitle">Spin for a random class and race.</p>

        <div className={`slot ${spinning ? "is-spinning" : ""}`}>
          <div className="reels">
            <article
              className={`reel ${spinning && !stopped.class ? `is-spinning ${spinPhase}` : ""}`}
              aria-label="Class reel"
            >
              <span className="icon-label">CLASS</span>
              <Sprite
                sheet="classicons"
                index={character.classIndex}
                label={`Class icon ${character.classIndex + 1}`}
              />
            </article>
            <article
              className={`reel ${spinning && !stopped.race ? `is-spinning ${spinPhase}` : ""}`}
              aria-label="Race reel"
            >
              <span className="icon-label">RACE</span>
              <Sprite
                sheet="raceicons"
                index={character.raceIndex}
                label={`Race icon ${character.raceIndex + 1}`}
              />
            </article>
          </div>
        </div>

        <p className="message" aria-live="polite">{message}</p>
        <button className="spin-button" onClick={spin} disabled={spinning}>
          {spinning ? "SPINNING…" : "SPIN"}
        </button>
      </section>
    </main>
  );
}
