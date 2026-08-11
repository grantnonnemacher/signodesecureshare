export type FolderNode = {
  name: string;
  path: string;
  children?: FolderNode[];
};

// Signode 5-region folder tree
export const FOLDER_TREE: FolderNode = {
  name: "Home",
  path: "Home",
  children: [
    {
      name: "AMER",
      path: "Home/AMER",
      children: [
        {
          name: "Sales",
          path: "Home/AMER/Sales",
          children: [
            { name: "Vendor-A", path: "Home/AMER/Sales/Vendor-A" },
            { name: "Quotes", path: "Home/AMER/Sales/Quotes" },
            { name: "Contracts", path: "Home/AMER/Sales/Contracts" },
          ],
        },
        {
          name: "Marketing",
          path: "Home/AMER/Marketing",
          children: [
            { name: "Campaigns", path: "Home/AMER/Marketing/Campaigns" },
            { name: "Assets", path: "Home/AMER/Marketing/Assets" },
          ],
        },
        {
          name: "Operations",
          path: "Home/AMER/Operations",
          children: [
            { name: "Plants", path: "Home/AMER/Operations/Plants" },
            { name: "Logistics", path: "Home/AMER/Operations/Logistics" },
          ],
        },
      ],
    },
    {
      name: "EMEA",
      path: "Home/EMEA",
      children: [
        {
          name: "Procurement",
          path: "Home/EMEA/Procurement",
          children: [
            { name: "Vendor-B", path: "Home/EMEA/Procurement/Vendor-B" },
            { name: "RFQs", path: "Home/EMEA/Procurement/RFQs" },
          ],
        },
        {
          name: "Finance",
          path: "Home/EMEA/Finance",
          children: [
            { name: "AP", path: "Home/EMEA/Finance/AP" },
            { name: "AR", path: "Home/EMEA/Finance/AR" },
          ],
        },
        { name: "HR", path: "Home/EMEA/HR" },
      ],
    },
    {
      name: "APAC",
      path: "Home/APAC",
      children: [
        {
          name: "Sales",
          path: "Home/APAC/Sales",
          children: [
            { name: "Distributors", path: "Home/APAC/Sales/Distributors" },
          ],
        },
        {
          name: "Manufacturing",
          path: "Home/APAC/Manufacturing",
          children: [
            { name: "QA", path: "Home/APAC/Manufacturing/QA" },
            { name: "Suppliers", path: "Home/APAC/Manufacturing/Suppliers" },
          ],
        },
      ],
    },
    {
      name: "APT",
      path: "Home/APT",
      children: [
        {
          name: "Engineering",
          path: "Home/APT/Engineering",
          children: [
            { name: "R&D", path: "Home/APT/Engineering/R&D" },
            { name: "IP", path: "Home/APT/Engineering/IP" },
          ],
        },
        {
          name: "Product",
          path: "Home/APT/Product",
          children: [
            { name: "Roadmap", path: "Home/APT/Product/Roadmap" },
            { name: "Specs", path: "Home/APT/Product/Specs" },
          ],
        },
      ],
    },
    {
      name: "CORP",
      path: "Home/CORP",
      children: [
        {
          name: "Legal",
          path: "Home/CORP/Legal",
          children: [
            { name: "NDAs", path: "Home/CORP/Legal/NDAs" },
            { name: "Contracts", path: "Home/CORP/Legal/Contracts" },
          ],
        },
        {
          name: "Compliance",
          path: "Home/CORP/Compliance",
          children: [
            { name: "Audits", path: "Home/CORP/Compliance/Audits" },
            { name: "Policies", path: "Home/CORP/Compliance/Policies" },
          ],
        },
        {
          name: "Projects",
          path: "Home/CORP/Projects",
          children: [
            { name: "Phoenix", path: "Home/CORP/Projects/Phoenix" },
            { name: "Titan", path: "Home/CORP/Projects/Titan" },
          ],
        },
        { name: "Finance", path: "Home/CORP/Finance" },
        { name: "IT", path: "Home/CORP/IT" },
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