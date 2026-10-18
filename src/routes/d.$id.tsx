import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Type, BadgeCheck, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Panel, StatusBadge, ClassBadge, EmptyState, fmtDate } from "@/components/lumen/common";
import { useLumen } from "@/lib/lumen/store";
import { visibleDocs } from "@/lib/lumen/access";
import { ROLE_USERS, SAMPLE_SECTIONS, type Doc } from "@/lib/lumen/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/d/$id")({
  head: () => ({
    meta: [
      { title: "Document Reader · GAXIS-Lumen" },
      { name: "description", content: "Read and acknowledge a controlled GREEN Limited document." },
      { property: "og:title", content: "Document Reader · GAXIS-Lumen" },
      { property: "og:description", content: "Read and acknowledge a controlled GREEN Limited document." },
    ],
  }),
  component: Reader,
});

function DocumentViewer({ doc, zoom, font, onProgress, full }: { doc: Doc; zoom: number; font: number; onProgress: (p: number) => void; full: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const role = useLumen((s) => s.role);
  const [stamp, setStamp] = useState("");
  useEffect(() => setStamp(new Date().toLocaleString("en-GB")), []);
  const mark = `${ROLE_USERS[role].name} · ${stamp}`;
  const onScroll = () => {
    const el = ref.current; if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    onProgress(max <= 0 ? 100 : Math.round((el.scrollTop / max) * 100));
  };
  return (
    <div ref={ref} onScroll={onScroll} className={cn("overflow-auto rounded-xl border bg-muted/70 p-4 md:p-8", full ? "h-[calc(100vh-7rem)]" : "h-[70vh]")}>
      <article className="relative mx-auto origin-top overflow-hidden rounded-sm bg-card p-8 shadow-card md:p-14" style={{ width: `${8.27 * zoom}in`, maxWidth: zoom <= 1 ? "100%" : undefined, fontSize: font }}>
        <div aria-hidden className="pointer-events-none absolute inset-0 select-none overflow-hidden">
          <div className="absolute -inset-1/2 flex rotate-[-30deg] flex-wrap content-start gap-x-16 gap-y-24 opacity-[0.07]">
            {Array.from({ length: 60 }).map((_, i) => <span key={i} className="whitespace-nowrap text-lg font-semibold text-foreground">{mark}</span>)}
          </div>
        </div>
        <header className="mb-8 border-b pb-6">
          <div className="text-[0.7em] font-semibold tracking-[0.2em] text-primary">GREEN LIMITED · CONTROLLED DOCUMENT</div>
          <h1 className="mt-2 text-[1.8em] font-semibold leading-tight">{doc.title}</h1>
          <div className="mt-2 font-mono text-[0.8em] text-muted-foreground">{doc.ref} · Version {doc.version} · {doc.classification}</div>
        </header>
        {SAMPLE_SECTIONS.map(([h, t]) => (
          <section key={h} className="mb-6">
            <h2 className="mb-2 text-[1.15em] font-semibold">{h}</h2>
            <p className="leading-relaxed text-foreground/85">{t}</p>
            <p className="mt-3 leading-relaxed text-foreground/85">{doc.changeSummary} Personnel within the {doc.readerClasses.join(", ")} reader class(es) must ensure they understand the obligations described in this section before undertaking related work.</p>
          </section>
        ))}
        <footer className="mt-10 border-t pt-4 text-[0.7em] text-muted-foreground">Uncontrolled when printed. Owner: {doc.owner}. Viewed by {mark}.</footer>
      </article>
    </div>
  );
}

function AcknowledgementPanel({ doc, progress }: { doc: Doc; progress: number }) {
  const { assignments, acknowledge, role } = useLumen();
  const [confirm, setConfirm] = useState(false);
  const a = assignments.find((x) => x.docId === doc.id);
  if (!doc.ackRequired) return <p className="text-sm text-muted-foreground">No acknowledgement required for this document.</p>;
  if (doc.status !== "Approved & Current") return <p className="text-sm text-muted-foreground">Only the current approved version can be acknowledged.</p>;
  if (a?.acknowledged) return (
    <div className="flex items-start gap-3 rounded-lg bg-success-soft p-3 text-sm text-success">
      <BadgeCheck className="mt-0.5 size-5 shrink-0" />
      <div><div className="font-medium">Acknowledged v{doc.version}</div><div className="text-xs">{a.ackAt && fmtDate(a.ackAt)}</div></div>
    </div>
  );
  const ready = progress >= 90;
  return (
    <div className="space-y-3">
      {!ready && <p className="text-xs text-muted-foreground">Scroll through at least 90% of the document to enable acknowledgement.</p>}
      <label className="flex items-start gap-2 text-sm">
        <Checkbox checked={confirm} onCheckedChange={(v) => setConfirm(!!v)} disabled={!ready} className="mt-0.5" />
        <span>I, {ROLE_USERS[role].name}, have read and understood version {doc.version} of this document.</span>
      </label>
      <Button className="w-full" disabled={!ready || !confirm} onClick={() => { acknowledge(doc.id); toast.success("Acknowledgement recorded", { description: `${doc.title} v${doc.version}` }); }}>
        <BadgeCheck />Confirm acknowledgement
      </Button>
    </div>
  );
}

function Reader() {
  const { id } = Route.useParams();
  const { role, docs, grants, assignments, setProgress, log } = useLumen();
  const doc = visibleDocs(role, docs, grants).find((d) => d.id === id);
  const [zoom, setZoom] = useState(1);
  const [font, setFont] = useState(16);
  const [full, setFull] = useState(false);
  const saved = assignments.find((a) => a.docId === id)?.progress ?? 0;
  const [progress, setLocal] = useState(0);
  const logged = useRef<string | null>(null);

  useEffect(() => {
    if (doc && logged.current !== doc.id) { logged.current = doc.id; log("Document Opened", doc.title, doc.version); }
  }, [doc, log]);

  if (!doc) return (
    <div className="py-10"><EmptyState title="Document not available" text="It doesn't exist or isn't authorised for your current role."
      action={<Button asChild variant="outline"><Link to="/library"><Lock />Back to library</Link></Button>} /></div>
  );
  const shown = Math.max(progress, saved);
  const onProgress = (p: number) => { setLocal((c) => Math.max(c, p)); setProgress(doc.id, p); };

  return (
    <div className={cn(full && "fixed inset-0 z-50 overflow-auto bg-background p-4")}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {!full && <Button asChild variant="ghost" size="sm"><Link to="/library"><ArrowLeft />Library</Link></Button>}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-semibold">{doc.title}</h1>
          <div className="font-mono text-xs text-muted-foreground">{doc.ref} · v{doc.version}</div>
        </div>
        <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
          <Button size="icon" variant="ghost" onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(1)))} aria-label="Zoom out"><ZoomOut /></Button>
          <span className="w-12 text-center text-sm tabular-nums">{Math.round(zoom * 100)}%</span>
          <Button size="icon" variant="ghost" onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.1).toFixed(1)))} aria-label="Zoom in"><ZoomIn /></Button>
          <Button size="icon" variant="ghost" onClick={() => setFull((f) => !f)} aria-label="Full screen">{full ? <Minimize2 /> : <Maximize2 />}</Button>
        </div>
      </div>
      <div className={cn("grid gap-6", !full && "lg:grid-cols-[1fr_320px]")}>
        <DocumentViewer doc={doc} zoom={zoom} font={font} onProgress={onProgress} full={full} />
        {!full && (
          <div className="space-y-4">
            <Panel title="Reading progress">
              <div className="p-5"><div className="mb-2 flex justify-between text-sm"><span>Progress</span><span className="font-medium">{shown}%</span></div><Progress value={shown} /></div>
            </Panel>
            <Panel title="Reading controls">
              <div className="space-y-2 p-5">
                <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><Type className="size-4" />Text size</span><span>{font}px</span></div>
                <Slider min={12} max={24} step={1} value={[font]} onValueChange={([v]) => setFont(v)} />
              </div>
            </Panel>
            <Panel title="Document details">
              <dl className="space-y-3 p-5 text-sm">
                {([["Version", "v" + doc.version], ["Published", doc.publishedDate ?? "Not yet published"], ["Owner", doc.owner], ["Family", doc.family]] as const).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
                ))}
                <div className="flex justify-between"><dt className="text-muted-foreground">Classification</dt><dd><ClassBadge c={doc.classification} /></dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd><StatusBadge status={doc.status} /></dd></div>
              </dl>
            </Panel>
            <Panel title="Acknowledgement"><div className="p-5"><AcknowledgementPanel doc={doc} progress={shown} /></div></Panel>
          </div>
        )}
      </div>
    </div>
  );
}
