export type Role = "Administrator" | "Employee" | "Document Owner" | "Releaser" | "Manager" | "External Reviewer";
export type Classification = "D2" | "D3";
export type DocStatus = "Approved & Current" | "Under Review" | "Superseded" | "Returned for Correction";

export const ROLES: Role[] = ["Administrator", "Employee", "Document Owner", "Releaser", "Manager", "External Reviewer"];

export const ROLE_USERS: Record<Role, { name: string; email: string; dept: string }> = {
  Administrator: { name: "Ayesha Malik", email: "ayesha.malik@green.com", dept: "IT Governance" },
  Employee: { name: "Bilal Ahmed", email: "bilal.ahmed@green.com", dept: "Operations" },
  "Document Owner": { name: "Sarah Khan", email: "sarah.khan@green.com", dept: "Quality" },
  Releaser: { name: "Omar Farooq", email: "omar.farooq@green.com", dept: "Document Control" },
  Manager: { name: "Fatima Raza", email: "fatima.raza@green.com", dept: "Operations" },
  "External Reviewer": { name: "James Carter", email: "j.carter@auditpartners.co", dept: "External Auditor" },
};

export const FAMILIES = [
  "HR & Induction", "Health and Safety", "Quality & Certification", "Engineering Standards",
  "Environment", "Information Technology", "Corporate Governance", "Operations",
];
export const READER_CLASSES = ["All Staff", "Site Staff", "Engineering", "Management", "Contractors", "External Auditors"];
export const STATUSES: DocStatus[] = ["Approved & Current", "Under Review", "Superseded", "Returned for Correction"];

export interface Doc {
  id: string;
  title: string;
  ref: string;
  family: string;
  version: string;
  classification: Classification;
  status: DocStatus;
  publishedDate?: string;
  owner: string;
  readerClasses: string[];
  preparedBy: string;
  submittedDate: string;
  changeSummary: string;
  ackRequired: boolean;
  fileName?: string;
  returnNote?: string;
}

const d = (o: Partial<Doc> & Pick<Doc, "id" | "title" | "ref" | "family" | "version">): Doc => ({
  classification: "D2", status: "Approved & Current", publishedDate: "2026-06-12", owner: "Sarah Khan",
  readerClasses: ["All Staff"], preparedBy: "Sarah Khan", submittedDate: "2026-06-05",
  changeSummary: "Periodic review and update.", ackRequired: true, ...o,
});

