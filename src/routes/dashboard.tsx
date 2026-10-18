import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, CheckCircle2, Clock, BookOpen, BadgeCheck, Library, PlayCircle, FilePlus2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader, Panel, StatCard, StatusBadge, EmptyState, RoleGate, fmtDate } from "@/components/lumen/common";
import { useLumen } from "@/lib/lumen/store";
import { visibleDocs, canAccess } from "@/lib/lumen/access";
import { ROLE_USERS } from "@/lib/lumen/data";
import { pageHead } from "@/lib/lumen/head";

export const Route = createFileRoute("/dashboard")({
  head: pageHead("Dashboard", "Overview of documents, approvals and your reading at GREEN Limited."),
  component: () => <RoleGate need="dashboard"><Dashboard /></RoleGate>,
});

function Dashboard() {
  const { role, docs, grants, assignments, audit } = useLumen();
  const vis = visibleDocs(role, docs, grants);
  const approved = vis.filter((d) => d.status === "Approved & Current");
  const pendingApprovals = docs.filter((d) => d.status === "Under Review").length;
  const pendingReading = assignments.filter((a) => !a.acknowledged);
  const recent = [...approved].sort((a, b) => (b.publishedDate ?? "").localeCompare(a.publishedDate ?? "")).slice(0, 5);
  const next = pendingReading[0];

  return (
    <>
      <PageHeader crumb="Dashboard" title={`Good day, ${ROLE_USERS[role].name.split(" ")[0]}`} description="Here's what's happening across GREEN Limited's controlled documents." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Total Documents" value={vis.length} icon={FileText} tone="muted" />
        <StatCard label="Approved" value={approved.length} icon={CheckCircle2} />
        <StatCard label="Pending Approvals" value={pendingApprovals} icon={Clock} tone="warning" />
        <StatCard label="My Pending Reading" value={pendingReading.length} icon={BookOpen} tone="info" />
        <StatCard label="Acknowledged" value={assignments.filter((a) => a.acknowledged).length} icon={BadgeCheck} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Recently Published" className="lg:col-span-2" action={<Button asChild variant="ghost" size="sm"><Link to="/library">View all <ArrowRight /></Link></Button>}>
          <ul className="divide-y">
            {recent.map((d) => (
              <li key={d.id}>
                <Link to="/d/$id" params={{ id: d.id }} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/50">
                  <div className="grid size-9 place-items-center rounded-lg bg-secondary text-secondary-foreground"><FileText className="size-4" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{d.title}</div>
                    <div className="font-mono text-xs text-muted-foreground">{d.ref} · v{d.version}</div>
                  </div>
                  <span className="hidden text-xs text-muted-foreground sm:block">{d.publishedDate}</span>
                  <StatusBadge status={d.status} />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Quick Actions">
          <div className="grid gap-2 p-4">
            <Button asChild variant="outline" className="justify-start"><Link to="/library"><Library />Browse Documents</Link></Button>
            {next ? (
              <Button asChild variant="outline" className="justify-start"><Link to="/d/$id" params={{ id: next.docId }}><PlayCircle />Continue Reading</Link></Button>
            ) : (
              <Button variant="outline" className="justify-start" disabled><PlayCircle />Nothing to continue</Button>
            )}
            {canAccess(role, "prepare") && <Button asChild className="justify-start"><Link to="/admin/prepare"><FilePlus2 />Prepare Document</Link></Button>}
          </div>
        </Panel>

        <Panel title="My Pending Reading" className="lg:col-span-2" action={<Button asChild variant="ghost" size="sm"><Link to="/me">My Reading <ArrowRight /></Link></Button>}>
          {pendingReading.length === 0 ? <EmptyState title="All caught up" text="You have acknowledged every assigned document." /> : (
            <ul className="divide-y">
              {pendingReading.map((a) => {
                const d = docs.find((x) => x.id === a.docId);
                if (!d) return null;
                return (
                  <li key={a.docId} className="flex items-center gap-4 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{d.title}</div>
                      <div className="mt-1.5 flex items-center gap-2"><Progress value={a.progress} className="h-1.5 max-w-48" /><span className="text-xs text-muted-foreground">{a.progress}%</span></div>
                    </div>
                    <Button asChild size="sm" variant="secondary"><Link to="/d/$id" params={{ id: d.id }}>Read</Link></Button>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel title="Recent Activities">
          <ol className="space-y-4 p-5">
            {audit.slice(0, 6).map((e) => (
              <li key={e.id} className="relative pl-5">
                <span className="absolute left-0 top-1.5 size-2 rounded-full bg-primary" />
                <div className="text-sm"><b className="font-medium">{e.user}</b> · {e.action}</div>
                <div className="text-xs text-muted-foreground">{e.doc} · {fmtDate(e.ts)}</div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </>
  );
}
