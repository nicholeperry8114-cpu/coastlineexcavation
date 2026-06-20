import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { requireAdmin } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <AppSidebar />
      <div className="min-w-0 flex-1 pb-24 lg:pb-0">
        <AppHeader email={user.email || "Admin"} />
        <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
