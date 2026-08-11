# CLAUDE.md

Guidance for AI assistants working in this repository.

## What this project is

**Signode SecureShare Portal** — a single-page React demo/prototype of a secure external
file-sharing portal for Signode (a transit-packaging company). It has two halves:

1. **The portal simulation** — Home, Browse, Upload, Recent, Help. Persona-scoped folder
   browsing, simulated MFA sign-in, simulated uploads, simulated invitation links.
2. **The design documentation** — Build Guide, Architecture, Security, Controls, Deployment
   Roadmap, Runbooks. Long-form, printable pages describing the Azure/SharePoint solution the
   portal is a mockup of (NIST 800-53 control mapping, deployment phases, ops runbooks).

**There is no backend.** Every file listing, upload, chart series, activity feed, and audit
event is hard-coded or generated from local data in `src/lib/` or inline in the page. Nothing
persists across a page reload. Do not add API calls, auth SDKs, or storage integrations unless
explicitly asked — the "security" in this app is presentational.

## Commands

Package manager is **bun** (`bun.lock` is committed; there is no `package-lock.json`).

```bash
bun install        # install dependencies
bun run dev        # vite dev server (http://localhost:5173)
bun run build      # tsc -b && vite build  → dist/
bun run preview    # serve the production build
```

There are **no tests** and no test runner. `bun run build` is the verification gate — it runs
the TypeScript project build (`tsc -b`) before bundling, so a type error fails the build.
Run it before committing.

`package.json` also declares `"lint": "eslint ."`, but **eslint is not installed and there is
no eslint config** in the repo. That script will fail; don't cite it as a check, and don't add
an eslint setup unless asked.

## Stack

- **React 18** + **TypeScript 5.6** (strict mode), **Vite 5**
- **react-router-dom v6** — `BrowserRouter`, routes declared in `src/App.tsx`
- **Tailwind CSS 3** + **shadcn/ui**-style components over **Radix UI** primitives
- **lucide-react** for icons, **d3 v7** for the two charts
- `@/*` path alias → `./src/*` (configured in both `vite.config.ts` and `tsconfig.app.json` —
  keep them in sync)

`@tanstack/react-query` is a dependency but is **not used anywhere**. Don't reach for it; there
is no server state.

## Layout

```
src/
  main.tsx                    BrowserRouter → PersonaProvider → App
  App.tsx                     route table + PlaceholderPage fallback
  index.css                   Tailwind entry, Signode CSS variables, print rules
  lib/
    personas.ts               PERSONAS + scoping helpers  ← access-control model
    persona-context.tsx       PersonaProvider / usePersona
    folderTree.ts             FOLDER_TREE + findNode/flattenTree
    nistControls.ts           NIST_CONTROLS + CONTROL_FAMILIES
    utils.ts                  cn() — clsx + tailwind-merge
  hooks/use-toast.ts          shadcn toast reducer
  components/
    ui/                       shadcn/ui primitives — generated, don't hand-edit
    signode/                  app-specific shared components
  pages/                      one file per route, named export matching filename
```

### `src/components/ui/`

Standard shadcn/ui components (button, card, dialog, table, select, toast, …). Treat these as
vendored: they follow the upstream shadcn source, use `cva` for variants and `cn()` for class
merging. Prefer composing them over editing them. If a genuinely new primitive is needed, add
it in the same style (Radix primitive + `cva` + `React.forwardRef` + `cn`).

### `src/components/signode/`

| Component | Role |
|---|---|
| `SignodeHeader` | Sticky branded header; owns `NAV_ITEMS`, filters `adminOnly` links to Global Admin |
| `SignInGate` | Blocking, non-dismissible dialog: AUP → MFA method → FIDO2/Authenticator (simulated) |
| `PersonaSwitcher` | Dropdown to switch persona; switching signs you out |
| `SendInvitationDialog` | Only rendered for internal personas; generates a fake invite link |
| `DocPageShell` | Wrapper for the documentation pages — title, "Copy document", "Print to PDF" |
| `CodeBlock` | Dark code panel with language/filename chrome and a copy button |
| `AccessRestricted` | Shown when a persona navigates outside its scope |

## The persona model (the core concept)

`src/lib/personas.ts` is the heart of the app. Six personas — three internal
(`global-admin`, `amer-sales`, `corp-legal`) and three external (`vendor-a`, `vendor-b`,
`project-phoenix`). Each has `scopedPaths`, a list of `FileRoot/...` prefixes; `["*"]` means
everything.

Three helpers define all authorization behavior — **use them, never re-implement the checks
inline**:

```ts
isPathInScope(persona, path)   // exact match or prefix + "/" — the only path check
canSendInvitations(persona)    // === persona.isInternal
getPersonaById(id)             // throws on unknown id
```

Persona state lives in `PersonaProvider` (`src/lib/persona-context.tsx`) as plain React
state — **not persisted**, so a reload resets to `global-admin`, signed out. Read it with
`usePersona()`, which throws if used outside the provider.

Conventions when adding persona-aware UI:

- Gate folder/file access with `isPathInScope`; render `<AccessRestricted attemptedPath={…} />`
  rather than a generic 404 when the path exists but is out of scope.
- Gate invitation-style actions with `canSendInvitations(persona)`, returning `null` to hide
  the control entirely (see `SendInvitationDialog`).
