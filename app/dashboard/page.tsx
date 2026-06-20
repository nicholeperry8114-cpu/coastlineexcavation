import Link from "next/link";
import { ClipboardList, FileText, Hammer, ReceiptText } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/utils/dates";
import { requireAdmin } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const { supabase } = await requireAdmin();

  const [
    { count: newLeads },
    { count: pendingProposals },
    { count: activeJobs },
    { count: unpaidInvoices },
    { data: recentActivity }
  ] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("proposals").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("jobs").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("invoices").select("id", { count: "exact", head: true }).neq("status", "paid"),
    supabase
      .from("activity_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8)
  ]);

  const stats = [
    {
      label: "New leads",
      value: newLeads || 0,
      href: "/dashboard/leads?status=new",
      icon: ClipboardList,
      accent: "bg-sky-50 text-sky-700"
    },
    {
      label: "Pending proposals",
      value: pendingProposals || 0,
      href: "/dashboard/proposals?status=pending",
      icon: FileText,
      accent: "bg-amber-50 text-amber-700"
    },
    {
      label: "Active jobs",
      value: activeJobs || 0,
      href: "/dashboard/jobs?status=active",
      icon: Hammer,
      accent: "bg-cyan-50 text-cyan-700"
    },
    {
      label: "Unpaid invoices",
      value: unpaidInvoices || 0,
      href: "/dashboard/invoices?status=open",
      icon: ReceiptText,
      accent: "bg-rose-50 text-rose-700"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Command center</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Dashboard</h1>
          <p className="mt-2 text-slate-500">Track every excavation opportunity from intake through final payment.</p>
        </div>
        <ButtonLink href="/dashboard/leads/new">Create lead</ButtonLink>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="mt-3 text-4xl font-bold text-slate-950">{stat.value}</p>
                  </div>
                  <div className={`rounded-2xl p-3 ${stat.accent}`}>
                    <Icon className="size-5" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Workflow shortcuts</CardTitle>
            <CardDescription>Common operations for the Coastline office team.</CardDescription>
          </CardHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <ButtonLink href="/dashboard/leads/new" variant="secondary">
              Add internal lead
            </ButtonLink>
            <ButtonLink href="/dashboard/proposals/new" variant="secondary">
              Draft proposal
            </ButtonLink>
            <ButtonLink href="/dashboard/jobs" variant="secondary">
              Manage jobs
            </ButtonLink>
            <ButtonLink href="/dashboard/invoices" variant="secondary">
              Review invoices
            </ButtonLink>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest system events.</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            {(recentActivity || []).length > 0 ? (
              recentActivity?.map((event) => (
                <div key={event.id} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <Badge value={event.entity_type}>{event.entity_type}</Badge>
                    <span className="text-xs text-slate-400">{formatDateTime(event.created_at)}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-900">{event.description || event.action}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Activity appears here as leads, proposals, jobs, and invoices move forward.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
