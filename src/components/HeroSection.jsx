const FEATURES = [
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
    title: "Camera como entrada",
    description:
      "Aponte a camera do celular para o quadro, slide ou caderno. O CodeCam processa o conteudo visual diretamente — sem digitar nada.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "IA que interpreta",
    description:
      "A inteligencia artificial identifica o tema, extrai os conceitos-chave e organiza tudo em um formato pedagogico claro e estruturado.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: "Resumos instantaneos",
    description:
      "Gere resumos com introducao, subtopicos numerados e conclusao — prontos para revisar antes de uma prova ou fixar o conteudo do dia.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    title: "Flashcards interativos",
    description:
      "Cartoes de pergunta e resposta embaralhados automaticamente. Avalie seu desempenho e acompanhe sua evolucao a cada sessao de revisao.",
  },
];

export default function HeroSection() {
  return (
    <section className="space-y-14 pt-12">
      <div className="space-y-10">
        <div className="space-y-5">
          <div className="space-y-2">
            <h2
              className="text-4xl font-black tracking-tight leading-[1.1]"
              style={{ color: "var(--color-primary)" }}
            >
              Uma câmera.
            </h2>
            <h2 className="text-4xl font-black tracking-tight leading-[1.1] text-gradient">
              Novas formas de aprender.
            </h2>
          </div>

          <p
            className="text-base leading-relaxed max-w-xl"
            style={{ color: "var(--color-secondary)" }}
          >
            O CodeCam conecta a camera nativa do celular a inteligencia
            artificial para interpretar o conteudo visual da aula e converti-lo
            em materiais uteis, personalizados e acessiveis.
          </p>
        </div>

        <div
          className="grid grid-cols-3 gap-px rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--color-border)" }}
        >
          {[
            { value: "< 10s", label: "Para gerar um resumo" },
            { value: "Gemini", label: "Motor de IA" },
            { value: "100%", label: "No seu navegador" },
          ].map((stat, i) => (
            <div
              key={i}
              className="px-5 py-4 text-center"
              style={{ backgroundColor: "var(--color-bg-card)" }}
            >
              <p
                className="text-lg font-black"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-accent-light), #c084fc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--color-muted)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-1">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-muted)" }}
          >
            Recursos
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FEATURES.map((feat, i) => (
            <div
              key={i}
              className="card card-hover p-5 space-y-3"
              style={{ transition: "all 200ms ease" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: "var(--color-accent-dim)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-accent-light)",
                }}
              >
                {feat.icon}
              </div>
              <div className="space-y-1">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {feat.title}
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--color-secondary)" }}
                >
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="divider-glow" />
    </section>
  );
}
