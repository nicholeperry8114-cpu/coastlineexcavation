import Link from "next/link";

import { ProposalStatusBadge } from "@/components/proposals/ProposalStatusBadge";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { Table, Td, Th } from "@/components/ui/Table";
import { requireAdmin } from "@/lib/supabase/server";
import { proposalStatuses } from "@/lib/validation/proposals";
import { currency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/dates";
import { titleCase } from "@/lib/utils/strings";

type ProposalsPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function ProposalsPage({ searchParams }: ProposalsPageProps) {
  const params = await searchParams;
  const status = params.status || "";
  const { supabase } = await requireAdmin();

  let query = supabase
    .from("proposals")
    .select("*, leads(*)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status as never);
  }

  const { data: proposals, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Proposals</h1>
          <p className="mt-2 text-slate-500">Draft, send, and track customer approvals.</p>
        </div>
        <ButtonLink href="/dashboard/proposals/new">New proposal</ButtonLink>
      </div>

      <form className="flex max-w-sm gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Select name="status" defaultValue={status || "all"}>
          <option value="all">All statuses</option>
          {proposalStatuses.map((proposalStatus) => (
            <option key={proposalStatus} value={proposalStatus}>
              {titleCase(proposalStatus)}
            </option>
          ))}
        </Select>
        <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white" type="submit">
          Filter
        </button>
      </form>

      {proposals && proposals.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Proposal</Th>
              <Th>Customer</Th>
              <Th>Date</Th>
              <Th>Total</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {proposals.map((proposal) => (
              <tr key={proposal.id} className="hover:bg-slate-50">
                <Td>
                  <Link className="font-semibold text-cyan-700" href={`/dashboard/proposals/${proposal.id}`}>
                    {proposal.proposal_number}
                  </Link>
                </Td>
                <Td>
                  <p className="font-medium text-slate-950">{proposal.leads?.customer_name}</p>
                  <p className="text-xs text-slate-500">{proposal.leads?.property_address}</p>
                </Td>
                <Td>{formatDate(proposal.proposal_date)}</Td>
                <Td className="font-semibold text-slate-950">{currency(proposal.total_cents)}</Td>
                <Td>
                  <ProposalStatusBadge status={proposal.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyState
          title="No proposals found"
          description="Convert an active lead into a proposal to build scope, pricing, and a customer approval link."
          action={<ButtonLink href="/dashboard/proposals/new">Create proposal</ButtonLink>}
        />
      )}
    </div>
  );
}
