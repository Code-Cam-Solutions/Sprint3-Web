import { useState } from "react";
import {
  scorePercent,
  progressRatio,
  scoreLabel,
  shuffle,
} from "../utils/math";

const ANSWERS = [
  {
    value: "correct",
    label: "Acertei",
    style: {
      background: "linear-gradient(135deg, #3ecf8e, #2db87d)",
      boxShadow: "0 4px 16px rgba(62,207,142,0.4)",
      color: "#fff",
    },
  },
  {
    value: "partial",
    label: "Parcial",
    style: {
      background: "linear-gradient(135deg, var(--color-accent), #8b63ff)",
      boxShadow: "0 4px 16px var(--color-accent-glow)",
      color: "#fff",
    },
  },
  {
    value: "wrong",
    label: "Errei",
    style: {
      background: "linear-gradient(135deg, #ff5572, #cc3355)",
      boxShadow: "0 4px 16px rgba(255,85,114,0.4)",
      color: "#fff",
    },
  },
];

function ScoreRing({ percent }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg width="96" height="96" className="absolute inset-0 -rotate-90">
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="var(--color-bg-surface)"
          strokeWidth="7"
        />

        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{
            transition: "stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
      </svg>
      <div className="relative text-center">
        <p
          className="text-xl font-black leading-none"
          style={{ color: "var(--color-primary)" }}
        >
          {percent}%
        </p>
      </div>
    </div>
  );
}

export default function FlashcardDeck({ cards }) {
  const [deck] = useState(() => shuffle(cards));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);

  const current = deck[index];
  const total = deck.length;
  const progressPct = Math.round(progressRatio(index, total) * 100);

  function handleFlip() {
    setFlipped((f) => !f);
  }

  function handleAnswer(value) {
    const next = [...results, { answer: value }];
    setResults(next);
    if (index + 1 >= total) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  }

  function handleRestart() {
    setIndex(0);
    setFlipped(false);
    setResults([]);
    setDone(false);
  }

  if (done) {
    const correct = results.filter((r) => r.answer === "correct").length;
    const partial = results.filter((r) => r.answer === "partial").length;
    const wrong = results.filter((r) => r.answer === "wrong").length;
    const score = scorePercent(correct + partial * 0.5, total);
    const label = scoreLabel(score);

    return (
      <div className="space-y-5 fade-up">
        <div className="card card-glow p-6 space-y-6">
          <div className="text-center space-y-1">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-muted)" }}
            >
              Resultado final
            </p>
            <p
              className="text-lg font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              {label}
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <ScoreRing percent={score} />

            <div className="grid grid-cols-3 gap-3 w-full">
              {[
                {
                  label: "Acertos",
                  value: correct,
                  color: "var(--color-success)",
                },
                {
                  label: "Parciais",
                  value: partial,
                  color: "var(--color-accent-light)",
                },
                { label: "Erros", value: wrong, color: "var(--color-error)" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl p-3 text-center"
                  style={{
                    backgroundColor: "var(--color-bg-surface)",
                    border: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <p
                    className="text-2xl font-black"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="btn-primary w-full py-3 text-sm"
        >
          Revisar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 fade-up">
      <div className="space-y-1.5">
        <div
          className="flex justify-between text-xs"
          style={{ color: "var(--color-muted)" }}
        >
          <span>
            Cartao {index + 1} de {total}
          </span>
          <span style={{ color: "var(--color-accent-light)" }}>
            {progressPct}% concluido
          </span>
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--color-bg-surface)" }}
        >
          <div
            className="h-1.5 rounded-full"
            style={{
              width: `${progressPct}%`,
              background:
                "linear-gradient(90deg, var(--color-accent), #c084fc)",
              transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: "0 0 8px var(--color-accent-glow)",
            }}
          />
        </div>
      </div>

      <div className="flip-card w-full" style={{ minHeight: "220px" }}>
        <div
          className={`flip-card-inner w-full ${flipped ? "flipped" : ""}`}
          style={{ minHeight: "220px" }}
        >
          <div
            className="flip-card-front card pulse-glow w-full cursor-pointer select-none flex flex-col justify-between p-6"
            style={{ minHeight: "220px" }}
            onClick={handleFlip}
          >
            <div className="flex items-center justify-between">
              <span
                className="badge"
                style={{
                  backgroundColor: "var(--color-accent-dim)",
                  color: "var(--color-accent-light)",
                  border: "1px solid var(--color-border)",
                }}
              >
                Pergunta
              </span>
              <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                {index + 1}/{total}
              </span>
            </div>

            <p
              className="text-base font-medium text-center leading-relaxed"
              style={{ color: "var(--color-primary)" }}
            >
              {current.question}
            </p>

            <div className="flex items-center justify-center gap-1.5">
              <div
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: "var(--color-muted)" }}
              />
              <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                Clique para revelar
              </p>
              <div
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: "var(--color-muted)" }}
              />
            </div>
          </div>

          <div
            className="flip-card-back w-full cursor-pointer select-none flex flex-col justify-between p-6 rounded-2xl"
            style={{
              minHeight: "220px",
              backgroundColor: "var(--color-bg-card)",
              border: "1px solid var(--color-accent)",
              boxShadow: "0 0 24px var(--color-accent-glow)",
            }}
            onClick={handleFlip}
          >
            <div className="flex items-center justify-between">
              <span
                className="badge"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-accent), #8b63ff)",
                  color: "#fff",
                }}
              >
                Resposta
              </span>
              <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                Como foi?
              </span>
            </div>

            <p
              className="text-base font-medium text-center leading-relaxed"
              style={{ color: "var(--color-primary)" }}
            >
              {current.answer}
            </p>

            <p
              className="text-xs text-center"
              style={{ color: "var(--color-muted)" }}
            >
              Avalie seu desempenho abaixo
            </p>
          </div>
        </div>
      </div>

      {flipped ? (
        <div className="grid grid-cols-3 gap-3">
          {ANSWERS.map(({ value, label, style }) => (
            <button
              key={value}
              onClick={() => handleAnswer(value)}
              className="py-2.5 text-sm font-bold rounded-xl transition-transform active:scale-95"
              style={style}
            >
              {label}
            </button>
          ))}
        </div>
      ) : (
        <button
          onClick={handleFlip}
          className="btn-primary w-full py-3 text-sm"
        >
          Revelar resposta
        </button>
      )}
    </div>
  );
}
