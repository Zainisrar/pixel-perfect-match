import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { FileText, Inbox, Lock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Doc, DocStatus } from "@/lib/lumen/data";
import { useLumen } from "@/lib/lumen/store";
import { canAccess, type NavKey } from "@/lib/lumen/access";
import { cn } from "@/lib/utils";

export function PageHeader({ title, crumb, description, actions }: { title: string; crumb?: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-1 text-xs font-medium text-muted-foreground">GAXIS-Lumen{crumb ? ` / ${crumb}` : ""}</div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl border bg-card shadow-card", className)}>
      {title && (
        <div className="flex items-center justify-between border-b px-5 py-3.5">
          <h2 className="text-sm font-semibold">{title}</h2>{action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({ label, value, icon: Icon, hint, tone = "primary" }: { label: string; value: ReactNode; icon: typeof FileText; hint?: string; tone?: "primary" | "warning" | "info" | "muted" }) {
  const tones = { primary: "bg-success-soft text-success", warning: "bg-warning-soft text-warning", info: "bg-info-soft text-info", muted: "bg-muted text-muted-foreground" };
  return (
    <div className="rounded-xl border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className={cn("grid size-9 place-items-center rounded-lg", tones[tone])}><Icon className="size-4" /></div>
      </div>
      <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "muted" | "danger" | "info"> = {
  "Approved & Current": "success", "Under Review": "warning", Superseded: "muted", "Returned for Correction": "danger",
  Active: "success", Expired: "muted", Revoked: "danger", Completed: "success", Pending: "warning", "In Progress": "info",
  Success: "success", Denied: "danger",
};
export function StatusBadge({ status }: { status: DocStatus | string }) {
  return <Badge variant={STATUS_VARIANT[status] ?? "outline"} className="whitespace-nowrap font-medium">{status}</Badge>;
}
export function ClassBadge({ c }: { c: string }) {
  return <Badge variant={c === "D3" ? "info" : "outline"} className="font-mono">{c}</Badge>;
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-3 grid size-12 place-items-center rounded-full bg-muted"><Inbox className="size-5 text-muted-foreground" /></div>
      <div className="font-medium">{title}</div>
      {text && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState() {
  return <div className="flex items-center justify-center py-16 text-muted-foreground"><Loader2 className="size-5 animate-spin" /></div>;
}

export function ConfirmModal({ open, onOpenChange, title, description, confirmLabel = "Confirm", onConfirm, children }: {
  open: boolean; onOpenChange: (o: boolean) => void; title: string; description?: string; confirmLabel?: string; onConfirm: () => void; children?: ReactNode;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function RoleGate({ need, children }: { need: NavKey; children: ReactNode }) {
  const role = useLumen((s) => s.role);
  if (canAccess(role, need)) return <>{children}</>;
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-muted"><Lock className="size-6 text-muted-foreground" /></div>
      <h1 className="text-xl font-semibold">Not available for your role</h1>
      <p className="mt-2 text-sm text-muted-foreground">You're viewing as <b>{role}</b>. Switch role from the profile menu to explore this screen.</p>
      <Button asChild className="mt-6"><Link to={role === "External Reviewer" ? "/library" : "/dashboard"}>Go back</Link></Button>
    </div>
  );
}

export function DocumentCard({ doc }: { doc: Doc }) {
  return (
    <Link to="/d/$id" params={{ id: doc.id }} className="group flex flex-col rounded-xl border bg-card p-5 shadow-card transition hover:border-primary/40">
      <div className="mb-4 flex items-start justify-between">
        <div className="grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground"><FileText className="size-5" /></div>
        <ClassBadge c={doc.classification} />
      </div>
      <div className="font-medium group-hover:text-primary">{doc.title}</div>
      <div className="mt-0.5 font-mono text-xs text-muted-foreground">{doc.ref} · v{doc.version}</div>
      <div className="mt-1 text-xs text-muted-foreground">{doc.family}</div>
      <div className="mt-4 flex items-center justify-between">
        <StatusBadge status={doc.status} />
        <span className="text-xs text-muted-foreground">{doc.publishedDate ?? "—"}</span>
      </div>
    </Link>
  );
}

export const fmtDate = (iso: string) => new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