- Admin-only navigation is gated by `persona.id === "global-admin"` in `SignodeHeader`. Adding
  a documentation route means adding it to both `NAV_ITEMS` (with `adminOnly: true`) and the
  route table in `App.tsx`.
- Build folder pickers from `flattenTree(FOLDER_TREE).filter(n => isPathInScope(persona, n.path))`.

## The folder tree

`src/lib/folderTree.ts` is a static `FolderNode` tree rooted at `FileRoot`, with five region
groups: `01_Signode_AMER`, `02_Signode_EMEA`, `03_Signode_APAC`, `04_Signode_APT`,
`05_Signode_CORP`. Each has departments (Operations, Engineering, Sales_and_Marketing,
Finance_and_Accounting, Legal_and_Compliance, …) and, under Operations, business-unit leaves
(`GPAMER`, `GPUK`, …).

Every node carries a **full absolute `path`**, redundantly with its position in the tree. When
adding nodes, write the complete path string — helpers and `scopedPaths` compare on `path`, so
a wrong or relative path silently breaks scoping. Node names use `Underscore_Case`.

## Styling conventions

- **Brand colors are CSS variables**, defined in `src/index.css` under `:root`:
  `--signode-orange`, `--signode-orange-deep`, `--signode-orange-soft`, `--signode-black`,
  `--signode-charcoal`, `--signode-white`, `--signode-cream`. They are raw HSL triples, used as
  arbitrary Tailwind values: `text-[hsl(var(--signode-black))]`,
  `bg-[hsl(var(--signode-orange))]`. The shadcn tokens (`--primary`, `--ring`, …) are mapped
  onto the same palette, so `bg-primary` is the Signode orange too.
- Prefer semantic Tailwind tokens (`text-muted-foreground`, `border`, `bg-card`) for neutral
  chrome; reach for the `--signode-*` arbitrary values for brand accents.
- Utility classes `.signode-gradient`, `.signode-header-gradient`, `.signode-wordmark`,
  `.signode-tagline` live in the `@layer utilities` block of `index.css`.
- **Print matters.** The documentation pages are meant to be printed to PDF. Mark chrome
  (headers, toolbars, nav) with `no-print`; `@media print` in `index.css` hides it and forces a
  white background.
- `darkMode: ["class"]` is configured but **no dark palette is defined and nothing toggles it**.
  Don't write `dark:` variants expecting them to work.
- Status colors are inline Tailwind palettes (`bg-emerald-100 text-emerald-800`,
  `bg-amber-100 …`, `bg-red-100 …`) — see `expiryBadge` in `BrowsePage.tsx` and the status
  badges in `ControlsPage.tsx`. Follow that green/amber/red convention for new status pills.

## Page conventions

- One page per file in `src/pages/`, **named export** matching the filename
  (`export function BrowsePage()`), imported in `App.tsx` via the `@/pages/...` alias. There
  are no default exports outside `App.tsx`.
- Import React as `import * as React from "react"` and use `React.useState` / `React.useEffect`
  rather than named hook imports.
- Documentation pages (`BuildGuidePage`, `ArchitecturePage`, `SecurityPage`, `ControlsPage`,
  `DeploymentPage`, `RunbooksPage`) wrap their body in `<DocPageShell title subtitle>` and use
  `Card` / `Table` / `CodeBlock` sections. Long content lives in module-level `const` arrays
  (`STEPS`, `RECENT_ACTIVITY`, …) declared above the component, then mapped in JSX.
- Portal pages (`HomePage`, `BrowsePage`, `UploadPage`, `RecentPage`, `HelpPage`) render their
  own `mx-auto max-w-5xl px-6 py-8`-style container; there is no shared page layout beyond the
  header.
- Mock data is generated deterministically from the path (see `mockFilesFor` in
  `BrowsePage.tsx`, seeded by `path.length`) so a folder shows the same files every render.
  Keep new mock generators deterministic — avoid `Math.random()` in render paths. (`SignInGate`
  and `SendInvitationDialog` use `Math.random` deliberately, in state initializers/handlers.)
- Charts (`RecentPage`, `SecurityPage`) use the imperative d3 pattern: a
  `React.useRef<SVGSVGElement>`, a `React.useEffect` that does `d3.select(ref.current)`,
  clears, and redraws. Follow that pattern rather than mixing d3 with React rendering.
- User feedback goes through `useToast()` from `@/hooks/use-toast`; `<Toaster />` is already
  mounted in `App.tsx`.

## Known gaps / in-progress state

- `/source` ("Source & IaC") is still a `PlaceholderPage` in `App.tsx`. The placeholder text
  says "filled in during Batches 5–6" — that wording is stale; the other batches shipped.
- `README.md` is a stub containing only the repo name (with a UTF-16 BOM).
- `tsconfig.app.tsbuildinfo` and `tsconfig.node.tsbuildinfo` are committed but are build
  artifacts; they'll show as modified after a build. Leave them out of unrelated commits.
- The production bundle is a single ~570 kB chunk and Vite warns about it. Expected; no
  code-splitting has been set up.
- `BrowsePage.tsx` uses `persona: any` in two local helpers (`hasScopedDescendant`,
  `personaHomePath`). Use the `Persona` type in new code.

## Git workflow

Default branch is `main`. Work on the branch you were assigned, commit with a descriptive
message, and push with `git push -u origin <branch>`. Don't open a pull request unless asked.
