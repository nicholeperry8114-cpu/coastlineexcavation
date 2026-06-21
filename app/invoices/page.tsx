import { InvoiceCard } from "@/app/components/Cards";
import { PageHeader, Section } from "@/app/components/PageChrome";
import { invoices } from "@/app/data/mock";

export default function InvoicesPage() {
  return (
    <div className="screen-stack">
      <PageHeader
        eyebrow="Money"
        title="Invoices"
        description="Track deposits, balances, and final payments from completed field work."
        action={{ label: "Create Invoice", href: "/invoices" }}
      />

      <Section title="Mock invoices">
        <div className="card-list">
          {invoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      </Section>
    </div>
  );
}
