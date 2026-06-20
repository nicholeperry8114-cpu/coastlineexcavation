import { LeadForm } from "@/components/leads/LeadForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { createLeadAction } from "@/lib/actions/leads";

export default function NewLeadPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Create lead</CardTitle>
          <CardDescription>Add an internal lead and attach any photos or documents.</CardDescription>
        </CardHeader>
        <LeadForm action={createLeadAction} submitLabel="Create lead" />
      </Card>
    </div>
  );
}
