import { Badge } from "@/components/ui/Badge";
import type { ProposalStatus } from "@/types/crm";

export function ProposalStatusBadge({ status }: { status: ProposalStatus }) {
  return <Badge value={status} />;
}
