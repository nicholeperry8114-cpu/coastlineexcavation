import type { HTMLAttributes } from "react";

import { cn, titleCase } from "@/lib/utils/strings";

const colorMap: Record<string, string> = {
  new: "bg-sky-50 text-sky-700 ring-sky-200",
  contacted: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  proposal_drafted: "bg-amber-50 text-amber-700 ring-amber-200",
  closed: "bg-slate-100 text-slate-700 ring-slate-200",
  draft: "bg-slate-100 text-slate-700 ring-slate-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  active: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  final_payment_due: "bg-orange-50 text-orange-700 ring-orange-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  sent: "bg-blue-50 text-blue-700 ring-blue-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200"
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  value: string;
};

export function Badge({ className, value, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        colorMap[value] || "bg-slate-100 text-slate-700 ring-slate-200",
        className
      )}
      {...props}
    >
      {children || titleCase(value)}
    </span>
  );
}
