import { Link, useLocation } from "react-router-dom";
import Logo from "../../public/logo-codecam.svg";

const NAV_ITEMS = [
  { to: "/gerar", label: "Gerar" },
  { to: "/historico", label: "Historico" },
];

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header
      style={{
        backgroundColor: "rgba(19,19,42,0.8)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--color-border-subtle)",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 select-none group">
          <img src={Logo} className="w-6 h-6" />
          <span
            className="font-bold text-base tracking-tight"
            style={{ color: "var(--color-primary)" }}
          >
            Code<span style={{ color: "var(--color-accent-light)" }}>Cam</span>
          </span>
        </Link>
        <nav
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{
            backgroundColor: "var(--color-bg-card)",
            border: "1px solid var(--color-border-subtle)",
          }}
        >
          {NAV_ITEMS.map(({ to, label }) => {
            const active =
              to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className="relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  color: active ? "#fff" : "var(--color-secondary)",
                  backgroundColor: active
                    ? "var(--color-accent)"
                    : "transparent",
                  boxShadow: active
                    ? "0 2px 12px var(--color-accent-glow)"
                    : "none",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