export const SEED_DOCS: Doc[] = [
  d({ id: "doc-001", title: "Employee Code of Conduct", ref: "GL-HR-POL-001", family: "HR & Induction", version: "4.0", publishedDate: "2026-09-02", owner: "Hina Siddiqui" }),
  d({ id: "doc-002", title: "Employee Code of Conduct", ref: "GL-HR-POL-001", family: "HR & Induction", version: "3.2", status: "Superseded", publishedDate: "2025-08-14", owner: "Hina Siddiqui" }),
  d({ id: "doc-003", title: "Workplace Safety Policy", ref: "GL-HS-POL-002", family: "Health and Safety", version: "5.1", publishedDate: "2026-08-21", owner: "Usman Tariq", readerClasses: ["All Staff", "Site Staff", "Contractors"] }),
  d({ id: "doc-004", title: "Document Control Procedure", ref: "GL-QA-PRO-010", family: "Quality & Certification", version: "2.3", publishedDate: "2026-07-30", classification: "D3", readerClasses: ["Management", "Engineering"] }),
  d({ id: "doc-005", title: "Information Security Guidelines", ref: "GL-IT-GDL-004", family: "Information Technology", version: "3.0", publishedDate: "2026-09-10", owner: "Ayesha Malik", classification: "D3" }),
  d({ id: "doc-006", title: "New Employee Induction Guide", ref: "GL-HR-GDE-003", family: "HR & Induction", version: "6.0", publishedDate: "2026-05-18", owner: "Hina Siddiqui" }),
  d({ id: "doc-007", title: "Engineering Design Standards", ref: "GL-EN-STD-021", family: "Engineering Standards", version: "7.2", publishedDate: "2026-04-09", owner: "Kamran Ali", classification: "D3", readerClasses: ["Engineering"] }),
  d({ id: "doc-008", title: "Environmental Management Procedure", ref: "GL-EV-PRO-005", family: "Environment", version: "2.0", publishedDate: "2026-03-22", owner: "Nadia Hussain" }),
  d({ id: "doc-009", title: "Contractor Safety Induction", ref: "GL-HS-IND-007", family: "Health and Safety", version: "3.4", publishedDate: "2026-08-01", owner: "Usman Tariq", readerClasses: ["Contractors", "Site Staff"] }),
  d({ id: "doc-010", title: "Anti-Bribery & Corruption Policy", ref: "GL-CG-POL-002", family: "Corporate Governance", version: "2.1", publishedDate: "2026-02-15", owner: "Zainab Qureshi", readerClasses: ["All Staff", "Management"] }),
  d({ id: "doc-011", title: "Plant Operations Manual", ref: "GL-OP-MAN-001", family: "Operations", version: "9.0", publishedDate: "2026-06-28", owner: "Fatima Raza", classification: "D3", readerClasses: ["Site Staff", "Management"] }),
  d({ id: "doc-012", title: "Internal Audit Procedure", ref: "GL-QA-PRO-014", family: "Quality & Certification", version: "1.5", publishedDate: "2026-01-11", readerClasses: ["Management", "External Auditors"] }),
  d({ id: "doc-013", title: "Waste Handling & Disposal Standard", ref: "GL-EV-STD-008", family: "Environment", version: "1.2", publishedDate: "2025-12-04", owner: "Nadia Hussain", readerClasses: ["Site Staff"] }),
  d({ id: "doc-014", title: "Acceptable Use of IT Assets", ref: "GL-IT-POL-001", family: "Information Technology", version: "4.3", publishedDate: "2026-07-07", owner: "Ayesha Malik" }),
  d({ id: "doc-015", title: "Workplace Safety Policy", ref: "GL-HS-POL-002", family: "Health and Safety", version: "5.0", status: "Superseded", publishedDate: "2025-10-02", owner: "Usman Tariq" }),
  d({ id: "doc-016", title: "Electrical Isolation Standard", ref: "GL-EN-STD-030", family: "Engineering Standards", version: "2.0", status: "Under Review", publishedDate: undefined, owner: "Kamran Ali", preparedBy: "Sarah Khan", submittedDate: "2026-10-12", classification: "D3", changeSummary: "Aligned with revised IEC 60204 clauses.", readerClasses: ["Engineering", "Site Staff"] }),
  d({ id: "doc-017", title: "Document Control Procedure", ref: "GL-QA-PRO-010", family: "Quality & Certification", version: "2.4", status: "Under Review", publishedDate: undefined, preparedBy: "Omar Farooq", submittedDate: "2026-10-15", changeSummary: "Added retention schedule appendix.", classification: "D3", readerClasses: ["Management", "Engineering"] }),
  d({ id: "doc-018", title: "Emergency Response Plan", ref: "GL-HS-PLN-011", family: "Health and Safety", version: "1.0", status: "Under Review", publishedDate: undefined, owner: "Usman Tariq", preparedBy: "Ayesha Malik", submittedDate: "2026-10-16", changeSummary: "First issue." }),
];

