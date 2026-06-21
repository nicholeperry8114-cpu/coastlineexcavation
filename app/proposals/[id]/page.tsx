import { notFound } from "next/navigation";
import { DetailPanel } from "@/app/components/DetailPanel";
import { formatCurrency, proposals } from "@/app/data/mock";

export function generateStaticParams() {
  return proposals.map((proposal) => ({ id: proposal.id }));
}

export default async function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const proposal = proposals.find((item) => item.id === id);

  if (!proposal) {
    notFound();
  }

  return (
    <DetailPanel
      backHref="/proposals"
      backLabel="Back to proposals"
      eyebrow="Proposal"
      title={proposal.title}
      status={proposal.status}
      summary={proposal.scope}
      rows={[
        { label: "Customer", value: proposal.customer },
        { label: "Linked lead", value: proposal.linkedLead },
        { label: "Amount", value: formatCurrency(proposal.amount) },
        { label: "Timeline", value: proposal.sent },
      ]}
    />
  );
}
