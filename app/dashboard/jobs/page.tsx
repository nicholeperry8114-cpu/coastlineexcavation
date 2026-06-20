import Link from "next/link";

import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { Table, Td, Th } from "@/components/ui/Table";
import { requireAdmin } from "@/lib/supabase/server";
import { jobStatuses } from "@/lib/validation/jobs";
import { formatDateTime } from "@/lib/utils/dates";
import { titleCase } from "@/lib/utils/strings";

type JobsPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const status = params.status || "";
  const { supabase } = await requireAdmin();

  let query = supabase.from("jobs").select("*, proposals(*)").order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status as never);
  }

  const { data: jobs, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Jobs</h1>
        <p className="mt-2 text-slate-500">Manage active excavation work and close out final payments.</p>
      </div>

      <form className="flex max-w-sm gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Select name="status" defaultValue={status || "all"}>
          <option value="all">All statuses</option>
          {jobStatuses.map((jobStatus) => (
            <option key={jobStatus} value={jobStatus}>
              {titleCase(jobStatus)}
            </option>
          ))}
        </Select>
        <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white" type="submit">
          Filter
        </button>
      </form>

      {jobs && jobs.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Job</Th>
              <Th>Customer</Th>
              <Th>Address</Th>
              <Th>Status</Th>
              <Th>Created</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50">
                <Td>
                  <Link className="font-semibold text-cyan-700" href={`/dashboard/jobs/${job.id}`}>
                    {job.job_number}
                  </Link>
                </Td>
                <Td>
                  <p className="font-medium text-slate-950">{job.customer_name}</p>
                  <p className="text-xs text-slate-500">{job.email}</p>
                </Td>
                <Td>{job.property_address}</Td>
                <Td>
                  <JobStatusBadge status={job.status} />
                </Td>
                <Td>{formatDateTime(job.created_at)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyState
          title="No jobs yet"
          description="Accepted proposals can be converted into active jobs from the proposal detail page."
        />
      )}
    </div>
  );
}