export interface Assignment { docId: string; assignedDate: string; progress: number; acknowledged: boolean; ackAt?: string }
export const SEED_ASSIGNMENTS: Assignment[] = [
  { docId: "doc-001", assignedDate: "2026-09-03", progress: 100, acknowledged: true, ackAt: "2026-09-05T10:12:00Z" },
  { docId: "doc-003", assignedDate: "2026-08-22", progress: 40, acknowledged: false },
  { docId: "doc-005", assignedDate: "2026-09-11", progress: 0, acknowledged: false },
  { docId: "doc-006", assignedDate: "2026-05-20", progress: 100, acknowledged: true, ackAt: "2026-05-25T08:40:00Z" },
  { docId: "doc-010", assignedDate: "2026-02-16", progress: 65, acknowledged: false },
  { docId: "doc-014", assignedDate: "2026-07-08", progress: 0, acknowledged: false },
];

export interface Media {
  id: string; title: string; type: "Video" | "Audio"; duration: number; family: string;
  classification: Classification; status: DocStatus; requires90: boolean; thumb: string;
  transcript: string[];
}
export const MEDIA: Media[] = [
  { id: "m1", title: "Site Safety Induction 2026", type: "Video", duration: 720, family: "Health and Safety", classification: "D2", status: "Approved & Current", requires90: true, thumb: "safety", transcript: ["Welcome to GREEN Limited site safety induction.", "Always wear your PPE in marked zones.", "Report every near miss to your supervisor.", "Muster points are shown on the site map."] },
  { id: "m2", title: "Welcome to GREEN Limited", type: "Video", duration: 420, family: "HR & Induction", classification: "D2", status: "Approved & Current", requires90: true, thumb: "induction", transcript: ["Our values: integrity, safety, sustainability.", "Your first week checklist is in the induction guide."] },
  { id: "m3", title: "Phishing Awareness Briefing", type: "Audio", duration: 540, family: "Information Technology", classification: "D2", status: "Approved & Current", requires90: false, thumb: "it", transcript: ["Never share your password.", "Check sender domains carefully."] },
  { id: "m4", title: "Lockout / Tagout Procedure Walkthrough", type: "Video", duration: 960, family: "Engineering Standards", classification: "D3", status: "Approved & Current", requires90: true, thumb: "engineering", transcript: ["Identify all energy sources.", "Apply personal locks and tags.", "Verify zero energy state."] },
  { id: "m5", title: "Environmental Spill Response", type: "Video", duration: 380, family: "Environment", classification: "D2", status: "Approved & Current", requires90: false, thumb: "environment", transcript: ["Contain the spill using the nearest kit.", "Notify the environment officer."] },
  { id: "m6", title: "Governance Podcast: Ethics at Work", type: "Audio", duration: 1500, family: "Corporate Governance", classification: "D2", status: "Approved & Current", requires90: false, thumb: "governance", transcript: ["Ethical conduct starts with each of us."] },
];

export interface Grant {
  id: string; name: string; email: string; readerClass: string; docIds: string[];
  start: string; expiry: string; purpose: string; revoked: boolean;
}
export const SEED_GRANTS: Grant[] = [
  { id: "g1", name: "James Carter", email: "j.carter@auditpartners.co", readerClass: "External Auditors", docIds: ["doc-004", "doc-012", "doc-003"], start: "2026-09-20", expiry: "2026-12-15", purpose: "ISO 9001 surveillance audit", revoked: false },
  { id: "g2", name: "Lena Fischer", email: "lena.fischer@tuv-cert.de", readerClass: "External Auditors", docIds: ["doc-008"], start: "2026-05-01", expiry: "2026-07-25", purpose: "ISO 14001 certification", revoked: false },
  { id: "g3", name: "Ahmed Saleem", email: "a.saleem@buildcon.pk", readerClass: "Contractors", docIds: ["doc-009", "doc-003"], start: "2026-09-01", expiry: "2026-11-20", purpose: "Contractor onboarding", revoked: true },
];

