export type FolderNode = {
  name: string;
  path: string;
  children?: FolderNode[];
};

// Signode file architecture — 5 top-level region groups, each with departments and BUs
export const FOLDER_TREE: FolderNode = {
  name: "FileRoot",
  path: "FileRoot",
  children: [
    // ================================================================
    // 01 — Signode AMER
    // ================================================================
    {
      name: "01_Signode_AMER",
      path: "FileRoot/01_Signode_AMER",
      children: [
        {
          name: "Operations",
          path: "FileRoot/01_Signode_AMER/Operations",
          children: [
            {
              name: "AMER",
              path: "FileRoot/01_Signode_AMER/Operations/AMER",
              children: [
                { name: "GPAMER", path: "FileRoot/01_Signode_AMER/Operations/AMER/GPAMER" },
                { name: "STXUS", path: "FileRoot/01_Signode_AMER/Operations/AMER/STXUS" },
                { name: "MXAMER", path: "FileRoot/01_Signode_AMER/Operations/AMER/MXAMER" },
                { name: "CAAMER", path: "FileRoot/01_Signode_AMER/Operations/AMER/CAAMER" },
                { name: "BRAMER", path: "FileRoot/01_Signode_AMER/Operations/AMER/BRAMER" },
              ],
            },
          ],
        },
        {
          name: "Engineering",
          path: "FileRoot/01_Signode_AMER/Engineering",
          children: [
            { name: "Design_and_CAD", path: "FileRoot/01_Signode_AMER/Engineering/Design_and_CAD" },
            { name: "Project_Files", path: "FileRoot/01_Signode_AMER/Engineering/Project_Files" },
            { name: "Technical_Library", path: "FileRoot/01_Signode_AMER/Engineering/Technical_Library" },
          ],
        },
        {
          name: "Sales_and_Marketing",
          path: "FileRoot/01_Signode_AMER/Sales_and_Marketing",
          children: [
            { name: "Customer_Accounts", path: "FileRoot/01_Signode_AMER/Sales_and_Marketing/Customer_Accounts" },
            { name: "Proposals_and_Quotes", path: "FileRoot/01_Signode_AMER/Sales_and_Marketing/Proposals_and_Quotes" },
            { name: "Regional_Marketing", path: "FileRoot/01_Signode_AMER/Sales_and_Marketing/Regional_Marketing" },
          ],
        },
        {
          name: "Finance_and_Accounting",
          path: "FileRoot/01_Signode_AMER/Finance_and_Accounting",
          children: [
            { name: "General_Ledger", path: "FileRoot/01_Signode_AMER/Finance_and_Accounting/General_Ledger" },
            { name: "Accounts_Payable", path: "FileRoot/01_Signode_AMER/Finance_and_Accounting/Accounts_Payable" },
            { name: "Financial_Reporting", path: "FileRoot/01_Signode_AMER/Finance_and_Accounting/Financial_Reporting" },
          ],
        },
        {
          name: "Human_Resources",
          path: "FileRoot/01_Signode_AMER/Human_Resources",
          children: [
            { name: "Payroll", path: "FileRoot/01_Signode_AMER/Human_Resources/Payroll" },
            { name: "Talent_Management", path: "FileRoot/01_Signode_AMER/Human_Resources/Talent_Management" },
            { name: "Onboarding_Records", path: "FileRoot/01_Signode_AMER/Human_Resources/Onboarding_Records" },
          ],
        },
      ],
    },

    // ================================================================
    // 02 — Signode EMEA
    // ================================================================
    {
      name: "02_Signode_EMEA",
      path: "FileRoot/02_Signode_EMEA",
      children: [
        {
          name: "Operations",
          path: "FileRoot/02_Signode_EMEA/Operations",
          children: [
            {
              name: "EMEA",
              path: "FileRoot/02_Signode_EMEA/Operations/EMEA",
              children: [
                { name: "STXDE", path: "FileRoot/02_Signode_EMEA/Operations/EMEA/STXDE" },
                { name: "GPUK", path: "FileRoot/02_Signode_EMEA/Operations/EMEA/GPUK" },
                { name: "BELEM", path: "FileRoot/02_Signode_EMEA/Operations/EMEA/BELEM" },
                { name: "FRAEM", path: "FileRoot/02_Signode_EMEA/Operations/EMEA/FRAEM" },
                { name: "ITAEM", path: "FileRoot/02_Signode_EMEA/Operations/EMEA/ITAEM" },
              ],
            },
          ],
        },
        { name: "Engineering", path: "FileRoot/02_Signode_EMEA/Engineering" },
        { name: "Sales_and_Marketing", path: "FileRoot/02_Signode_EMEA/Sales_and_Marketing" },
        { name: "Finance_and_Accounting", path: "FileRoot/02_Signode_EMEA/Finance_and_Accounting" },
        { name: "Human_Resources", path: "FileRoot/02_Signode_EMEA/Human_Resources" },
        {
          name: "Legal_and_Compliance",
          path: "FileRoot/02_Signode_EMEA/Legal_and_Compliance",
          children: [
            { name: "Contract_Management", path: "FileRoot/02_Signode_EMEA/Legal_and_Compliance/Contract_Management" },
            { name: "Regulatory_EMEA", path: "FileRoot/02_Signode_EMEA/Legal_and_Compliance/Regulatory_EMEA" },
            { name: "GDPR_Records", path: "FileRoot/02_Signode_EMEA/Legal_and_Compliance/GDPR_Records" },
          ],
        },
      ],
    },

    // ================================================================
    // 03 — Signode APAC
    // ================================================================
    {
      name: "03_Signode_APAC",
      path: "FileRoot/03_Signode_APAC",
      children: [
        {
          name: "Operations",
          path: "FileRoot/03_Signode_APAC/Operations",
          children: [
            {
              name: "APAC",
              path: "FileRoot/03_Signode_APAC/Operations/APAC",
              children: [
                { name: "INBPRIME", path: "FileRoot/03_Signode_APAC/Operations/APAC/INBPRIME" },
                { name: "INBWIN", path: "FileRoot/03_Signode_APAC/Operations/APAC/INBWIN" },
                { name: "JPTKYO", path: "FileRoot/03_Signode_APAC/Operations/APAC/JPTKYO" },
                { name: "AUMEL", path: "FileRoot/03_Signode_APAC/Operations/APAC/AUMEL" },
                { name: "SGSIN", path: "FileRoot/03_Signode_APAC/Operations/APAC/SGSIN" },
              ],
            },
          ],
        },
        { name: "Engineering", path: "FileRoot/03_Signode_APAC/Engineering" },
        { name: "Sales_and_Marketing", path: "FileRoot/03_Signode_APAC/Sales_and_Marketing" },
        { name: "Finance_and_Accounting", path: "FileRoot/03_Signode_APAC/Finance_and_Accounting" },
        { name: "Human_Resources", path: "FileRoot/03_Signode_APAC/Human_Resources" },
      ],
    },

    // ================================================================
    // 04 — Signode APT
    // ================================================================
    {
      name: "04_Signode_APT",
      path: "FileRoot/04_Signode_APT",
      children: [
        {
          name: "Automation_and_Canmaking_Solutions",
          path: "FileRoot/04_Signode_APT/Automation_and_Canmaking_Solutions",
          children: [
            { name: "Engineering", path: "FileRoot/04_Signode_APT/Automation_and_Canmaking_Solutions/Engineering" },
            { name: "Sales", path: "FileRoot/04_Signode_APT/Automation_and_Canmaking_Solutions/Sales" },
            { name: "Service_Support", path: "FileRoot/04_Signode_APT/Automation_and_Canmaking_Solutions/Service_Support" },
          ],
        },
        { name: "Gateway_Engineering", path: "FileRoot/04_Signode_APT/Gateway_Engineering" },
        { name: "Packaging_Technologies", path: "FileRoot/04_Signode_APT/Packaging_Technologies" },
        { name: "Reliability_Services", path: "FileRoot/04_Signode_APT/Reliability_Services" },
        { name: "Signode_Packaging_Systems", path: "FileRoot/04_Signode_APT/Signode_Packaging_Systems" },
      ],
    },

    // ================================================================
    // 05 — Signode CORP
    // ================================================================
    {
      name: "05_Signode_CORP",
      path: "FileRoot/05_Signode_CORP",
      children: [
        { name: "Executive_Leadership", path: "FileRoot/05_Signode_CORP/Executive_Leadership" },
        {
          name: "Legal_and_Compliance",
          path: "FileRoot/05_Signode_CORP/Legal_and_Compliance",
          children: [
            { name: "Contract_Management", path: "FileRoot/05_Signode_CORP/Legal_and_Compliance/Contract_Management" },
            { name: "Litigation", path: "FileRoot/05_Signode_CORP/Legal_and_Compliance/Litigation" },
          ],
        },
        {
          name: "Finance_and_Accounting",
          path: "FileRoot/05_Signode_CORP/Finance_and_Accounting",
          children: [
            { name: "Investor_Relations", path: "FileRoot/05_Signode_CORP/Finance_and_Accounting/Investor_Relations" },
            { name: "Internal_Audit", path: "FileRoot/05_Signode_CORP/Finance_and_Accounting/Internal_Audit" },
            { name: "Risk_Management", path: "FileRoot/05_Signode_CORP/Finance_and_Accounting/Risk_Management" },
          ],
        },
        {
          name: "Human_Resources",
          path: "FileRoot/05_Signode_CORP/Human_Resources",
          children: [
            { name: "Global_Payroll_Policy", path: "FileRoot/05_Signode_CORP/Human_Resources/Global_Payroll_Policy" },
            { name: "Talent_Management", path: "FileRoot/05_Signode_CORP/Human_Resources/Talent_Management" },
            { name: "Board_and_Governance", path: "FileRoot/05_Signode_CORP/Human_Resources/Board_and_Governance" },
          ],
        },
        {
          name: "Information_Technology",
          path: "FileRoot/05_Signode_CORP/Information_Technology",
          children: [
            { name: "Infrastructure", path: "FileRoot/05_Signode_CORP/Information_Technology/Infrastructure" },
            { name: "Security", path: "FileRoot/05_Signode_CORP/Information_Technology/Security" },
            { name: "Identity_Management", path: "FileRoot/05_Signode_CORP/Information_Technology/Identity_Management" },
            { name: "Disaster_Recovery", path: "FileRoot/05_Signode_CORP/Information_Technology/Disaster_Recovery" },
          ],
        },
        {
          name: "Global_Projects",
          path: "FileRoot/05_Signode_CORP/Global_Projects",
          children: [
            { name: "Active", path: "FileRoot/05_Signode_CORP/Global_Projects/Active" },
            { name: "Completed", path: "FileRoot/05_Signode_CORP/Global_Projects/Completed" },
            { name: "Templates", path: "FileRoot/05_Signode_CORP/Global_Projects/Templates" },
          ],
        },
        { name: "Archive", path: "FileRoot/05_Signode_CORP/Archive" },
      ],
    },
  ],
};

export function findNode(root: FolderNode, path: string): FolderNode | null {
  if (root.path === path) return root;
  if (!root.children) return null;
  for (const c of root.children) {
    const hit = findNode(c, path);
    if (hit) return hit;
  }
  return null;
}

export function flattenTree(root: FolderNode): FolderNode[] {
  const out: FolderNode[] = [root];
  if (root.children) {
    for (const c of root.children) out.push(...flattenTree(c));
  }
  return out;
}