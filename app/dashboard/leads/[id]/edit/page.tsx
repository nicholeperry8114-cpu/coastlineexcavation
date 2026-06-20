import { LeadForm } from "@/components/leads/LeadForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { updateLeadAction } from "@/lib/actions/leads";
import { requireAdmin } from "@/lib/supabase/server";

type EditLeadPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditLeadPage({ params }: EditLeadPageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data: lead, error } = await supabase.from("leads").select("*").eq("id", id).single();

  if (error || !lead) {
    throw new Error(error?.message || "Lead not found");
  }

  const action = updateLeadAction.bind(null, lead.id);

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit {lead.lead_number}</CardTitle>
          <CardDescription>Update lead details and internal notes.</CardDescription>
        </CardHeader>
        <LeadForm action={action} lead={lead} submitLabel="Update lead" />
      </Card>
    </div>
  );
}
