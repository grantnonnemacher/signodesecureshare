import { usePersona } from "@/lib/persona-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, UserCircle2 } from "lucide-react";

export function PersonaSwitcher() {
  const { persona, personas, setPersonaId } = usePersona();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10 hover:text-white gap-2 h-auto py-2"
        >
          <UserCircle2 className="h-5 w-5 text-[hsl(var(--signode-orange))]" />
          <div className="flex flex-col items-start leading-tight">
            <span className="text-xs opacity-80">Signed in as</span>
            <span className="text-sm font-semibold">{persona.displayName}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Switch persona (demo)</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Internal
        </DropdownMenuLabel>
        {personas
          .filter((p) => p.isInternal)
          .map((p) => (
            <DropdownMenuItem
              key={p.id}
              onClick={() => setPersonaId(p.id)}
              className="flex flex-col items-start gap-0.5"
            >
              <span className="font-medium">{p.displayName}</span>
              <span className="text-xs text-muted-foreground">{p.role}</span>
            </DropdownMenuItem>
          ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          External
        </DropdownMenuLabel>
        {personas
          .filter((p) => !p.isInternal)
          .map((p) => (
            <DropdownMenuItem
              key={p.id}
              onClick={() => setPersonaId(p.id)}
              className="flex flex-col items-start gap-0.5"
            >
              <span className="font-medium">{p.displayName}</span>
              <span className="text-xs text-muted-foreground">
                {p.organization}
              </span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}