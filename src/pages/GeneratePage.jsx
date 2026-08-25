import { useState } from "react";
import { generateSummary, generateFlashcards } from "../services/gemini";
import { saveHistoryEntry, incrementStats } from "../utils/storage";
import { generateId, randomInt } from "../utils/math";
import SummaryView from "../components/SummaryView";
import FlashcardDeck from "../components/FlashcardDeck";
import HeroSection from "../components/HeroSection";

const CONTENT_TYPES = [
  {
    value: "summary",
    label: "Resumo",
    description: "Visao estruturada com introducao, topicos e conclusao.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10,9 9,9 8,9" />
      </svg>
    ),
  },
  {
    value: "flashcards",
    label: "Flashcards",
    description: "Cartoes de pergunta e resposta para revisao ativa.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    value: "both",
    label: "Ambos",
    description: "Resumo completo + flashcards de revisao.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" />
      </svg>
    ),
  },
];

const CARD_COUNT_OPTIONS = [2, 3, 4, 5];

function LoadingSkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <div className="skeleton h-4 w-1/3" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-5/6" />
      <div className="skeleton h-3 w-4/6" />
      <div className="space-y-3 pt-2">
        <div className="skeleton h-16 w-full rounded-xl" />
        <div className="skeleton h-16 w-full rounded-xl" />
        <div className="skeleton h-16 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function GeneratePage() {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("summary");
  const [cardCount, setCardCount] = useState(8);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState(null);
  const [flashcards, setFlashcards] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");

  async function handleGenerate(e) {
    e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setSummary(null);
    setFlashcards(null);

    try {
      if (contentType === "summary" || contentType === "both") {
        const data = await generateSummary(trimmed);
        setSummary(data);
        setActiveTab("summary");
        incrementStats({ summariesGenerated: 1, sessionsStarted: 1 });
        saveHistoryEntry({
          id: generateId(),
          topic: trimmed,
          type: "summary",
          data,
          createdAt: new Date().toISOString(),
        });
      }

      if (contentType === "flashcards" || contentType === "both") {
        const actualCount = randomInt(
          Math.max(3, cardCount - 1),
          cardCount + 1,
        );
        const cards = await generateFlashcards(trimmed, actualCount);
        setFlashcards(cards);
        if (contentType === "flashcards") setActiveTab("flashcards");
        incrementStats({ flashcardsGenerated: cards.length });
        saveHistoryEntry({
          id: generateId(),
          topic: trimmed,
          type: "flashcards",
          data: cards,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      setError(err.message || "Erro desconhecido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const hasResult = summary || flashcards;
  const showTabs = summary && flashcards;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2
          className="text-2xl font-black tracking-tight"
          style={{ color: "var(--color-primary)" }}
        >
          Gerar conteúdo
        </h2>
        <p className="text-sm" style={{ color: "var(--color-secondary)" }}>
          Informe o tema e escolha o que deseja gerar.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="card card-glow p-6 space-y-6">
        <div className="space-y-2">
          <label
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-muted)" }}
          >
            Tema da aula
          </label>
          <input
            type="text"
            className="input-field w-full px-4 py-3 text-sm"
            placeholder="Ex: Fotossintese, Revolucao Francesa, Algebra Linear..."
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setError("");
            }}
            disabled={loading}
            maxLength={200}
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-muted)" }}
          >
            O que deseja gerar?
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {CONTENT_TYPES.map(({ value, label, description, icon }) => {
              const selected = contentType === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setContentType(value)}
                  disabled={loading}
                  className="text-left p-4 rounded-xl border transition-all duration-200"
                  style={{
                    backgroundColor: selected
                      ? "var(--color-accent-dim)"
                      : "var(--color-bg-surface)",
                    borderColor: selected
                      ? "var(--color-accent)"
                      : "var(--color-border-subtle)",
                    boxShadow: selected
                      ? "0 0 16px var(--color-accent-glow)"
                      : "none",
                    color: selected
                      ? "var(--color-primary)"
                      : "var(--color-secondary)",
                  }}
                >
                  <div
                    className="flex items-center gap-2 mb-1.5"
                    style={{
                      color: selected
                        ? "var(--color-accent-light)"
                        : "var(--color-muted)",
                    }}
                  >
                    {icon}
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color: selected
                          ? "var(--color-primary)"
                          : "var(--color-secondary)",
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  <p
                    className="text-xs leading-snug"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {(contentType === "flashcards" || contentType === "both") && (
          <div className="space-y-2">
            <label
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-muted)" }}
            >
              Quantidade de flashcards
            </label>
            <div className="flex gap-2 flex-wrap">
              {CARD_COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCardCount(n)}
                  disabled={loading}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all duration-150"
                  style={{
                    backgroundColor:
                      cardCount === n
                        ? "var(--color-accent)"
                        : "var(--color-bg-surface)",
                    borderColor:
                      cardCount === n
                        ? "var(--color-accent)"
                        : "var(--color-border-subtle)",
                    color: cardCount === n ? "#fff" : "var(--color-secondary)",
                    boxShadow:
                      cardCount === n
                        ? "0 2px 10px var(--color-accent-glow)"
                        : "none",
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{
              backgroundColor: "rgba(255,85,114,0.1)",
              border: "1px solid rgba(255,85,114,0.3)",
              color: "var(--color-error)",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="btn-primary w-full py-3 text-sm"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Gerando conteudo...
            </span>
          ) : (
            "Gerar conteudo"
          )}
        </button>
      </form>

      {loading && <LoadingSkeleton />}

      {hasResult && !loading && (
        <div className="space-y-4 fade-up">
          {showTabs && (
            <div
              className="flex rounded-xl p-1 gap-1"
              style={{
                backgroundColor: "var(--color-bg-card)",
                border: "1px solid var(--color-border-subtle)",
              }}
            >
              {[
                { key: "summary", label: "Resumo" },
                { key: "flashcards", label: "Flashcards" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
                  style={{
                    background:
                      activeTab === key
                        ? "linear-gradient(135deg, var(--color-accent), #8b63ff)"
                        : "transparent",
                    color:
                      activeTab === key ? "#fff" : "var(--color-secondary)",
                    boxShadow:
                      activeTab === key
                        ? "0 2px 12px var(--color-accent-glow)"
                        : "none",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {summary && (!showTabs || activeTab === "summary") && (
            <SummaryView summary={summary} />
          )}
          {flashcards && (!showTabs || activeTab === "flashcards") && (
            <FlashcardDeck cards={flashcards} key={flashcards.length} />
          )}
        </div>
      )}
    </div>
  );
}
