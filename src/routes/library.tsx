import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LayoutGrid, List, Search, Eye, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { PageHeader, Panel, StatusBadge, ClassBadge, EmptyState, DocumentCard, RoleGate } from "@/components/lumen/common";
import { useLumen } from "@/lib/lumen/store";
import { visibleDocs } from "@/lib/lumen/access";
import { FAMILIES, STATUSES, type Doc } from "@/lib/lumen/data";
import { pageHead } from "@/lib/lumen/head";

export const Route = createFileRoute("/library")({
  validateSearch: (s: Record<string, unknown>): { q?: string } => (typeof s.q === "string" && s.q ? { q: s.q } : {}),
  head: pageHead("Document Library", "Browse GREEN Limited's approved policies, procedures and standards."),
  component: () => <RoleGate need="library"><LibraryPage /></RoleGate>,
});

function SearchFilters(p: { q: string; setQ: (v: string) => void; fam: string; setFam: (v: string) => void; cls: string; setCls: (v: string) => void; st: string; setSt: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-3 border-b p-4 md:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={p.q} onChange={(e) => p.setQ(e.target.value)} placeholder="Search title or reference" className="pl-9" />
      </div>
      <Select value={p.fam} onValueChange={p.setFam}>
        <SelectTrigger className="md:w-52"><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="all">All families</SelectItem>{FAMILIES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
      </Select>
      <Select value={p.cls} onValueChange={p.setCls}>
        <SelectTrigger className="md:w-36"><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="all">All classes</SelectItem><SelectItem value="D2">D2</SelectItem><SelectItem value="D3">D3</SelectItem></SelectContent>
      </Select>
      <Select value={p.st} onValueChange={p.setSt}>
        <SelectTrigger className="md:w-52"><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="all">All statuses</SelectItem>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}

function DocumentTable({ docs, onInfo }: { docs: Doc[]; onInfo: (d: Doc) => void }) {
  const navigate = useNavigate();
  return (
    <Table>
      <TableHeader><TableRow>
        <TableHead>Document Name</TableHead><TableHead>Reference</TableHead><TableHead className="hidden lg:table-cell">Family</TableHead>
        <TableHead>Version</TableHead><TableHead>Class</TableHead><TableHead>Status</TableHead><TableHead className="hidden md:table-cell">Published</TableHead><TableHead className="text-right">Actions</TableHead>
      </TableRow></TableHeader>
      <TableBody>
        {docs.map((d) => (
          <TableRow key={d.id}>
            <TableCell className="font-medium"><Link to="/d/$id" params={{ id: d.id }} className="hover:text-primary">{d.title}</Link></TableCell>
            <TableCell className="font-mono text-xs">{d.ref}</TableCell>
            <TableCell className="hidden text-muted-foreground lg:table-cell">{d.family}</TableCell>
            <TableCell>v{d.version}</TableCell>
            <TableCell><ClassBadge c={d.classification} /></TableCell>
            <TableCell><StatusBadge status={d.status} /></TableCell>
            <TableCell className="hidden text-muted-foreground md:table-cell">{d.publishedDate ?? "—"}</TableCell>
            <TableCell className="text-right">
              <Button size="icon" variant="ghost" onClick={() => onInfo(d)} aria-label="Metadata"><Info /></Button>
              <Button size="icon" variant="ghost" onClick={() => navigate({ to: "/d/$id", params: { id: d.id } })} aria-label="Open"><Eye /></Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function LibraryPage() {
  const search = Route.useSearch();
  const { role, docs, grants } = useLumen();
  const [q, setQ] = useState(search.q ?? "");
  const [fam, setFam] = useState("all");
  const [cls, setCls] = useState("all");
  const [st, setSt] = useState("all");
  const [view, setView] = useState<"table" | "grid">("table");
  const [info, setInfo] = useState<Doc | null>(null);
  const [lastQ, setLastQ] = useState(search.q);
  if (search.q !== lastQ) { setLastQ(search.q); setQ(search.q ?? ""); }

  const list = useMemo(() => visibleDocs(role, docs, grants).filter((d) =>
    (!q || (d.title + " " + d.ref).toLowerCase().includes(q.toLowerCase())) &&
    (fam === "all" || d.family === fam) && (cls === "all" || d.classification === cls) && (st === "all" || d.status === st)), [role, docs, grants, q, fam, cls, st]);

  return (
    <>
      <PageHeader crumb="Document Library" title="Document Library"
        description={role === "External Reviewer" ? "Showing only the documents you have been granted access to." : "All controlled documents you are authorised to view."}
        actions={
          <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as "table" | "grid")} variant="outline">
            <ToggleGroupItem value="table" aria-label="Table view"><List /></ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid view"><LayoutGrid /></ToggleGroupItem>
          </ToggleGroup>
        } />
      <Panel>
        <SearchFilters {...{ q, setQ, fam, setFam, cls, setCls, st, setSt }} />
        {list.length === 0 ? <EmptyState title="No documents found" text="Try adjusting your search or filters." /> :
          view === "table" ? <DocumentTable docs={list} onInfo={setInfo} /> : (
            <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">{list.map((d) => <DocumentCard key={d.id} doc={d} />)}</div>
          )}
        <div className="border-t px-5 py-3 text-xs text-muted-foreground">{list.length} document(s)</div>
      </Panel>

      <Sheet open={!!info} onOpenChange={(o) => !o && setInfo(null)}>
        <SheetContent>
          {info && (<>
            <SheetHeader><SheetTitle>{info.title}</SheetTitle><SheetDescription className="font-mono">{info.ref}</SheetDescription></SheetHeader>
            <dl className="grid grid-cols-2 gap-4 px-4 text-sm">
              {([["Version", "v" + info.version], ["Family", info.family], ["Owner", info.owner], ["Prepared by", info.preparedBy], ["Published", info.publishedDate ?? "—"], ["Acknowledgement", info.ackRequired ? "Required" : "Not required"]] as const).map(([k, v]) => (
                <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
              ))}
              <div><dt className="text-xs text-muted-foreground">Status</dt><dd><StatusBadge status={info.status} /></dd></div>
              <div><dt className="text-xs text-muted-foreground">Classification</dt><dd><ClassBadge c={info.classification} /></dd></div>
              <div className="col-span-2"><dt className="text-xs text-muted-foreground">Reader classes</dt><dd>{info.readerClasses.join(", ")}</dd></div>
              <div className="col-span-2"><dt className="text-xs text-muted-foreground">Change summary</dt><dd>{info.changeSummary}</dd></div>
            </dl>
            <div className="p-4"><Button asChild className="w-full"><Link to="/d/$id" params={{ id: info.id }}>Open document</Link></Button></div>
          </>)}
        </SheetContent>
      </Sheet>
    </>
  );
}
