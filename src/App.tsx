import { ArchitecturePage } from "@/pages/ArchitecturePage";
import { Routes, Route } from "react-router-dom";
import { SignodeHeader } from "@/components/signode/SignodeHeader";
import { SignInGate } from "@/components/signode/SignInGate";
import { Toaster } from "@/components/ui/toaster";
import { usePersona } from "@/lib/persona-context";
import { Card, CardContent } from "@/components/ui/card";
import { HomePage } from "@/pages/HomePage";
import { HelpPage } from "@/pages/HelpPage";
import { BrowsePage } from "@/pages/BrowsePage";
import { UploadPage } from "@/pages/UploadPage";
import { RecentPage } from "@/pages/RecentPage";

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
            This page will be filled in during Batches 5–6.
          </p>
          <p className="mt-4 text-sm">
            You are currently viewing as{" "}
            <strong>{persona.displayName}</strong> ({persona.role}).
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
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/recent" element={<RecentPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route
          path="/build-guide"
          element={<PlaceholderPage name="Build Guide" />}
        />
        <Route path="/architecture" element={<ArchitecturePage />} />
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