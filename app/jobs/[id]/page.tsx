import { notFound } from "next/navigation";
import { DetailPanel } from "@/app/components/DetailPanel";
import { formatCurrency, jobs } from "@/app/data/mock";

export function generateStaticParams() {
  return jobs.map((job) => ({ id: job.id }));
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = jobs.find((item) => item.id === id);

  if (!job) {
    notFound();
  }

  return (
    <DetailPanel
      backHref="/jobs"
      backLabel="Back to jobs"
      eyebrow="Job"
      title={job.title}
      status={job.status}
      summary={job.nextStep}
      rows={[
        { label: "Customer", value: job.customer },
        { label: "Address", value: job.address },
        { label: "Crew", value: job.crew },
        { label: "Start", value: job.start },
        { label: "Job value", value: formatCurrency(job.value) },
      ]}
    />
  );
}
