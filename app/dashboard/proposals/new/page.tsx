import { ProposalForm } from "@/components/proposals/ProposalForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { createProposalAction } from "@/lib/actions/proposals";
import { requireAdmin } from "@/lib/supabase/server";

type NewProposalPageProps = {
  searchParams: Promise<{
    leadId?: string;
  }>;
};

export default async function NewProposalPage({ searchParams }: NewProposalPageProps) {
  const params = await searchParams;
  const { supabase } = await requireAdmin();
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle>Create proposal</CardTitle>
          <CardDescription>Build scope, pricing, and a public customer approval page.</CardDescription>
        </CardHeader>
        <ProposalForm
          action={createProposalAction}
          leads={leads || []}
          defaultLeadId={params.leadId}
          submitLabel="Save draft"
        />
      </Card>
    </div>
  );
}
