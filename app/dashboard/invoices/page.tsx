import Link from "next/link";

import { InvoiceStatusBadge } from "@/components/invoices/InvoiceStatusBadge";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { Table, Td, Th } from "@/components/ui/Table";
import { requireAdmin } from "@/lib/supabase/server";
import { invoiceStatuses } from "@/lib/validation/invoices";
import { currency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/dates";
import { titleCase } from "@/lib/utils/strings";

type InvoicesPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function InvoicesPage({ searchParams }: InvoicesPageProps) {
  const params = await searchParams;
  const status = params.status || "";
  const { supabase } = await requireAdmin();

  let query = supabase.from("invoices").select("*, jobs(*)").order("created_at", { ascending: false });

  if (status === "open") {
    query = query.neq("status", "paid");
  } else if (status && status !== "all") {
    query = query.eq("status", status as never);
  }

  const { data: invoices, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Invoices</h1>
          <p className="mt-2 text-slate-500">Create, send, print, and track payments.</p>
        </div>
        <ButtonLink href="/dashboard/invoices/new">New invoice</ButtonLink>
      </div>

      <form className="flex max-w-sm gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Select name="status" defaultValue={status || "all"}>
          <option value="all">All statuses</option>
          <option value="open">Open invoices</option>
          {invoiceStatuses.map((invoiceStatus) => (
            <option key={invoiceStatus} value={invoiceStatus}>
              {titleCase(invoiceStatus)}
            </option>
          ))}
        </Select>
        <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white" type="submit">
          Filter
        </button>
      </form>

      {invoices && invoices.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Invoice</Th>
              <Th>Customer</Th>
              <Th>Due</Th>
              <Th>Total</Th>
              <Th>Balance</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-slate-50">
                <Td>
                  <Link className="font-semibold text-cyan-700" href={`/dashboard/invoices/${invoice.id}`}>
                    {invoice.invoice_number}
                  </Link>
                </Td>
                <Td>
                  <p className="font-medium text-slate-950">{invoice.jobs?.customer_name}</p>
                  <p className="text-xs text-slate-500">{invoice.jobs?.job_number}</p>
                </Td>
                <Td>{formatDate(invoice.due_date)}</Td>
                <Td className="font-semibold text-slate-950">{currency(invoice.total_amount_cents)}</Td>
                <Td>{currency(invoice.remaining_balance_cents)}</Td>
                <Td>
                  <InvoiceStatusBadge status={invoice.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyState
          title="No invoices found"
          description="Create invoices from job detail pages or start a new invoice and link an active job."
          action={<ButtonLink href="/dashboard/invoices/new">Create invoice</ButtonLink>}
        />
      )}
    </div>
  );
}
