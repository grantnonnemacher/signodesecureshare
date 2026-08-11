import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { usePersona } from "@/lib/persona-context";
import { isPathInScope } from "@/lib/personas";
import { FOLDER_TREE, findNode, type FolderNode } from "@/lib/folderTree";
import { AccessRestricted } from "@/components/signode/AccessRestricted";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  FileText,
  Home as HomeIcon,
  Download,
  Lock,
} from "lucide-react";

// Mock files per folder (deterministic based on folder path)
function mockFilesFor(path: string) {
  const names = [
    "Q3-forecast.xlsx",
    "vendor-brief.pdf",
    "campaign-assets.zip",
    "contract-draft.docx",
    "audit-notes.txt",
  ];
  const seed = path.length;
  const count = (seed % 4) + 1;
  return Array.from({ length: count }, (_, i) => ({
    name: names[(seed + i) % names.length],
    size: `${((seed + i * 37) % 900) + 20} KB`,
    uploaded: `${((seed + i * 3) % 6) + 1} days ago`,
    expiresInDays: 7 - (((seed + i * 3) % 6) + 1),
  }));
}

function expiryBadge(days: number) {
  if (days <= 0)
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200">Expired</Badge>
    );
  if (days <= 2)
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200">
        Expires in {days}d
      </Badge>
    );
  if (days <= 4)
    return (
      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
        Expires in {days}d
      </Badge>
    );
  return (
    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
      Expires in {days}d
    </Badge>
  );
}

function TreeNode({
  node,
  depth,
  selectedPath,
  onSelect,
  expanded,
  toggle,
  personaScopeCheck,
}: {
  node: FolderNode;
  depth: number;
  selectedPath: string;
  onSelect: (path: string) => void;
  expanded: Record<string, boolean>;
  toggle: (path: string) => void;
  personaScopeCheck: (path: string) => boolean;
}) {
  const isOpen = expanded[node.path] ?? depth < 1;
  const inScope = personaScopeCheck(node.path);
  const hasChildren = !!node.children?.length;
  const isSelected = node.path === selectedPath;

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) toggle(node.path);
          onSelect(node.path);
        }}
        className={[
          "w-full flex items-center gap-1 px-2 py-1 rounded text-sm text-left",
          isSelected
            ? "bg-[hsl(var(--signode-orange))]/10 text-[hsl(var(--signode-orange-deep))] font-semibold"
            : "hover:bg-muted",
          !inScope && "opacity-50",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ paddingLeft: 8 + depth * 12 }}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          )
        ) : (
          <span className="w-3.5" />
        )}
        {node.path === "Home" ? (
          <HomeIcon className="h-4 w-4 shrink-0 text-[hsl(var(--signode-orange))]" />
        ) : isOpen ? (
          <FolderOpen className="h-4 w-4 shrink-0 text-[hsl(var(--signode-orange))]" />
        ) : (
          <Folder className="h-4 w-4 shrink-0 text-[hsl(var(--signode-orange))]" />
        )}
        <span className="truncate">{node.name}</span>
        {!inScope && <Lock className="h-3 w-3 ml-auto shrink-0" />}
      </button>
      {hasChildren && isOpen && (
        <div>
          {node.children!.map((c) => (
            <TreeNode
              key={c.path}
              node={c}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
              expanded={expanded}
              toggle={toggle}
              personaScopeCheck={personaScopeCheck}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function BrowsePage() {
  const { persona } = usePersona();
  const [params, setParams] = useSearchParams();
  const initial = params.get("path") || "Home";
  const [selectedPath, setSelectedPath] = React.useState(initial);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({
    Home: true,
    "Home/AMER": true,
    "Home/CORP": true,
  });

  const scopeCheck = React.useCallback(
    (p: string) => isPathInScope(persona, p) || hasScopedDescendant(persona, p),
    [persona]
  );

  function onSelect(p: string) {
    setSelectedPath(p);
    setParams({ path: p });
  }
  function toggle(p: string) {
    setExpanded((prev) => ({ ...prev, [p]: !(prev[p] ?? false) }));
  }

  const node = findNode(FOLDER_TREE, selectedPath);
  const canView = isPathInScope(persona, selectedPath);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[hsl(var(--signode-black))]">
          Browse
        </h1>
        <p className="mt-2 text-muted-foreground">
          Navigate the Signode folder tree. Folders outside your scope are
          locked.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Tree */}
        <Card>
          <CardContent className="p-2">
            <TreeNode
              node={FOLDER_TREE}
              depth={0}
              selectedPath={selectedPath}
              onSelect={onSelect}
              expanded={expanded}
              toggle={toggle}
              personaScopeCheck={scopeCheck}
            />
          </CardContent>
        </Card>

        {/* Detail */}
        {canView && node ? (
          <FolderDetail node={node} />
        ) : (
          <AccessRestricted attemptedPath={selectedPath} />
        )}
      </div>
    </div>
  );
}

function FolderDetail({ node }: { node: FolderNode }) {
  const files = mockFilesFor(node.path);
  const crumbs = node.path.split("/");

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 flex-wrap text-sm text-muted-foreground">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
            <span
              className={
                i === crumbs.length - 1
                  ? "font-semibold text-[hsl(var(--signode-black))]"
                  : ""
              }
            >
              {c}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Subfolders */}
      {node.children && node.children.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Subfolders
            </div>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {node.children.map((c) => (
                <div
                  key={c.path}
                  className="flex items-center gap-2 rounded-md border p-2 text-sm hover:border-[hsl(var(--signode-orange))] transition-colors"
                >
                  <Folder className="h-4 w-4 text-[hsl(var(--signode-orange))]" />
                  <span className="truncate">{c.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Files */}
      <Card>
        <CardContent className="p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Files ({files.length})
          </div>
          <div className="divide-y">
            {files.map((f, i) => (
              <div
                key={i}
                className="py-2 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm truncate">{f.name}</span>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {f.size} &middot; {f.uploaded}
                </div>
                {expiryBadge(f.expiresInDays)}
                <Button size="sm" variant="ghost" className="h-7">
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper — does the persona have any scoped descendant under this path?
// (so parent folders in the tree are still expandable even if not directly in scope)
function hasScopedDescendant(persona: any, path: string): boolean {
  if (persona.scopedPaths.includes("*")) return true;
  return persona.scopedPaths.some((s: string) => s.startsWith(path + "/"));
}