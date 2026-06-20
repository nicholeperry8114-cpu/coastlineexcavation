import { Menu, UserCircle } from "lucide-react";

import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";

export function AppHeader({ email }: { email: string }) {
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden" type="button">
          <Menu className="size-5" />
        </button>
        <div>
          <p className="text-sm font-medium text-slate-500">Internal CRM</p>
          <h1 className="text-xl font-bold text-slate-950">Coastline Excavation</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 md:flex">
          <UserCircle className="size-4" />
          {email}
        </div>
        <form action={signOutAction}>
          <Button variant="secondary" type="submit">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
