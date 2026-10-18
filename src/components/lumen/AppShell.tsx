import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard, Library, BookOpenCheck, PlayCircle, FilePlus2, Send, KeyRound, Users, ScrollText,
  Settings, Bell, Search, Menu, ChevronDown, RotateCcw, ShieldAlert,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLumen } from "@/lib/lumen/store";
import { ROLES, ROLE_USERS, type Role } from "@/lib/lumen/data";
import { ROLE_NAV, type NavKey } from "@/lib/lumen/access";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const NAV: { key: NavKey; label: string; to: string; icon: typeof Library; group: string }[] = [
  { key: "dashboard", label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, group: "Workspace" },
  { key: "library", label: "Document Library", to: "/library", icon: Library, group: "Workspace" },
  { key: "me", label: "My Reading", to: "/me", icon: BookOpenCheck, group: "Workspace" },
  { key: "media", label: "Media Library", to: "/media", icon: PlayCircle, group: "Workspace" },
  { key: "prepare", label: "Prepare Document", to: "/admin/prepare", icon: FilePlus2, group: "Publishing" },
  { key: "release", label: "Release Queue", to: "/admin/release", icon: Send, group: "Publishing" },
  { key: "grants", label: "External Access", to: "/admin/grants", icon: KeyRound, group: "Governance" },
  { key: "team", label: "Team Completion", to: "/manage/team", icon: Users, group: "Governance" },
  { key: "audit", label: "Audit Logs", to: "/admin/audit", icon: ScrollText, group: "Governance" },
  { key: "system", label: "Administration", to: "/admin/system", icon: Settings, group: "Governance" },
];

function initials(n: string) { return n.split(" ").map((p) => p[0]).join("").slice(0, 2); }

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const role = useLumen((s) => s.role);
  const pending = useLumen((s) => s.docs.filter((d) => d.status === "Under Review").length);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const items = NAV.filter((n) => ROLE_NAV[role].includes(n.key));
  const groups = [...new Set(items.map((i) => i.group))];
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="bg-brand grid size-10 place-items-center rounded-xl text-sm font-bold text-primary-foreground">G</div>
        <div className="leading-tight">
          <div className="text-[11px] font-semibold tracking-[0.2em] text-primary">GREEN · GAXIS</div>
          <div className="text-base font-semibold">Lumen</div>
        </div>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {groups.map((g) => (
          <div key={g}>
            <div className="px-3 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{g}</div>
            {items.filter((i) => i.group === g).map((i) => {
              const active = path === i.to || path.startsWith(i.to + "/") || (i.key === "library" && path.startsWith("/d/"));
              return (
                <Link key={i.key} to={i.to} onClick={onNavigate}
                  className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    active ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-muted")}>
                  <i.icon className="size-4" />
                  <span className="flex-1">{i.label}</span>
                  {i.key === "release" && pending > 0 && (
                    <span className="rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">{pending}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="m-3 rounded-lg border border-dashed bg-muted/60 p-3 text-[11px] leading-relaxed text-muted-foreground">
        <ShieldAlert className="mb-1 size-3.5 text-warning" />
        Prototype: roles and access rules are simulated in the browser. Production enforcement happens on the server.
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { role, setRole, reset, audit } = useLumen();
  const user = ROLE_USERS[role];

  useEffect(() => { useLumen.persist.rehydrate(); }, []);

  const changeRole = (r: string) => {
    setRole(r as Role);
    toast.success(`Now viewing as ${r}`, { description: ROLE_USERS[r as Role].name });
    navigate({ to: r === "External Reviewer" ? "/library" : "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-sidebar lg:block"><SidebarNav /></aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur md:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></Button>
          <form className="relative max-w-md flex-1" onSubmit={(e) => { e.preventDefault(); navigate({ to: "/library", search: { q } }); }}>
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search documents by title or reference…" className="h-10 bg-muted/60 pl-9" />
          </form>
          <div className="ml-auto flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                  <Bell className="size-5" /><span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Recent activity</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {audit.slice(0, 5).map((a) => (
                  <DropdownMenuItem key={a.id} className="flex-col items-start gap-0.5" onClick={() => navigate({ to: role === "Administrator" ? "/admin/audit" : "/dashboard" })}>
                    <span className="text-sm font-medium">{a.action}</span>
                    <span className="text-xs text-muted-foreground">{a.doc} · v{a.version}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted">
                  <span className="grid size-9 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">{initials(user.name)}</span>
                  <span className="hidden text-left leading-tight sm:block">
                    <span className="block text-sm font-medium">{user.name}</span>
                    <span className="block text-xs text-muted-foreground">{role}</span>
                  </span>
                  <ChevronDown className="size-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">Switch demo role</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={role} onValueChange={changeRole}>
                  {ROLES.map((r) => <DropdownMenuRadioItem key={r} value={r}>{r}</DropdownMenuRadioItem>)}
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { reset(); toast("Demo data reset"); }}><RotateCcw className="size-4" />Reset demo data</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
