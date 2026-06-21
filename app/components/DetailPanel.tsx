import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { StatusBadge } from "@/app/components/StatusBadge";

type DetailPanelProps = {
  backHref: string;
  backLabel: string;
  eyebrow: string;
  title: string;
  status: string;
  summary: string;
  rows: Array<{
    label: string;
    value: string;
  }>;
};

export function DetailPanel({
  backHref,
  backLabel,
  eyebrow,
  title,
  status,
  summary,
  rows,
}: DetailPanelProps) {
  return (
    <div className="screen-stack">
      <Link href={backHref} className="back-link">
        <ChevronLeft size={18} aria-hidden="true" />
        {backLabel}
      </Link>

      <section className="detail-hero">
        <div className="card-row">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
          </div>
          <StatusBadge status={status} />
        </div>
        <p>{summary}</p>
      </section>

      <section className="detail-card">
        {rows.map((row) => (
          <div className="detail-row" key={row.label}>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </div>
        ))}
      </section>

      <div className="prototype-note">
        <strong>Prototype action area</strong>
        <p>Future versions could edit this record, add notes, upload photos, or collect signatures.</p>
      </div>
    </div>
  );
}
