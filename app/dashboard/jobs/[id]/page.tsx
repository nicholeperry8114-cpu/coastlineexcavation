import Link from "next/link";
import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

import { InvoiceStatusBadge } from "@/components/invoices/InvoiceStatusBadge";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { updateJobStatusAction } from "@/lib/actions/jobs";
import { requireAdmin } from "@/lib/supabase/server";
import { jobStatuses } from "@/lib/validation/jobs";
import { currency } from "@/lib/utils/currency";
import { formatDateTime } from "@/lib/utils/dates";
import { titleCase } from "@/lib/utils/strings";

type JobDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const [
    { data: job, error: jobError },
    { data: invoices },
    { data: activity }
  ] = await Promise.all([
    supabase.from("jobs").select("*, proposals(*)").eq("id", id).single(),
    supabase.from("invoices").select("*").eq("job_id", id).order("created_at", { ascending: false }),
    supabase
      .from("activity_events")
      .select("*")
      .eq("entity_type", "job")
      .eq("entity_id", id)
      .order("created_at", { ascending: false })
      .limit(8)
  ]);

  if (jobError || !job) {
    throw new Error(jobError?.message || "Job not found");
  }

  const statusAction = updateJobStatusAction.bind(null, job.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">{job.job_number}</h1>
            <JobStatusBadge status={job.status} />
          </div>
          <p className="mt-2 text-slate-500">Created {formatDateTime(job.created_at)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`/dashboard/jobs/${job.id}/edit`} variant="secondary">
            Edit job
          </ButtonLink>
          <ButtonLink href={`/dashboard/invoices/new?jobId=${job.id}`}>Create invoice</ButtonLink>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>{job.customer_name}</CardTitle>
            <CardDescription>Linked proposal {job.proposals?.proposal_number}</CardDescription>
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoTile icon={<Mail className="size-4" />} label="Email" value={job.email} href={`mailto:${job.email}`} />
            <InfoTile icon={<Phone className="size-4" />} label="Phone" value={job.phone} href={`tel:${job.phone}`} />
            <InfoTile icon={<MapPin className="size-4" />} label="Address" value={job.property_address} className="md:col-span-2" />
          </div>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Notes</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{job.notes || "No notes yet."}</p>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status management</CardTitle>
              <CardDescription>Update job progress and closeout state.</CardDescription>
            </CardHeader>
            <form action={statusAction} className="flex gap-3">
              <Select name="status" defaultValue={job.status}>
                {jobStatuses.map((status) => (
                  <option key={status} value={status}>
                    {titleCase(status)}
                  </option>
                ))}
              </Select>
              <Button type="submit">Save</Button>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Proposal</CardTitle>
              <CardDescription>Original accepted scope.</CardDescription>
            </CardHeader>
            <Link href={`/dashboard/proposals/${job.proposal_id}`} className="block rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
              <p className="font-semibold text-cyan-700">{job.proposals?.proposal_number}</p>
              <p className="mt-1 text-sm text-slate-500">Total {currency(job.proposals?.total_cents || 0)}</p>
            </Link>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Billing generated for this job.</CardDescription>
        </CardHeader>
        <div className="space-y-3">
          {invoices && invoices.length > 0 ? (
            invoices.map((invoice) => (
              <Link key={invoice.id} href={`/dashboard/invoices/${invoice.id}`} className="grid gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50 md:grid-cols-[1fr_140px_120px]">
                <div>
                  <p className="font-semibold text-cyan-700">{invoice.invoice_number}</p>
                  <p className="text-sm text-slate-500">Remaining {currency(invoice.remaining_balance_cents)}</p>
                </div>
                <p className="font-semibold text-slate-950">{currency(invoice.total_amount_cents)}</p>
                <InvoiceStatusBadge status={invoice.status} />
              </Link>
            ))
          ) : (
            <p className="text-sm text-slate-500">No invoices created yet.</p>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>Recent changes for this job.</CardDescription>
        </CardHeader>
        <div className="space-y-3">
          {(activity || []).length > 0 ? (
            activity?.map((event) => (
              <div key={event.id} className="rounded-xl bg-slate-50 p-3">
                <p className="text-sm font-medium text-slate-900">{event.description || event.action}</p>
                <p className="mt-1 text-xs text-slate-500">{formatDateTime(event.created_at)}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No activity yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

function InfoTile({
  icon,
  label,
  value,
  href,
  className
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  className?: string;
}) {
  const content = href ? (
    <a className="text-sm font-medium text-slate-950" href={href}>
      {value}
    </a>
  ) : (
    <p className="text-sm font-medium text-slate-950">{value}</p>
  );

  return (
    <div className={`flex gap-3 rounded-xl bg-slate-50 p-4 ${className || ""}`}>
      <div className="mt-0.5 text-cyan-700">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        {content}
      </div>
    </div>
  );
}
