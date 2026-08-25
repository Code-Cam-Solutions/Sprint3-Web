import { useState } from "react";
import {
  getHistory,
  removeHistoryEntry,
  clearHistory,
  getStats,
} from "../utils/storage";
import { daysSince, scorePercent, formatPercent } from "../utils/math";
import SummaryView from "../components/SummaryView";
import FlashcardDeck from "../components/FlashcardDeck";

function StatCard({ label, value, sub, accent }) {
  return (
    <div
      className="card p-5 space-y-1 transition-all duration-200"
      style={{
        borderColor: accent
          ? "var(--color-border)"
          : "var(--color-border-subtle)",
      }}
    >
      <p
        className="text-2xl font-black"
        style={{
          background:
            "linear-gradient(135deg, var(--color-accent-light), #c084fc)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {value}
      </p>
      <p
        className="text-xs font-semibold"
        style={{ color: "var(--color-secondary)" }}
      >
        {label}
      </p>
      {sub && (
        <p className="text-xs" style={{ color: "var(--color-muted)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function TypeBadge({ type }) {
  const map = {
    summary: {
      label: "Resumo",
      bg: "var(--color-accent-dim)",
      color: "var(--color-accent-light)",
      border: "var(--color-border)",
    },
    flashcards: {
      label: "Flashcards",
      bg: "rgba(62,207,142,0.12)",
      color: "var(--color-success)",
      border: "rgba(62,207,142,0.25)",
    },
  };
  const s = map[type] || {
    label: type,
    bg: "transparent",
    color: "var(--color-muted)",
    border: "var(--color-border-subtle)",
  };

  return (
    <span
      className="badge"
      style={{
        backgroundColor: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.label}
    </span>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function HistoryPage() {
  const [history, setHistory] = useState(() => getHistory());
  const [stats] = useState(() => getStats());
  const [selected, setSelected] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const totalActions = stats.summariesGenerated + stats.flashcardsGenerated;
  const flashcardRatio =
    totalActions > 0
      ? scorePercent(stats.flashcardsGenerated, totalActions)
      : 0;

  function handleRemove(id) {
    removeHistoryEntry(id);
    setHistory(getHistory());
    if (selected?.id === id) setSelected(null);
  }

  function handleClear() {
    clearHistory();
    setHistory([]);
    setSelected(null);
    setConfirmClear(false);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1
          className="text-2xl font-black tracking-tight"
          style={{ color: "var(--color-primary)" }}
        >
          Histórico
        </h1>
        <p className="text-sm" style={{ color: "var(--color-secondary)" }}>
          Resumos e flashcards gerados anteriormente.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Resumos gerados" value={stats.summariesGenerated} />
        <StatCard
          label="Flashcards gerados"
          value={stats.flashcardsGenerated}
        />
        <StatCard label="Itens no historico" value={history.length} />
        <StatCard
          label="Usando há"
          value={stats.firstUsedAt ? `${daysSince(stats.firstUsedAt)}d` : "—"}
          sub={
            stats.firstUsedAt
              ? formatDate(stats.firstUsedAt)
              : "Ainda nao utilizado"
          }
        />
      </div>

      {totalActions > 0 && (
        <div
          className="card p-5 space-y-3"
          style={{ borderColor: "var(--color-border-subtle)" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-muted)" }}
          >
            Distribuicao de geracoes
          </p>
          <div
            className="w-full h-2.5 rounded-full overflow-hidden flex"
            style={{ backgroundColor: "var(--color-bg-surface)" }}
          >
            <div
              style={{
                width: formatPercent(100 - flashcardRatio),
                background:
                  "linear-gradient(90deg, var(--color-accent), #8b63ff)",
                boxShadow: "0 0 8px var(--color-accent-glow)",
                transition: "width 0.6s ease",
              }}
            />

            <div
              style={{
                flex: 1,
                background:
                  "linear-gradient(90deg, #2db87d, var(--color-success))",
              }}
            />
          </div>
          <div
            className="flex justify-between text-xs"
            style={{ color: "var(--color-muted)" }}
          >
            <span style={{ color: "var(--color-accent-light)" }}>
              Resumos &mdash; {formatPercent(100 - flashcardRatio)}
            </span>
            <span style={{ color: "var(--color-success)" }}>
              Flashcards &mdash; {formatPercent(flashcardRatio)}
            </span>
          </div>
        </div>
      )}

      {selected && (
        <div className="card card-glow p-6 space-y-5 fade-up">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <TypeBadge type={selected.type} />
                <span
                  className="text-xs"
                  style={{ color: "var(--color-muted)" }}
                >
                  {formatDate(selected.createdAt)}
                </span>
              </div>
              <h3
                className="text-base font-bold"
                style={{ color: "var(--color-primary)" }}
              >
                {selected.topic}
              </h3>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="btn-ghost px-3 py-1.5 text-xs flex-shrink-0"
            >
              Fechar
            </button>
          </div>
          <div className="divider-glow" />
          {selected.type === "summary" && (
            <SummaryView summary={selected.data} />
          )}
          {selected.type === "flashcards" && (
            <FlashcardDeck cards={selected.data} key={selected.id} />
          )}
        </div>
      )}

      {history.length === 0 ? (
        <div
          className="card p-10 text-center space-y-2"
          style={{ borderStyle: "dashed", borderColor: "var(--color-border)" }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: "var(--color-secondary)" }}
          >
            Nenhum conteudo gerado ainda.
          </p>
          <p className="text-xs" style={{ color: "var(--color-muted)" }}>
            Volte a pagina principal e gere seu primeiro resumo ou flashcard.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-muted)" }}
            >
              Geracoes recentes
            </p>

            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="text-xs transition-colors"
                style={{ color: "var(--color-muted)" }}
              >
                Limpar tudo
              </button>
            ) : (
              <div className="flex items-center gap-3 text-xs">
                <span style={{ color: "var(--color-muted)" }}>Confirmar?</span>
                <button
                  onClick={handleClear}
                  className="font-bold"
                  style={{ color: "var(--color-error)" }}
                >
                  Sim, limpar
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  style={{ color: "var(--color-muted)" }}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          {history.map((entry) => {
            const isActive = selected?.id === entry.id;
            return (
              <div
                key={entry.id}
                className="card card-hover flex items-center justify-between gap-4 p-4 cursor-pointer"
                style={{
                  borderColor: isActive
                    ? "var(--color-accent)"
                    : "var(--color-border-subtle)",
                  boxShadow: isActive
                    ? "0 0 16px var(--color-accent-glow)"
                    : "none",
                  transition: "all 200ms ease",
                }}
                onClick={() => setSelected(isActive ? null : entry)}
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <TypeBadge type={entry.type} />
                    <span
                      className="text-xs"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {formatDate(entry.createdAt)}
                    </span>
                  </div>
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {entry.topic}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {entry.type === "flashcards" && Array.isArray(entry.data)
                      ? `${entry.data.length} cartoes`
                      : entry.data?.topics
                        ? `${entry.data.topics.length} topicos`
                        : null}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: isActive
                        ? "var(--color-accent-light)"
                        : "var(--color-muted)",
                    }}
                  >
                    {isActive ? "Fechar" : "Abrir"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(entry.id);
                    }}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-sm transition-colors"
                    style={{
                      backgroundColor: "var(--color-bg-surface)",
                      color: "var(--color-muted)",
                    }}
                    title="Remover"
                  >
                    &times;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
