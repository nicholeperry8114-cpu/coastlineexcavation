import Link from "next/link";
import {
  ClipboardList,
  FileText,
  Hammer,
  Home,
  LayoutDashboard,
  ReceiptText
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "Leads", icon: ClipboardList },
  { href: "/dashboard/proposals", label: "Proposals", icon: FileText },
  { href: "/dashboard/jobs", label: "Jobs", icon: Hammer },
  { href: "/dashboard/invoices", label: "Invoices", icon: ReceiptText }
];

export function AppSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-950 text-white lg:block">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-500">
          <Home className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">Coastline</p>
          <p className="text-lg font-bold">Excavation</p>
        </div>
      </div>
      <nav className="space-y-1 px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export { navItems };
