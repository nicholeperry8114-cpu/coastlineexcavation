type StatusBadgeProps = {
  status: string;
};

const toneByStatus: Record<string, string> = {
  New: "badge--accent",
  Contacted: "badge--blue",
  "Site Visit": "badge--sand",
  Won: "badge--green",
  Draft: "badge--slate",
  Pending: "badge--accent",
  Accepted: "badge--green",
  Rejected: "badge--danger",
  Active: "badge--blue",
  "Final Payment Due": "badge--accent",
  Completed: "badge--green",
  Sent: "badge--blue",
  "Deposit Paid": "badge--sand",
  "Balance Due": "badge--accent",
  Paid: "badge--green",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`badge ${toneByStatus[status] ?? "badge--slate"}`}>{status}</span>;
}
