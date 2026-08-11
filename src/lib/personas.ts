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
    scopedPaths: [
      "FileRoot/01_Signode_AMER/Sales_and_Marketing",
    ],
    description:
      "Scoped to AMER Sales & Marketing. Can send invitations to vendors within scope.",
  },
  {
    id: "corp-legal",
    displayName: "CORP Legal",
    role: "Corporate Counsel",
    organization: "Signode CORP",
    isInternal: true,
    scopedPaths: [
      "FileRoot/05_Signode_CORP/Legal_and_Compliance",
      "FileRoot/02_Signode_EMEA/Legal_and_Compliance",
    ],
    description:
      "Scoped to CORP Legal & Compliance and EMEA Legal & Compliance. Can send invitations for NDA and contract exchanges.",
  },
  {
    id: "vendor-a",
    displayName: "Vendor A",
    role: "External Vendor",
    organization: "Acme Packaging Co.",
    isInternal: false,
    scopedPaths: [
      "FileRoot/01_Signode_AMER/Sales_and_Marketing/Customer_Accounts",
    ],
    description:
      "External vendor with access to a single shared folder in AMER Sales & Marketing. Cannot send invitations.",
  },
  {
    id: "vendor-b",
    displayName: "Vendor B",
    role: "External Vendor",
    organization: "Bravo Logistics Ltd.",
    isInternal: false,
    scopedPaths: [
      "FileRoot/02_Signode_EMEA/Operations/EMEA/GPUK",
    ],
    description:
      "External vendor with access to a single EMEA BU folder (GPUK). Cannot send invitations.",
  },
  {
    id: "project-phoenix",
    displayName: "Project Phoenix",
    role: "External Project Team",
    organization: "Phoenix Consulting Group",
    isInternal: false,
    scopedPaths: [
      "FileRoot/05_Signode_CORP/Global_Projects/Active",
    ],
    description:
      "External project team with access to the CORP Active Global Projects folder. Cannot send invitations.",
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