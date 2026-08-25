import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "var(--color-bg-base)" }}
    >
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {children}
      </main>
      <footer
        className="py-5 text-center text-xs"
        style={{
          color: "var(--color-muted)",
          borderTop: "1px solid var(--color-border-subtle)",
        }}
      >
        CodeCam &copy; {new Date().getFullYear()} &mdash; FIAP
      </footer>
    </div>
  );
}
