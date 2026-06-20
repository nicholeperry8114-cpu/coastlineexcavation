import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils/strings";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100",
        className
      )}
      {...props}
    />
  );
}
