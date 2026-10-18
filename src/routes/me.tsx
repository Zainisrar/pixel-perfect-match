import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, CheckCircle2, Clock, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, Panel, StatCard, StatusBadge, EmptyState, RoleGate } from "@/components/lumen/common";
import { useLumen } from "@/lib/lumen/store";
import { pageHead } from "@/lib/lumen/head";

export const Route = createFileRoute("/me")({
  head: pageHead("My Reading", "Your assigned documents and acknowledgement status."),
  component: () => <RoleGate need="me"><MyReading /></RoleGate>,
});

const statusOf = (a: { acknowledged: boolean; progress: number }) => (a.acknowledged ? "Completed" : a.progress > 0 ? "In Progress" : "Pending");

function MyReading() {
  const { assignments, docs } = useLumen();
  const rows = assignments.map((a) => ({ a, d: docs.find((d) => d.id === a.docId) })).filter((r) => r.d);
  const count = (s: string) => assignments.filter((a) => statusOf(a) === s).length;
  return (
    <>
      <PageHeader crumb="My Reading" title="My Reading" description="Documents assigned to you that require reading and acknowledgement." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Assigned" value={assignments.length} icon={ClipboardList} tone="muted" />
        <StatCard label="Completed" value={count("Completed")} icon={CheckCircle2} />
        <StatCard label="Pending" value={count("Pending")} icon={Clock} tone="warning" />
        <StatCard label="In Progress" value={count("In Progress")} icon={Loader} tone="info" />
      </div>
      <Panel className="mt-6">
        {rows.length === 0 ? <EmptyState title="No assignments" /> : (
          <Table>
            <TableHeader><TableRow><TableHead>Document</TableHead><TableHead className="hidden md:table-cell">Reference</TableHead><TableHead>Version</TableHead><TableHead className="hidden md:table-cell">Assigned</TableHead><TableHead>Status</TableHead><TableHead className="hidden sm:table-cell">Progress</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {rows.map(({ a, d }) => (
                <TableRow key={a.docId}>
                  <TableCell className="font-medium">{d!.title}</TableCell>
                  <TableCell className="hidden font-mono text-xs md:table-cell">{d!.ref}</TableCell>
                  <TableCell>v{d!.version}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{a.assignedDate}</TableCell>
                  <TableCell><StatusBadge status={statusOf(a)} /></TableCell>
                  <TableCell className="hidden sm:table-cell"><div className="flex items-center gap-2"><Progress value={a.progress} className="h-1.5 w-24" /><span className="text-xs">{a.progress}%</span></div></TableCell>
                  <TableCell className="text-right"><Button asChild size="sm" variant={a.acknowledged ? "ghost" : "secondary"}><Link to="/d/$id" params={{ id: a.docId }}>{a.acknowledged ? "Review" : "Read"}</Link></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Panel>
    </>
  );
}
