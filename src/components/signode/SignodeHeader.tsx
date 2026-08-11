import { NavLink } from "react-router-dom";
import { PersonaSwitcher } from "./PersonaSwitcher";
import { SendInvitationDialog } from "./SendInvitationDialog";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/browse", label: "Browse" },
  { to: "/upload", label: "Upload" },
  { to: "/recent", label: "Recent" },
  { to: "/help", label: "Help" },
  { to: "/build-guide", label: "Build Guide" },
  { to: "/architecture", label: "Architecture" },
  { to: "/security", label: "Security" },
  { to: "/controls", label: "Controls" },
  { to: "/deployment", label: "Deployment Roadmap" },
  { to: "/runbooks", label: "Runbooks" },
  { to: "/source", label: "Source & IaC" },
];

export function SignodeHeader() {
  return (
    <header className="signode-header-gradient border-b-4 border-[hsl(var(--signode-orange))] no-print sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top row: logo + right-side controls */}
        <div className="flex items-center justify-between py-3">
          <NavLink to="/" className="flex flex-col leading-none">
            <span className="signode-wordmark text-2xl">SIGNODE</span>
            <span className="signode-tagline mt-1">
              Transit Packaging Solutions
            </span>
          </NavLink>
          <div className="flex items-center gap-3">
            <SendInvitationDialog />
            <PersonaSwitcher />
          </div>
        </div>
        {/* Bottom row: nav */}
        <nav className="flex flex-wrap gap-1 pb-2 -mx-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-[hsl(var(--signode-orange))] text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}