export default function SummaryView({ summary }) {
  const { title, introduction, topics = [], conclusion } = summary;

  return (
    <div className="space-y-6 fade-up">
      <div className="space-y-2">
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--color-accent-light)" }}
        >
          Resumo gerado
        </p>
        <h2 className="text-2xl font-bold text-gradient leading-tight">
          {title}
        </h2>
        <div className="divider-glow w-24" />
      </div>

      <div
        className="rounded-xl p-4"
        style={{
          backgroundColor: "var(--color-accent-dim)",
          border: "1px solid var(--color-border)",
        }}
      >
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-secondary)" }}
        >
          {introduction}
        </p>
      </div>

      <div className="space-y-3">
        {topics.map((topic, i) => (
          <div
            key={i}
            className="card card-hover p-5"
            style={{
              transition: "border-color 200ms ease, transform 200ms ease",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-accent), #8b63ff)",
                  color: "#fff",
                  boxShadow: "0 2px 8px var(--color-accent-glow)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className="flex-1 space-y-1.5">
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {topic.heading}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-secondary)" }}
                >
                  {topic.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {conclusion && (
        <div
          className="rounded-xl p-5 space-y-2"
          style={{
            background:
              "linear-gradient(135deg, rgba(108,99,255,0.1) 0%, rgba(139,99,255,0.06) 100%)",
            border: "1px solid var(--color-border)",
            borderLeft: "3px solid var(--color-accent)",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--color-accent-light)" }}
          >
            Conclusao
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--color-secondary)" }}
          >
            {conclusion}
          </p>
        </div>
      )}
    </div>
  );
}
