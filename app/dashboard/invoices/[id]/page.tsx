import Link from "next/link";

import { InvoiceStatusBadge } from "@/components/invoices/InvoiceStatusBadge";
import { PrintButton } from "@/components/invoices/PrintButton";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { updateInvoiceStatusAction } from "@/lib/actions/invoices";
import { getSiteUrl } from "@/lib/env";
import { requireAdmin } from "@/lib/supabase/server";
import { invoiceStatuses } from "@/lib/validation/invoices";
import { currency } from "@/lib/utils/currency";
import { formatDate, formatDateTime } from "@/lib/utils/dates";
import { titleCase } from "@/lib/utils/strings";

type InvoiceDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const [
    { data: invoice, error: invoiceError },
    { data: lineItems },
    { data: activity }
  ] = await Promise.all([
    supabase.from("invoices").select("*, jobs(*)").eq("id", id).single(),
    supabase.from("invoice_line_items").select("*").eq("invoice_id", id).order("sort_order", { ascending: true }),
    supabase
      .from("activity_events")
      .select("*")
      .eq("entity_type", "invoice")
      .eq("entity_id", id)
      .order("created_at", { ascending: false })
      .limit(8)
  ]);

  if (invoiceError || !invoice) {
    throw new Error(invoiceError?.message || "Invoice not found");
  }

  const publicLink = `${getSiteUrl()}/invoice/${invoice.public_token}`;
  const emailHref = `mailto:${invoice.jobs?.email}?subject=${encodeURIComponent(
    `Invoice ${invoice.invoice_number} from Coastline Excavation`
  )}&body=${encodeURIComponent(`Hello ${invoice.jobs?.customer_name},\n\nYou can view and print your invoice here:\n${publicLink}\n\nThank you,\nCoastline Excavation`)}`;
  const statusAction = updateInvoiceStatusAction.bind(null, invoice.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">{invoice.invoice_number}</h1>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
          <p className="mt-2 text-slate-500">Due {formatDate(invoice.due_date)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`/dashboard/invoices/${invoice.id}/edit`} variant="secondary">
            Edit invoice
          </ButtonLink>
          <ButtonLink href={publicLink} variant="secondary" target="_blank">
            Customer link
          </ButtonLink>
          <ButtonLink href={emailHref}>Email invoice link</ButtonLink>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Invoice details</CardTitle>
            <CardDescription>
              Job{" "}
              <Link className="font-semibold text-cyan-700" href={`/dashboard/jobs/${invoice.job_id}`}>
                {invoice.jobs?.job_number}
              </Link>
            </CardDescription>
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <Summary label="Customer" value={invoice.jobs?.customer_name || ""} />
            <Summary label="Invoice date" value={formatDate(invoice.invoice_date)} />
            <Summary label="Due date" value={formatDate(invoice.due_date)} />
            <Summary label="Remaining balance" value={currency(invoice.remaining_balance_cents)} />
          </div>

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
            <div className="w-full max-w-sm space-y-2 rounded-2xl bg-slate-950 p-5 text-white">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Subtotal</span>
                <span>{currency(invoice.subtotal_cents)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-300">
                <span>Deposit received</span>
                <span>-{currency(invoice.deposit_received_cents)}</span>
              </div>
              <div className="flex justify-between border-t border-white/15 pt-3 text-xl font-bold">
                <span>Balance</span>
                <span>{currency(invoice.remaining_balance_cents)}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status management</CardTitle>
              <CardDescription>Update invoice state.</CardDescription>
            </CardHeader>
            <form action={statusAction} className="flex gap-3">
              <Select name="status" defaultValue={invoice.status}>
                {invoiceStatuses.map((status) => (
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
              <CardTitle>Printable PDF</CardTitle>
              <CardDescription>Open the customer invoice and print/save as PDF.</CardDescription>
            </CardHeader>
            <PrintButton />
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>Recent changes for this invoice.</CardDescription>
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
