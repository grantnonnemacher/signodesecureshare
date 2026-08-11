# CLAUDE.md

Guidance for AI assistants working in this repository.

## What this project is

**Signode SecureShare Portal** — a React SPA that *demonstrates* a Signode-branded,
internet-facing secure file-exchange portal. It is a front-end prototype and
documentation vehicle, not a working file-transfer system.

Two things follow from that, and they drive nearly every decision in the codebase:

1. **There is no backend.** No API calls, no auth provider, no storage. Every file,
   folder, upload, sign-in, MFA challenge, and metric is mock data or a simulated
   `setTimeout` in the component that renders it. The architecture the app describes
   (Azure Static Web Apps → .NET 8 Function API → SharePoint Online, Entra External ID,
   Purview DLP, Sentinel) is the *proposed* design, documented in the app's own pages —
   none of it is wired up.
2. **Access control is presentational.** Persona scoping hides UI and filters mock
   lists. It is not a security boundary and must never be described as one.

The app serves two audiences from one shell: end-user pages (Home, Browse, Upload,
Recent, Help) that demo the portal experience, and admin-only documentation pages
(Build Guide, Architecture, Security, Controls, Deployment Roadmap, Runbooks) that
present the implementation plan and a NIST 800-53 control matrix.

## Commands

```bash
bun install       # install dependencies (bun.lock is the committed lockfile)
bun run dev       # Vite dev server at http://localhost:5173
bun run build     # tsc -b && vite build  → dist/
bun run preview   # serve the production build
```

- **Bun is the package manager.** `bun.lock` is committed; `bun.lockb` is gitignored.
  npm works but will produce a competing lockfile — don't commit one.
- **`bun run lint` is broken.** The script is `eslint .`, but eslint is not a
  dependency and there is no flat config (`eslint.config.js`) in the repo. It exits
  with a config-migration error. Either fix it properly (add `eslint`,
  `@typescript-eslint`, `eslint-plugin-react-hooks`, and a flat config) or leave it
  alone — do not report "lint passes."
- **There are no tests** and no test runner. `bun run build` (which runs `tsc -b`
  first) is the only verification gate. Run it before committing.
- **No CI workflows** exist in this repo. The GitHub Actions pipelines described on
  the Deployment and Runbooks pages are proposed, not real.

## Stack

React 18 · TypeScript 5.6 (strict) · Vite 5 · React Router 6 · Tailwind CSS 3 ·
Radix UI primitives · lucide-react icons · d3 v7 for charts.

`@tanstack/react-query` is in `package.json` but **is not used anywhere** — no
provider is mounted. Don't reach for it assuming it's set up; if you introduce data
fetching, wire the provider first.

Path alias `@/*` → `./src/*`, declared in **both** `vite.config.ts` (resolve.alias)
and `tsconfig.app.json` (paths). Changing one without the other breaks either the
build or the type-check.

## Layout

```
src/
  main.tsx                    BrowserRouter → PersonaProvider → App
  App.tsx                     route table + PlaceholderPage fallback
  index.css                   Tailwind entry, Signode CSS variables, print rules
  lib/
    personas.ts               PERSONAS + isPathInScope / canSendInvitations
    persona-context.tsx       PersonaProvider / usePersona
    folderTree.ts             FOLDER_TREE + findNode / flattenTree
    nistControls.ts           NIST_CONTROLS + CONTROL_FAMILIES
    utils.ts                  cn()
  hooks/use-toast.ts          reducer-based toast store (shadcn pattern)
  components/
    ui/                       shadcn/Radix primitives — treat as vendored
    signode/                  app-specific shared components
  pages/                      one component per route, named export
```

### `src/components/ui/` is vendored

These are standard shadcn/ui components (cva variants, `React.forwardRef`,
`cn()` merging, `displayName`). Treat them as third-party: don't restyle them to
look "Signode," and don't add app logic to them. Brand styling belongs at the call
site or in `src/components/signode/`. To add a primitive, follow the existing files'
shape exactly.

### `src/components/signode/`

