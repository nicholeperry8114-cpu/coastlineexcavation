import { Badge } from "@/components/ui/Badge";
import type { JobStatus } from "@/types/crm";

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return <Badge value={status} />;
}
