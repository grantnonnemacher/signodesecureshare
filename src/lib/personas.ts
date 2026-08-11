export type PersonaId =
  | "global-admin"
  | "amer-sales"
  | "corp-legal"
  | "vendor-a"
  | "vendor-b"
  | "project-phoenix";

export type Persona = {
  id: PersonaId;
  displayName: string;
  role: string;
  organization: string;
  isInternal: boolean;
  scopedPaths: string[]; // path prefixes this persona can see; "*" = everything
  description: string;
};

export const PERSONAS: Persona[] = [
  {
    id: "global-admin",
    displayName: "Global Admin",
    role: "Portal Administrator",
    organization: "Signode IT",
    isInternal: true,
    scopedPaths: ["*"],
    description:
      "Full access to every region, department, and BU folder. Can send invitations and manage users.",
  },
  {
    id: "amer-sales",
    displayName: "AMER Sales",
    role: "Regional Sales Lead",
    organization: "Signode AMER",
    isInternal: true,
    scopedPaths: ["Home/AMER/Sales", "Home/AMER/Marketing"],
    description:
      "Scoped to AMER Sales and Marketing folders. Can send invitations to vendors within scope.",
  },
  {
    id: "corp-legal",
    displayName: "CORP Legal",
    role: "Corporate Counsel",
    organization: "Signode CORP",
    isInternal: true,
    scopedPaths: ["Home/CORP/Legal", "Home/CORP/Compliance"],
    description:
      "Scoped to CORP Legal and Compliance folders. Can send invitations for NDA and contract exchanges.",
  },
  {
    id: "vendor-a",
    displayName: "Vendor A",
    role: "External Vendor",
    organization: "Acme Packaging Co.",
    isInternal: false,
    scopedPaths: ["Home/AMER/Sales/Vendor-A"],
    description:
      "External vendor with access to a single shared folder. Cannot send invitations.",
  },
  {
    id: "vendor-b",
    displayName: "Vendor B",
    role: "External Vendor",
    organization: "Bravo Logistics Ltd.",
    isInternal: false,
    scopedPaths: ["Home/EMEA/Procurement/Vendor-B"],
    description:
      "External vendor with access to a single shared folder. Cannot send invitations.",
  },
  {
    id: "project-phoenix",
    displayName: "Project Phoenix",
    role: "External Project Team",
    organization: "Phoenix Consulting Group",
    isInternal: false,
    scopedPaths: ["Home/CORP/Projects/Phoenix"],
    description:
      "External project team with access to a single project folder. Cannot send invitations.",
  },
];

export function getPersonaById(id: PersonaId): Persona {
  const p = PERSONAS.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown persona: ${id}`);
  return p;
}

export function isPathInScope(persona: Persona, path: string): boolean {
  if (persona.scopedPaths.includes("*")) return true;
  return persona.scopedPaths.some(
    (allowed) => path === allowed || path.startsWith(allowed + "/")
  );
}

export function canSendInvitations(persona: Persona): boolean {
  return persona.isInternal;
}