| Component | Role |
| --- | --- |
| `SignodeHeader` | Wordmark, nav, persona switcher, invite button. Owns `NAV_ITEMS` and the `adminOnly` filter. |
| `SignInGate` | Blocking modal: AUP → MFA method → FIDO2 / Authenticator. Simulated; any click signs you in. |
| `PersonaSwitcher` | Dropdown grouped Internal / External. Switching signs you out. |
| `SendInvitationDialog` | Renders `null` for external personas. Generates a fake link with `Math.random()`. |
| `DocPageShell` | Wrapper for every admin doc page: title, "Copy document" (reads `innerText`), "Print to PDF". |
| `CodeBlock` | Dark code block with copy button. |
| `AccessRestricted` | The scope-denied panel. Shows the attempted path. |

## The two systems you must understand

Almost every change touches one of these.

### 1. Personas and scope (`src/lib/personas.ts`)

Six hardcoded personas — three internal (`global-admin`, `amer-sales`, `corp-legal`),
three external (`vendor-a`, `vendor-b`, `project-phoenix`). Each carries
`scopedPaths: string[]`, where `["*"]` means everything.

Three rules encoded in helpers — use them, never re-implement the checks inline:

- `isPathInScope(persona, path)` — exact match or prefix match on `allowed + "/"`.
- `canSendInvitations(persona)` — equivalent to `persona.isInternal`.
- Admin-ness in the UI is tested **two different ways** and they are not
  interchangeable:
  - `persona.id === "global-admin"` gates the admin nav items in `SignodeHeader`.
  - `persona.scopedPaths.includes("*")` gates the full folder tree in `BrowsePage`.

  Today only `global-admin` satisfies either. If you add a persona, decide
  deliberately which gate it should pass.

Persona state lives in React state only — nothing is persisted, so a page reload
resets to `global-admin`, signed out. Switching persona sets `isSignedIn: false`,
which re-opens `SignInGate`; this is intentional, it makes the MFA flow demoable.

### 2. The folder tree (`src/lib/folderTree.ts`)

A single nested `FolderNode` literal rooted at `FileRoot`, with five regions
(`01_Signode_AMER` … `05_Signode_CORP`). Every node carries its **full path** as a
string, duplicated from its position in the tree.

**The duplication is load-bearing.** `path` is the identity used by scope checks,
`findNode`, breadcrumbs, and the `?path=` URL param. When adding or renaming a node
you must update the `path` on that node *and every descendant*, or scope checks
silently fail. Renaming a folder also invalidates any `scopedPaths` entry in
`personas.ts` that points into it — grep for the old path before you finish.

`flattenTree(FOLDER_TREE)` + `isPathInScope` is the standard idiom for building a
folder picker (see `UploadPage`, `SendInvitationDialog`).

## Routing

Routes are declared in `App.tsx`; nav links in `SignodeHeader`. **Adding a page means
editing both** — a route with no nav entry is unreachable except by URL, and a nav
entry with no route falls through to `PlaceholderPage`.

Current state: `/source` (Source & IaC) is still a `PlaceholderPage`, and the
placeholder text references "Batches 5–6" from the original build sequence. The
`*` catch-all also renders `PlaceholderPage` as a 404.

`BrowsePage` is the only route with a URL param: `?path=<folder path>`, via
`useSearchParams`. It branches hard on admin-ness — admins get the left-hand
`TreeNode` tree plus detail pane; everyone else gets `ScopedBrowser`, which has no
tree and shows breadcrumbs *relative to their scope root* so the folder hierarchy
above them is never revealed. Out-of-scope paths (including hand-typed URLs) render
`AccessRestricted`.

## Conventions

**Components.** Named exports for pages and signode components (`export function
HomePage()`); `App` is the one default export. Function declarations, not arrow
consts. Small presentational helpers (`StatCard`, `QuickAction`, `ComponentTile`,
`expiryBadge`) live at the bottom of the file that uses them — don't hoist them into
shared modules unless a second file genuinely needs them.

**React import style.** `import * as React from "react"` in files using hooks; omit
entirely in files that don't (JSX runtime is `react-jsx`).

**Styling.** Tailwind utilities inline. Brand colors are CSS variables holding *raw
HSL triples*, so they're always used as `hsl(var(--token))`:

