import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { createInvoiceAction } from "@/lib/actions/invoices";
import { requireAdmin } from "@/lib/supabase/server";

type NewInvoicePageProps = {
  searchParams: Promise<{
    jobId?: string;
  }>;
};

export default async function NewInvoicePage({ searchParams }: NewInvoicePageProps) {
  const params = await searchParams;
  const { supabase } = await requireAdmin();

  const [{ data: jobs, error: jobsError }, { data: selectedJob }] = await Promise.all([
    supabase.from("jobs").select("*").order("created_at", { ascending: false }),
    params.jobId
      ? supabase.from("jobs").select("*").eq("id", params.jobId).single()
      : Promise.resolve({ data: null })
  ]);

  if (jobsError) {
    throw new Error(jobsError.message);
  }

  const { data: proposalItems } = selectedJob
    ? await supabase
        .from("proposal_line_items")
        .select("description, quantity, unit_price_cents")
        .eq("proposal_id", selectedJob.proposal_id)
        .order("sort_order", { ascending: true })
    : { data: [] };

  return (
    <div className="mx-auto max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle>Create invoice</CardTitle>
          <CardDescription>Generate billing for an active job and share a printable customer invoice link.</CardDescription>
        </CardHeader>
        <InvoiceForm
          action={createInvoiceAction}
          jobs={jobs || []}
          defaultJobId={params.jobId}
          initialLineItems={proposalItems || []}
          submitLabel="Save draft"
        />
      </Card>
    </div>
  );
}
