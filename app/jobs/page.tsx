import { JobCard } from "@/app/components/Cards";
import { FilterTabs } from "@/app/components/FilterTabs";
import { EmptyHint, PageHeader, Section } from "@/app/components/PageChrome";
import { jobs, type JobStatus } from "@/app/data/mock";

const filters = ["All", "Active", "Final Payment Due", "Completed"];

type JobSearchParams = Promise<{
  status?: JobStatus | "All";
}>;

export default async function JobsPage({ searchParams }: { searchParams: JobSearchParams }) {
  const params = await searchParams;
  const active = filters.includes(params.status ?? "") ? params.status ?? "All" : "All";
  const filtered = active === "All" ? jobs : jobs.filter((job) => job.status === active);

  return (
    <div className="screen-stack">
      <PageHeader
        eyebrow="Field work"
        title="Jobs"
        description="See active work, closeouts, crew notes, and final-payment-ready jobs."
        action={{ label: "Create Job", href: "/jobs" }}
      />

      <FilterTabs basePath="/jobs" filters={filters} active={active} />

      <Section title={`${active} jobs`}>
        {filtered.length ? (
          <div className="card-list">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <EmptyHint>No mock jobs match this filter.</EmptyHint>
        )}
      </Section>
    </div>
  );
}
