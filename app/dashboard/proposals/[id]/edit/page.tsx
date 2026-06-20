import { ProposalForm } from "@/components/proposals/ProposalForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { updateProposalAction } from "@/lib/actions/proposals";
import { requireAdmin } from "@/lib/supabase/server";

type EditProposalPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProposalPage({ params }: EditProposalPageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const [
    { data: proposal, error: proposalError },
    { data: lineItems },
    { data: leads, error: leadsError }
  ] = await Promise.all([
    supabase.from("proposals").select("*").eq("id", id).single(),
    supabase
      .from("proposal_line_items")
      .select("*")
      .eq("proposal_id", id)
      .order("sort_order", { ascending: true }),
    supabase.from("leads").select("*").order("created_at", { ascending: false })
  ]);

  if (proposalError || !proposal) {
    throw new Error(proposalError?.message || "Proposal not found");
  }

  if (leadsError) {
    throw new Error(leadsError.message);
  }

  const action = updateProposalAction.bind(null, proposal.id);

  return (
    <div className="mx-auto max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit {proposal.proposal_number}</CardTitle>
          <CardDescription>Update proposal scope, status, and pricing.</CardDescription>
        </CardHeader>
        <ProposalForm
          action={action}
          leads={leads || []}
          proposal={proposal}
          lineItems={lineItems || []}
          submitLabel="Update proposal"
        />
      </Card>
    </div>
  );
}
