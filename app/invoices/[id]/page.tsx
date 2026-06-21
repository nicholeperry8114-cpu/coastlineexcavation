import { notFound } from "next/navigation";
import { DetailPanel } from "@/app/components/DetailPanel";
import { formatCurrency, invoices } from "@/app/data/mock";

export function generateStaticParams() {
  return invoices.map((invoice) => ({ id: invoice.id }));
}

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = invoices.find((item) => item.id === id);

  if (!invoice) {
    notFound();
  }

  return (
    <DetailPanel
      backHref="/invoices"
      backLabel="Back to invoices"
      eyebrow="Invoice"
      title={invoice.job}
      status={invoice.status}
      summary={`${invoice.customer} has ${formatCurrency(invoice.balanceDue)} remaining on a ${formatCurrency(
        invoice.total,
      )} invoice.`}
      rows={[
        { label: "Customer", value: invoice.customer },
        { label: "Total amount", value: formatCurrency(invoice.total) },
        { label: "Deposit paid", value: formatCurrency(invoice.depositPaid) },
        { label: "Balance due", value: formatCurrency(invoice.balanceDue) },
        { label: "Due", value: invoice.due },
      ]}
    />
  );
}
