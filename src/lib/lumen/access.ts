import type { Doc, Grant, Role } from "./data";
import { ROLE_USERS } from "./data";
import { grantStatus } from "./store";

export type NavKey = "dashboard" | "library" | "me" | "media" | "prepare" | "release" | "grants" | "team" | "audit" | "system";

const EMPLOYEE: NavKey[] = ["dashboard", "library", "me", "media"];
export const ROLE_NAV: Record<Role, NavKey[]> = {
  Employee: EMPLOYEE,
  "Document Owner": [...EMPLOYEE, "prepare"],
  Releaser: [...EMPLOYEE, "release"],
  Manager: [...EMPLOYEE, "team"],
  Administrator: [...EMPLOYEE, "prepare", "release", "grants", "team", "audit", "system"],
  "External Reviewer": ["library"],
};

export const canAccess = (role: Role, key: NavKey) => ROLE_NAV[role].includes(key);

/** Frontend-only simulation of document visibility. Real enforcement happens on the backend. */
export function visibleDocs(role: Role, docs: Doc[], grants: Grant[]): Doc[] {
  if (role === "External Reviewer") {
    const email = ROLE_USERS[role].email;
    const ids = new Set(grants.filter((g) => g.email === email && grantStatus(g) === "Active").flatMap((g) => g.docIds));
    return docs.filter((d) => ids.has(d.id) && d.status === "Approved & Current");
  }
  if (role === "Administrator" || role === "Document Owner" || role === "Releaser") return docs;
  return docs.filter((d) => d.status !== "Under Review" && d.status !== "Returned for Correction");
}
