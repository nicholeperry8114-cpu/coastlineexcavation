import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { updateInvoiceAction } from "@/lib/actions/invoices";
import { requireAdmin } from "@/lib/supabase/server";

type EditInvoicePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const [
    { data: invoice, error: invoiceError },
    { data: lineItems },
    { data: jobs, error: jobsError }
  ] = await Promise.all([
    supabase.from("invoices").select("*").eq("id", id).single(),
    supabase.from("invoice_line_items").select("*").eq("invoice_id", id).order("sort_order", { ascending: true }),
    supabase.from("jobs").select("*").order("created_at", { ascending: false })
  ]);

  if (invoiceError || !invoice) {
    throw new Error(invoiceError?.message || "Invoice not found");
  }

  if (jobsError) {
    throw new Error(jobsError.message);
  }

  const action = updateInvoiceAction.bind(null, invoice.id);

  return (
    <div className="mx-auto max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit {invoice.invoice_number}</CardTitle>
          <CardDescription>Update invoice dates, line items, deposit, and status.</CardDescription>
        </CardHeader>
        <InvoiceForm
          action={action}
          jobs={jobs || []}
          invoice={invoice}
          lineItems={lineItems || []}
          submitLabel="Update invoice"
        />
      </Card>
    </div>
  );
}
