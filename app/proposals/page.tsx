import { ProposalCard } from "@/app/components/Cards";
import { FilterTabs } from "@/app/components/FilterTabs";
import { EmptyHint, PageHeader, Section } from "@/app/components/PageChrome";
import { proposals, type ProposalStatus } from "@/app/data/mock";

const filters = ["All", "Draft", "Pending", "Accepted", "Rejected"];

type ProposalSearchParams = Promise<{
  status?: ProposalStatus | "All";
}>;

export default async function ProposalsPage({ searchParams }: { searchParams: ProposalSearchParams }) {
  const params = await searchParams;
  const active = filters.includes(params.status ?? "") ? params.status ?? "All" : "All";
  const filtered =
    active === "All" ? proposals : proposals.filter((proposal) => proposal.status === active);

  return (
    <div className="screen-stack">
      <PageHeader
        eyebrow="Estimates"
        title="Proposals"
        description="Draft, send, and track customer proposals before scheduling field work."
        action={{ label: "Create Proposal", href: "/proposals" }}
      />

      <FilterTabs basePath="/proposals" filters={filters} active={active} />

      <Section title={`${active} proposals`}>
        {filtered.length ? (
          <div className="card-list">
            {filtered.map((proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        ) : (
          <EmptyHint>No mock proposals match this filter.</EmptyHint>
        )}
      </Section>
    </div>
  );
}
