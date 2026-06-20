import Link from "next/link";

import { ProposalStatusBadge } from "@/components/proposals/ProposalStatusBadge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { convertProposalToJobAction } from "@/lib/actions/jobs";
import { updateProposalStatusAction } from "@/lib/actions/proposals";
import { getSiteUrl } from "@/lib/env";
import { requireAdmin } from "@/lib/supabase/server";
import { proposalStatuses } from "@/lib/validation/proposals";
import { currency } from "@/lib/utils/currency";
import { formatDate, formatDateTime } from "@/lib/utils/dates";
import { titleCase } from "@/lib/utils/strings";

type ProposalDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProposalDetailPage({ params }: ProposalDetailPageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const [
    { data: proposal, error: proposalError },
    { data: lineItems },
    { data: job },
    { data: activity }
  ] = await Promise.all([
    supabase.from("proposals").select("*, leads(*)").eq("id", id).single(),
    supabase
      .from("proposal_line_items")
      .select("*")
      .eq("proposal_id", id)
      .order("sort_order", { ascending: true }),
    supabase.from("jobs").select("*").eq("proposal_id", id).maybeSingle(),
    supabase
      .from("activity_events")
      .select("*")
      .eq("entity_type", "proposal")
      .eq("entity_id", id)
      .order("created_at", { ascending: false })
      .limit(8)
  ]);

  if (proposalError || !proposal) {
    throw new Error(proposalError?.message || "Proposal not found");
  }

  const publicLink = `${getSiteUrl()}/proposal/${proposal.public_token}`;
  const statusAction = updateProposalStatusAction.bind(null, proposal.id);
  const convertAction = convertProposalToJobAction.bind(null, proposal.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">{proposal.proposal_number}</h1>
            <ProposalStatusBadge status={proposal.status} />
          </div>
          <p className="mt-2 text-slate-500">
            {proposal.leads?.customer_name} · Expires {formatDate(proposal.expiration_date)}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`/dashboard/proposals/${proposal.id}/edit`} variant="secondary">
            Edit proposal
          </ButtonLink>
          <ButtonLink href={publicLink} target="_blank" variant="secondary">
            Public link
          </ButtonLink>
          {job ? (
            <ButtonLink href={`/dashboard/jobs/${job.id}`}>View job</ButtonLink>
          ) : proposal.status === "accepted" ? (
            <form action={convertAction}>
              <Button type="submit">Convert to job</Button>
            </form>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Proposal scope</CardTitle>
            <CardDescription>
              Linked lead{" "}
              <Link className="font-semibold text-cyan-700" href={`/dashboard/leads/${proposal.lead_id}`}>
                {proposal.leads?.lead_number}
              </Link>
            </CardDescription>
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-3">
            <Summary label="Customer" value={proposal.leads?.customer_name || ""} />
            <Summary label="Proposal date" value={formatDate(proposal.proposal_date)} />
            <Summary label="Expiration" value={formatDate(proposal.expiration_date)} />
          </div>
          <section className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Scope of work</h2>
            <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">{proposal.scope_of_work}</p>
          </section>
          <div className="mt-6 divide-y divide-slate-100 rounded-2xl border border-slate-200">
            {(lineItems || []).map((item) => (
              <div key={item.id} className="grid gap-2 p-4 md:grid-cols-[1fr_100px_140px]">
                <p className="font-medium text-slate-900">{item.description}</p>
                <p className="text-sm text-slate-500">Qty {item.quantity}</p>
                <p className="font-semibold text-slate-950 md:text-right">{currency(item.total_cents)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <div className="min-w-64 rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-sm text-slate-300">Total</p>
              <p className="mt-1 text-3xl font-bold">{currency(proposal.total_cents)}</p>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status management</CardTitle>
              <CardDescription>Draft, send, accept, or reject proposal.</CardDescription>
            </CardHeader>
            <form action={statusAction} className="flex gap-3">
              <Select name="status" defaultValue={proposal.status}>
                {proposalStatuses.map((status) => (
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
              <CardTitle>Customer approval</CardTitle>
              <CardDescription>Share this public proposal link with the customer.</CardDescription>
            </CardHeader>
            <div className="rounded-xl bg-slate-100 p-3 text-sm text-slate-700 break-all">{publicLink}</div>
            {proposal.accepted_at ? (
              <p className="mt-3 text-sm text-emerald-700">Accepted {formatDateTime(proposal.accepted_at)}</p>
            ) : null}
            {proposal.rejected_at ? (
              <p className="mt-3 text-sm text-rose-700">Rejected {formatDateTime(proposal.rejected_at)}</p>
            ) : null}
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>Recent changes for this proposal.</CardDescription>
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

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-950">{value}</p>
    </div>
  );
}
