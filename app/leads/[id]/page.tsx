import { notFound } from "next/navigation";
import { DetailPanel } from "@/app/components/DetailPanel";
import { leads } from "@/app/data/mock";

export function generateStaticParams() {
  return leads.map((lead) => ({ id: lead.id }));
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = leads.find((item) => item.id === id);

  if (!lead) {
    notFound();
  }

  return (
    <DetailPanel
      backHref="/leads"
      backLabel="Back to leads"
      eyebrow={lead.jobType}
      title={lead.customer}
      status={lead.status}
      summary={lead.notes}
      rows={[
        { label: "Address", value: lead.address },
        { label: "Phone", value: lead.phone },
        { label: "Email", value: lead.email },
        { label: "Source", value: lead.source },
        { label: "Estimate range", value: lead.estimateRange },
        { label: "Received", value: lead.received },
      ]}
    />
  );
}
