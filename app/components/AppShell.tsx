"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  FileCheck2,
  FileText,
  Home,
  ReceiptText,
  Settings,
} from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { label: "Today", href: "/", icon: Home },
  { label: "Leads", href: "/leads", icon: ClipboardList },
  { label: "Proposals", href: "/proposals", icon: FileText },
  { label: "Jobs", href: "/jobs", icon: FileCheck2 },
  { label: "Invoices", href: "/invoices", icon: ReceiptText },
  { label: "Settings", href: "/settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <header className="topbar">
          <Link href="/" className="brand-lockup" aria-label="Coastline Excavation home">
            <div className="logo-placeholder">
              <span>CE</span>
            </div>
            <div>
              <p className="eyebrow">Operations prototype</p>
              <h1>Coastline Excavation</h1>
            </div>
          </Link>
        </header>

        <main className="content">{children}</main>

        <nav className="bottom-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                className={`nav-item ${active ? "nav-item--active" : ""}`}
                href={item.href}
                aria-current={active ? "page" : undefined}
              >
                <Icon aria-hidden="true" size={21} strokeWidth={2.2} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
