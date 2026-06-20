import { JobForm } from "@/components/jobs/JobForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { updateJobAction } from "@/lib/actions/jobs";
import { requireAdmin } from "@/lib/supabase/server";

type EditJobPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data: job, error } = await supabase.from("jobs").select("*").eq("id", id).single();

  if (error || !job) {
    throw new Error(error?.message || "Job not found");
  }

  const action = updateJobAction.bind(null, job.id);

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit {job.job_number}</CardTitle>
          <CardDescription>Update job details, notes, and status.</CardDescription>
        </CardHeader>
        <JobForm action={action} job={job} submitLabel="Update job" />
      </Card>
    </div>
  );
}
