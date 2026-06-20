import { Badge } from "@/components/ui/Badge";
import type { InvoiceStatus } from "@/types/crm";

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return <Badge value={status} />;
}
