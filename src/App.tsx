import { Routes, Route, Link } from "react-router-dom";

function Header() {
  return (
    <header className="signode-header-gradient border-b-4 border-[hsl(var(--signode-orange))]">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex flex-col leading-none">
          <span className="signode-wordmark text-2xl">SIGNODE</span>
          <span className="signode-tagline mt-1">
            Transit Packaging Solutions
          </span>
        </div>
        <nav className="flex gap-4 text-sm text-white">
          <Link to="/" className="hover:text-[hsl(var(--signode-orange-soft))]">
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}

function HomePlaceholder() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-[hsl(var(--signode-black))]">
          Signode SecureShare Portal
        </h1>
        <p className="mt-2 text-muted-foreground">
          Scaffold is live. Theme and routing are working. Ready for Batch 3.
        </p>
        <div className="mt-6 flex gap-3">
          <div className="h-10 w-32 rounded signode-gradient" />
          <div className="h-10 w-32 rounded bg-[hsl(var(--signode-black))]" />
          <div className="h-10 w-32 rounded border bg-white" />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          The three swatches above should read: burnt orange gradient, black,
          white with border.
        </p>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[hsl(var(--signode-cream))]">
      <Header />
      <Routes>
        <Route path="/" element={<HomePlaceholder />} />
      </Routes>
    </div>
  );
}