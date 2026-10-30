import { useState } from "react";
import "./App.css";

const SPRITES = {
  classicons: { count: 9 },
  raceicons: { count: 10 },
};

function randomIndex(sheet) {
  return Math.floor(Math.random() * SPRITES[sheet].count);
}

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
  return {
    classIndex: randomIndex("classicons"),
    raceIndex: randomIndex("raceicons"),
  };
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

    window.setTimeout(() => {
      setSpinPhase("medium");
    }, 900);

    window.setTimeout(() => {
      setSpinPhase("slow");
    }, 1500);

    window.setTimeout(() => {
      const classIndex = randomIndex("classicons");
      setCharacter((current) => ({ ...current, classIndex }));
      setStopped((current) => ({ ...current, class: true }));
    }, 2200);

    window.setTimeout(() => {
      const raceIndex = randomIndex("raceicons");
      setCharacter((current) => ({ ...current, raceIndex }));
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