export interface AuditEvent { id: string; user: string; action: string; doc: string; version: string; ts: string; status: "Success" | "Denied" }
export const SEED_AUDIT: AuditEvent[] = [
  { id: "a1", user: "Omar Farooq", action: "Document Published", doc: "Information Security Guidelines", version: "3.0", ts: "2026-09-10T09:02:00Z", status: "Success" },
  { id: "a2", user: "Bilal Ahmed", action: "Document Opened", doc: "Employee Code of Conduct", version: "4.0", ts: "2026-09-05T10:01:00Z", status: "Success" },
  { id: "a3", user: "Bilal Ahmed", action: "Document Acknowledged", doc: "Employee Code of Conduct", version: "4.0", ts: "2026-09-05T10:12:00Z", status: "Success" },
  { id: "a4", user: "Omar Farooq", action: "Document Superseded", doc: "Employee Code of Conduct", version: "3.2", ts: "2026-09-02T08:30:00Z", status: "Success" },
  { id: "a5", user: "Ayesha Malik", action: "Access Granted", doc: "Internal Audit Procedure", version: "1.5", ts: "2026-09-20T12:00:00Z", status: "Success" },
  { id: "a6", user: "Ayesha Malik", action: "Access Revoked", doc: "Contractor Safety Induction", version: "3.4", ts: "2026-10-01T15:20:00Z", status: "Success" },
  { id: "a7", user: "James Carter", action: "Document Opened", doc: "Engineering Design Standards", version: "7.2", ts: "2026-10-03T11:45:00Z", status: "Denied" },
];

export const TEAM = [
  { name: "Bilal Ahmed", dept: "Operations", docs: [["Employee Code of Conduct", true], ["Workplace Safety Policy", false], ["Information Security Guidelines", false], ["New Employee Induction Guide", true], ["Anti-Bribery & Corruption Policy", false], ["Acceptable Use of IT Assets", false]] },
  { name: "Maryam Iqbal", dept: "Operations", docs: [["Employee Code of Conduct", true], ["Workplace Safety Policy", true], ["Plant Operations Manual", true], ["Information Security Guidelines", false]] },
  { name: "Hassan Javed", dept: "Site Maintenance", docs: [["Workplace Safety Policy", true], ["Contractor Safety Induction", true], ["Waste Handling & Disposal Standard", true], ["Plant Operations Manual", true], ["Employee Code of Conduct", true]] },
  { name: "Sana Mirza", dept: "Operations", docs: [["Employee Code of Conduct", false], ["New Employee Induction Guide", false], ["Workplace Safety Policy", false]] },
  { name: "Ali Raza", dept: "Logistics", docs: [["Employee Code of Conduct", true], ["Workplace Safety Policy", false], ["Environmental Management Procedure", true], ["Acceptable Use of IT Assets", true]] },
  { name: "Zara Sheikh", dept: "Quality", docs: [["Document Control Procedure", true], ["Internal Audit Procedure", true], ["Employee Code of Conduct", true], ["Information Security Guidelines", false]] },
] as { name: string; dept: string; docs: [string, boolean][] }[];

export const SAMPLE_SECTIONS = [
  ["1. Purpose", "This document establishes the requirements, responsibilities and controls applicable to all GREEN Limited personnel and authorised third parties. It ensures consistent practice across every site and function."],
  ["2. Scope", "Applies to all employees, contractors and visitors within GREEN Limited facilities, offices and remote work arrangements, unless an approved deviation is recorded by Document Control."],
  ["3. Responsibilities", "Managers ensure their teams have read and acknowledged the current version. Employees must comply with this document and raise concerns through their line manager or the compliance hotline."],
  ["4. Requirements", "All activities shall be planned, executed and verified in line with applicable legislation and the GREEN Integrated Management System. Records shall be retained in accordance with the retention schedule."],
  ["5. Monitoring & Review", "Compliance will be monitored through internal audits and management review. This document is reviewed at least every two years or following significant organisational change."],
  ["6. References", "GREEN Integrated Management System Manual; ISO 9001:2015; ISO 14001:2015; ISO 45001:2018; applicable national regulations."],
];