```tsx
className="text-[hsl(var(--signode-black))]"
className="bg-[hsl(var(--signode-orange))] hover:bg-[hsl(var(--signode-orange-deep))]"
```

Tokens: `--signode-orange`, `-orange-deep`, `-orange-soft`, `--signode-black`,
`--signode-charcoal`, `--signode-white`, `--signode-cream`, plus the shadcn set
(`--primary`, `--muted`, `--border`, …) mapped onto the brand palette in
`src/index.css`. Utility classes `signode-gradient`, `signode-header-gradient`,
`signode-wordmark`, `signode-tagline` are defined there too.

Conditional classes use `[...].filter(Boolean).join(" ")` inline in this codebase,
though `cn()` from `@/lib/utils` is available and preferred for new code.

Semantic status colors are plain Tailwind palette values, not tokens —
`bg-emerald-100 text-emerald-800` (healthy), `amber` (warning), `red` (critical).
Keep that mapping consistent.

`darkMode: ["class"]` is configured but **no dark palette exists** and nothing
toggles the class. The app is light-only; don't write `dark:` variants.

**Print.** Doc pages are meant to be printed to PDF. Add `no-print` to any chrome
(headers, toolbars, tab bars) that shouldn't appear on paper; the rule lives in the
`@media print` block in `index.css`.

**Mock data.** Declared as module-level `const` arrays at the top of the page that
renders them (`RECENT_ACTIVITY`, `RUNBOOKS`, `MFA_COMPLIANCE`, `VULN_SLA`). Shared
data — the folder tree, personas, NIST controls — lives in `src/lib/`. Follow that
split.

**d3 charts** (`RecentPage`, `SecurityPage`) follow one pattern: a `useRef<SVGSVGElement>`,
a `useEffect` that does `svg.selectAll("*").remove()` before redrawing, margins, band/linear
scales, manual axis styling. Match it rather than introducing a charting library.

**Toasts.** `const { toast } = useToast()` from `@/hooks/use-toast`; `<Toaster />` is
already mounted once in `App.tsx`. Use `variant: "destructive"` for errors.

## Gotchas

- **`tsconfig.app.tsbuildinfo` and `tsconfig.node.tsbuildinfo` are committed** and get
  rewritten by every `tsc -b`. They'll show up dirty in `git status` after a build.
  Don't include them in commits as if they were changes; ideally they'd be gitignored.
- **`README.md` is a 46-byte UTF-16 stub** containing just the repo name. The real
  README content exists as a template string inside `src/pages/BuildGuidePage.tsx`.
  If asked to write a README, use that as the source.
- **`index.html` starts with a BOM.** Preserve it when editing.
- **`.gitignore` lists `bun.lockb`, not `bun.lock`** — the committed lockfile is the
  text-format `bun.lock`. That's intended.
- **Bundle is ~568 kB** and Vite warns about it on every build. Expected; d3 and Radix
  dominate. No code-splitting is configured.
- **`main.tsx` has `// @ts-ignore` on the CSS side-effect import.** Leave it; there's
  no `vite/client` type reference in `tsconfig.app.json`.
- `noUnusedLocals` and `noUnusedParameters` are **off**, so unused imports won't fail
  the build. Clean up after yourself manually.
- `hasScopedDescendant` and `personaHomePath` in `BrowsePage.tsx` take `persona: any`.
  Typing them to `Persona` would be a small, safe improvement.

## Working in this repo

- Match the persona/scope model when adding any feature that shows data — ask "what
  does `vendor-a` see?" before shipping it. Verify with the persona switcher.
- Keep the demo honest: simulated behavior should look real but must not claim to be
  real. Existing flows label themselves (`(Simulation — click below…)`, "Switch
  persona (demo)"). Preserve those labels.
- Don't add real network calls, credentials, or third-party endpoints. Nothing here
  should reach outside the browser.
- The security posture described across the Architecture / Security / Controls /
  Runbooks pages is aspirational design documentation. Update it as documentation
  when it changes; don't treat it as a description of implemented behavior.
- Verify with `bun run build` before committing.
