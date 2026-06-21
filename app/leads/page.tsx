import { LeadCard } from "@/app/components/Cards";
import { PageHeader, Section } from "@/app/components/PageChrome";
import { leads } from "@/app/data/mock";

export default function LeadsPage() {
  return (
    <div className="screen-stack">
      <PageHeader
        eyebrow="Pipeline"
        title="Leads"
        description="Capture new excavation opportunities and move qualified requests into proposals."
        action={{ label: "New Lead", href: "/leads" }}
      />

      <Section title="Mock lead inbox">
        <div className="card-list">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      </Section>
    </div>
  );
}
