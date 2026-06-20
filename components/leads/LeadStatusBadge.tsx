import { Badge } from "@/components/ui/Badge";
import type { LeadStatus } from "@/types/crm";

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <Badge value={status} />;
}
