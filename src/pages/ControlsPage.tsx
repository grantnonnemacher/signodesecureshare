import * as React from "react";
import { DocPageShell } from "@/components/signode/DocPageShell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download, ShieldCheck, AlertCircle, Clock } from "lucide-react";
import { NIST_CONTROLS, CONTROL_FAMILIES } from "@/lib/nistControls";

const STATUSES = ["All", "Implemented", "Partial", "Planned"] as const;

export function ControlsPage() {
  const [query, setQuery] = React.useState("");
  const [family, setFamily] = React.useState<string>("All");
  const [status, setStatus] =
    React.useState<(typeof STATUSES)[number]>("All");

  const filtered = React.useMemo(() => {
    return NIST_CONTROLS.filter((c) => {
      const matchesFamily = family === "All" || c.family === family;
      const matchesStatus = status === "All" || c.status === status;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.owner.toLowerCase().includes(q) ||
        c.evidence.toLowerCase().includes(q);
      return matchesFamily && matchesStatus && matchesQuery;
    });
  }, [query, family, status]);

  const stats = React.useMemo(() => {
    const total = NIST_CONTROLS.length;
    const implemented = NIST_CONTROLS.filter(
      (c) => c.status === "Implemented"
    ).length;
    const partial = NIST_CONTROLS.filter((c) => c.status === "Partial").length;
    const planned = NIST_CONTROLS.filter((c) => c.status === "Planned").length;
    return { total, implemented, partial, planned };
  }, []);

  function handleExportCsv() {
    const headers = [
      "ID",
      "Family",
      "Title",
      "Baseline",
      "Status",
      "Owner",
      "Evidence",
    ];
    const rows = filtered.map((c) => [
      c.id,
      c.family,
      c.title,
      c.baseline,
      c.status,
      c.owner,
      c.evidence,
    ]);
    const csv = [headers, ...rows]
      .map((r) =>
        r
          .map((cell) => {
            const s = String(cell).replace(/"/g, '""');
            return /[",\n]/.test(s) ? `"${s}"` : s;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nist-800-53-controls-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <DocPageShell
      title="Controls"
      subtitle="NIST SP 800-53 Rev 5 Moderate control matrix for the Signode SecureShare Portal."
    >
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatTile
          icon={<ShieldCheck className="h-5 w-5" />}
          label="Total controls"
          value={stats.total}
          tone="neutral"
        />
        <StatTile
          icon={<ShieldCheck className="h-5 w-5" />}
          label="Implemented"
          value={stats.implemented}
          tone="good"
        />
        <StatTile
          icon={<AlertCircle className="h-5 w-5" />}
          label="Partial"
          value={stats.partial}
          tone="warn"
        />
        <StatTile
          icon={<Clock className="h-5 w-5" />}
          label="Planned"
          value={stats.planned}
          tone="bad"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search ID, title, owner, evidence..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={family} onValueChange={setFamily}>
              <SelectTrigger className="w-[260px]">
                <SelectValue placeholder="Filter by family" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All families</SelectItem>
                {CONTROL_FAMILIES.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(v) =>
                setStatus(v as (typeof STATUSES)[number])
              }
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleExportCsv}
              className="bg-[hsl(var(--signode-orange))] hover:bg-[hsl(var(--signode-orange-deep))] text-white gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Showing <strong>{filtered.length}</strong> of {stats.total} controls
          </div>
        </CardContent>
      </Card>

      {/* Matrix */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-[220px]">Family</TableHead>
                <TableHead className="w-[110px]">Baseline</TableHead>
                <TableHead className="w-[130px]">Status</TableHead>
                <TableHead className="w-[160px]">Owner</TableHead>
                <TableHead>Evidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No controls match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs font-semibold">
                      {c.id}
                    </TableCell>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {c.family}
                    </TableCell>
                    <TableCell>
                      <BaselineBadge baseline={c.baseline} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={c.status} />
                    </TableCell>
                    <TableCell className="text-sm">{c.owner}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {c.evidence}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DocPageShell>
  );
}

function StatTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "good" | "warn" | "bad" | "neutral";
}) {
  const toneColor =
    tone === "good"
      ? "text-emerald-600"
      : tone === "warn"
      ? "text-amber-600"
      : tone === "bad"
      ? "text-red-600"
      : "text-[hsl(var(--signode-orange))]";
  return (
    <Card>
      <CardContent className="p-4">
        <div className={`flex items-center gap-2 ${toneColor}`}>
          {icon}
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        </div>
        <div className="mt-2 text-2xl font-bold text-[hsl(var(--signode-black))]">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

function BaselineBadge({ baseline }: { baseline: string }) {
  const color =
    baseline === "High"
      ? "bg-red-100 text-red-800 border-red-200"
      : baseline === "Moderate"
      ? "bg-amber-100 text-amber-800 border-amber-200"
      : "bg-slate-100 text-slate-700 border-slate-200";
  return <Badge className={color}>{baseline}</Badge>;
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "Implemented"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : status === "Partial"
      ? "bg-amber-100 text-amber-800 border-amber-200"
      : "bg-red-100 text-red-800 border-red-200";
  return <Badge className={color}>{status}</Badge>;
}