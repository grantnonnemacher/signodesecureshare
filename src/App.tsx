import { Routes, Route } from "react-router-dom";
import { SignodeHeader } from "@/components/signode/SignodeHeader";
import { SignInGate } from "@/components/signode/SignInGate";
import { Toaster } from "@/components/ui/toaster";
import { usePersona } from "@/lib/persona-context";
import { Card, CardContent } from "@/components/ui/card";

function PlaceholderPage({ name }: { name: string }) {
  const { persona } = usePersona();
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Card>
        <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-[hsl(var(--signode-black))]">
            {name}
          </h1>
          <p className="mt-2 text-muted-foreground">
            This page will be filled in during Batches 4–6.
          </p>
          <p className="mt-4 text-sm">
            You are currently viewing as{" "}
            <strong>{persona.displayName}</strong> ({persona.role}).
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Scope:{" "}
            <span className="font-mono">
              {persona.scopedPaths.join(", ")}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[hsl(var(--signode-cream))]">
      <SignodeHeader />
      <SignInGate />
      <Toaster />
      <Routes>
        <Route path="/" element={<PlaceholderPage name="Home" />} />
        <Route path="/browse" element={<PlaceholderPage name="Browse" />} />
        <Route path="/upload" element={<PlaceholderPage name="Upload" />} />
        <Route path="/recent" element={<PlaceholderPage name="Recent" />} />
        <Route path="/help" element={<PlaceholderPage name="Help" />} />
        <Route
          path="/build-guide"
          element={<PlaceholderPage name="Build Guide" />}
        />
        <Route
          path="/architecture"
          element={<PlaceholderPage name="Architecture" />}
        />
        <Route
          path="/security"
          element={<PlaceholderPage name="Security" />}
        />
        <Route
          path="/controls"
          element={<PlaceholderPage name="Controls" />}
        />
        <Route
          path="/deployment"
          element={<PlaceholderPage name="Deployment Roadmap" />}
        />
        <Route
          path="/runbooks"
          element={<PlaceholderPage name="Runbooks" />}
        />
        <Route path="/source" element={<PlaceholderPage name="Source & IaC" />} />
        <Route
          path="*"
          element={<PlaceholderPage name="Page not found" />}
        />
      </Routes>
    </div>
  );
}