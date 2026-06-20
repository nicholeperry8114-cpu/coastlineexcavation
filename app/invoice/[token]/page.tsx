import Link from "next/link";

import { InvoiceStatusBadge } from "@/components/invoices/InvoiceStatusBadge";
import { PrintButton } from "@/components/invoices/PrintButton";
import { Card } from "@/components/ui/Card";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { currency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/dates";

type PublicInvoicePageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function PublicInvoicePage({ params }: PublicInvoicePageProps) {
  const { token } = await params;
  const supabase = createSupabaseAdminClient();

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*, jobs(*), invoice_line_items(*)")
    .eq("public_token", token)
    .single();

  if (error || !invoice) {
    throw new Error(error?.message || "Invoice not found");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 print:bg-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="print-hidden flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <Link href="/" className="text-sm font-semibold text-cyan-700">
            Coastline Excavation
          </Link>
          <PrintButton />
        </div>

        <Card className="print:border-0 print:shadow-none">
          <div className="flex flex-col justify-between gap-8 border-b border-slate-200 pb-8 md:flex-row">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Coastline Excavation</p>
              <h1 className="mt-4 text-4xl font-bold text-slate-950">Invoice</h1>
              <p className="mt-2 text-slate-500">{invoice.invoice_number}</p>
            </div>
            <div className="space-y-2 text-sm text-slate-600 md:text-right">
              <InvoiceStatusBadge status={invoice.status} />
              <p>Invoice date: {formatDate(invoice.invoice_date)}</p>
              <p>Due date: {formatDate(invoice.due_date)}</p>
            </div>
          </div>

          <div className="grid gap-6 border-b border-slate-200 py-8 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bill to</p>
              <p className="mt-2 font-semibold text-slate-950">{invoice.jobs?.customer_name}</p>
              <p className="text-sm text-slate-600">{invoice.jobs?.email}</p>
              <p className="text-sm text-slate-600">{invoice.jobs?.phone}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Job site</p>
              <p className="mt-2 text-sm font-medium text-slate-950">{invoice.jobs?.property_address}</p>
              <p className="mt-1 text-sm text-slate-500">{invoice.jobs?.job_number}</p>
            </div>
          </div>

          <div className="py-8">
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200">
              {invoice.invoice_line_items
                ?.sort((a, b) => a.sort_order - b.sort_order)
                .map((item) => (
                  <div key={item.id} className="grid gap-2 p-4 md:grid-cols-[1fr_100px_140px]">
                    <p className="font-medium text-slate-900">{item.description}</p>
                    <p className="text-sm text-slate-500">Qty {item.quantity}</p>
                    <p className="font-semibold text-slate-950 md:text-right">{currency(item.total_cents)}</p>
                  </div>
                ))}
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-3 rounded-2xl bg-slate-950 p-5 text-white print:bg-slate-100 print:text-slate-950">
              <div className="flex justify-between text-sm text-slate-300 print:text-slate-600">
                <span>Subtotal</span>
                <span>{currency(invoice.subtotal_cents)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-300 print:text-slate-600">
                <span>Deposit received</span>
                <span>-{currency(invoice.deposit_received_cents)}</span>
              </div>
              <div className="flex justify-between border-t border-white/15 pt-3 text-2xl font-bold print:border-slate-300">
                <span>Balance due</span>
                <span>{currency(invoice.remaining_balance_cents)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
