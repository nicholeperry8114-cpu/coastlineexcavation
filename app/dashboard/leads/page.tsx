import Link from "next/link";
import { Search } from "lucide-react";

import { LeadStatusBadge } from "@/components/leads/LeadStatusBadge";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table, Td, Th } from "@/components/ui/Table";
import { requireAdmin } from "@/lib/supabase/server";
import { leadStatuses } from "@/lib/validation/leads";
import { formatDateTime } from "@/lib/utils/dates";
import { titleCase } from "@/lib/utils/strings";

type LeadsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams;
  const { supabase } = await requireAdmin();
  const search = params.q?.trim() || "";
  const status = params.status || "";

  let query = supabase.from("leads").select("*").order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status as never);
  }

  if (search) {
    const pattern = `%${search.replace(/[%_]/g, "")}%`;
    query = query.or(
      `customer_name.ilike.${pattern},email.ilike.${pattern},phone.ilike.${pattern},property_address.ilike.${pattern},job_type.ilike.${pattern}`
    );
  }

  const { data: leads, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Leads</h1>
          <p className="mt-2 text-slate-500">Capture intake requests and qualify excavation opportunities.</p>
        </div>
        <ButtonLink href="/dashboard/leads/new">New lead</ButtonLink>
      </div>

      <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input name="q" placeholder="Search leads..." defaultValue={search} className="pl-9" />
        </div>
        <Select name="status" defaultValue={status || "all"}>
          <option value="all">All statuses</option>
          {leadStatuses.map((leadStatus) => (
            <option key={leadStatus} value={leadStatus}>
              {titleCase(leadStatus)}
            </option>
          ))}
        </Select>
        <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white" type="submit">
          Filter
        </button>
      </form>

      {leads && leads.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Lead</Th>
              <Th>Customer</Th>
              <Th>Job type</Th>
              <Th>Status</Th>
              <Th>Created</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50">
                <Td>
                  <Link className="font-semibold text-cyan-700" href={`/dashboard/leads/${lead.id}`}>
                    {lead.lead_number}
                  </Link>
                </Td>
                <Td>
                  <p className="font-medium text-slate-950">{lead.customer_name}</p>
                  <p className="text-xs text-slate-500">{lead.email}</p>
                </Td>
                <Td>{lead.job_type}</Td>
                <Td>
                  <LeadStatusBadge status={lead.status} />
                </Td>
                <Td>{formatDateTime(lead.created_at)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyState
          title="No leads found"
          description="Create a lead manually or share the public intake form with customers."
          action={<ButtonLink href="/dashboard/leads/new">Create lead</ButtonLink>}
        />
      )}
    </div>
  );
}
