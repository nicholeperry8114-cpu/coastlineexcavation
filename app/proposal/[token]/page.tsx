import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

import { ProposalStatusBadge } from "@/components/proposals/ProposalStatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { respondToProposalAction } from "@/lib/actions/proposals";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { currency } from "@/lib/utils/currency";
import { formatDate, formatDateTime } from "@/lib/utils/dates";

type PublicProposalPageProps = {
  params: Promise<{
    token: string;
  }>;
  searchParams: Promise<{
    response?: string;
  }>;
};

export default async function PublicProposalPage({ params, searchParams }: PublicProposalPageProps) {
  const { token } = await params;
  const query = await searchParams;
  const supabase = createSupabaseAdminClient();

  const { data: proposal, error } = await supabase
    .from("proposals")
    .select("*, leads(*), proposal_line_items(*)")
    .eq("public_token", token)
    .single();

  if (error || !proposal) {
    throw new Error(error?.message || "Proposal not found");
  }

  const isExpired = proposal.public_token_expires_at
    ? new Date(proposal.public_token_expires_at) < new Date()
    : false;
  const acceptedAction = respondToProposalAction.bind(null, token, "accepted");
  const rejectedAction = respondToProposalAction.bind(null, token, "rejected");

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <Link href="/" className="text-sm font-semibold text-cyan-700">
            Coastline Excavation
          </Link>
          <ProposalStatusBadge status={proposal.status} />
        </div>

        {query.response ? (
          <Card className="border-emerald-200 bg-emerald-50">
            <div className="flex gap-3">
              <CheckCircle2 className="size-6 text-emerald-600" />
              <div>
                <h1 className="font-semibold text-emerald-950">Response recorded</h1>
                <p className="text-sm text-emerald-800">
                  Thank you. Coastline Excavation has received your proposal response.
                </p>
              </div>
            </div>
          </Card>
        ) : null}

        <Card>
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Proposal</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-950">{proposal.proposal_number}</h1>
              <p className="mt-2 text-slate-500">
                Prepared for {proposal.leads?.customer_name} at {proposal.leads?.property_address}
              </p>
            </div>
            <div className="text-sm text-slate-600 md:text-right">
              <p>Proposal date: {formatDate(proposal.proposal_date)}</p>
              <p>Expires: {formatDate(proposal.expiration_date)}</p>
              {proposal.accepted_at ? <p>Accepted: {formatDateTime(proposal.accepted_at)}</p> : null}
              {proposal.rejected_at ? <p>Rejected: {formatDateTime(proposal.rejected_at)}</p> : null}
            </div>
          </div>

          <section className="py-6">
            <h2 className="text-lg font-semibold text-slate-950">Scope of work</h2>
            <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">{proposal.scope_of_work}</p>
          </section>

          <section className="border-t border-slate-200 pt-6">
            <h2 className="text-lg font-semibold text-slate-950">Investment</h2>
            <div className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-200">
              {proposal.proposal_line_items
                ?.sort((a, b) => a.sort_order - b.sort_order)
                .map((item) => (
                  <div key={item.id} className="grid gap-2 p-4 md:grid-cols-[1fr_100px_140px]">
                    <p className="font-medium text-slate-900">{item.description}</p>
                    <p className="text-sm text-slate-500">Qty {item.quantity}</p>
                    <p className="font-semibold text-slate-950 md:text-right">{currency(item.total_cents)}</p>
                  </div>
                ))}
            </div>
            <div className="mt-4 flex justify-end">
              <div className="min-w-64 rounded-2xl bg-slate-950 p-5 text-white">
                <p className="text-sm text-slate-300">Total</p>
                <p className="mt-1 text-3xl font-bold">{currency(proposal.total_cents)}</p>
              </div>
            </div>
          </section>

          <section className="mt-8 border-t border-slate-200 pt-6">
            {isExpired ? (
              <div className="flex gap-3 rounded-2xl bg-amber-50 p-4 text-amber-900">
                <XCircle className="size-5" />
                This proposal link has expired. Please contact Coastline Excavation.
              </div>
            ) : proposal.status === "accepted" || proposal.status === "rejected" ? (
              <p className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
                This proposal has already been {proposal.status}.
              </p>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                <form action={acceptedAction}>
                  <Button type="submit" className="w-full sm:w-auto">
                    Accept proposal
                  </Button>
                </form>
                <form action={rejectedAction}>
                  <Button type="submit" variant="secondary" className="w-full sm:w-auto">
                    Reject proposal
                  </Button>
                </form>
              </div>
            )}
          </section>
        </Card>
      </div>
    </main>
  );
}
