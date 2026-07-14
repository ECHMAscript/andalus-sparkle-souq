// @ts-nocheck
import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, PackageSearch, Wrench, X, ShieldCheck, PlusCircle, ClipboardList, TrendingUp } from "lucide-react";
import { useAdminMode, useAdminSidebarOpen, setAdminSidebarOpen, toggleAdminSidebar } from "@/lib/admin-mode";
import { useRole } from "@/lib/use-role";

const tools = [
  { to: "/admin/stats", label: "Hot Items", icon: BarChart3, desc: "Statistics & interest graph" },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList, desc: "Customer orders & fulfillment" },
  { to: "/admin/sales", label: "Sales", icon: TrendingUp, desc: "Revenue & top sellers" },
  { to: "/admin/items", label: "Item Lookup", icon: PackageSearch, desc: "Find products by name or ID" },
  { to: "/admin/products/new", label: "Add Product", icon: PlusCircle, desc: "Publish a new piece to the catalog" },
];


export default function AdminSidebar() {
  const { isAdmin } = useRole();
  const adminMode = useAdminMode();
  const open = useAdminSidebarOpen();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  if (!isAdmin || !adminMode) return null;

  return (
    <>
      {/* Floating tool button — always visible in admin mode */}
      <button
        onClick={toggleAdminSidebar}
        aria-label={open ? "Close admin tools" : "Open admin tools"}
        aria-expanded={open}
        className="fixed left-4 bottom-6 z-50 neo-pressable rounded-full p-3 grid place-items-center text-white shadow-xl"
        style={{ background: "linear-gradient(135deg, oklch(0.55 0.14 75), oklch(0.35 0.10 60))" }}
      >
        <Wrench className="size-5" />
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setAdminSidebarOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[300px] bg-card border-r border-border/60 shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="neo-sm size-9 grid place-items-center">
              <ShieldCheck className="size-4 text-primary" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-base font-semibold text-gold-gradient">Admin Tools</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Souq Al Andalus</div>
            </div>
          </div>
          <button onClick={() => setAdminSidebarOpen(false)} aria-label="Close" className="neo-sm p-2">
            <X className="size-4" />
          </button>
        </div>

        <nav className="p-3 flex flex-col gap-1">
          {tools.map((t) => {
            const active = pathname === t.to;
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                onClick={() => setAdminSidebarOpen(false)}
                className={`flex items-start gap-3 px-3 py-3 rounded-xl transition-colors ${
                  active ? "neo-inset bg-muted/40" : "hover:bg-muted/50"
                }`}
              >
                <div className="neo-sm size-10 grid place-items-center shrink-0">
                  <Icon className="size-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium">{t.label}</div>
                  <div className="text-[11px] text-muted-foreground">{t.desc}</div>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
