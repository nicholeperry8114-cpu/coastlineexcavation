import { LineItemsEditor } from "@/components/forms/LineItemsEditor";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { invoiceStatuses } from "@/lib/validation/invoices";
import { centsToDollars } from "@/lib/utils/currency";
import { addDaysIsoDate, todayIsoDate } from "@/lib/utils/dates";
import { titleCase } from "@/lib/utils/strings";
import type { Invoice, InvoiceLineItem, Job } from "@/types/crm";

type InvoiceFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  jobs: Job[];
  invoice?: Invoice;
  lineItems?: InvoiceLineItem[];
  defaultJobId?: string;
  initialLineItems?: Array<{
    description: string;
    quantity: number;
    unit_price_cents: number;
  }>;
  submitLabel?: string;
};

export function InvoiceForm({
  action,
  jobs,
  invoice,
  lineItems,
  defaultJobId,
  initialLineItems,
  submitLabel = "Save invoice"
}: InvoiceFormProps) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-4">
        <Field label="Linked job">
          <Select name="job_id" defaultValue={invoice?.job_id || defaultJobId || ""} required>
            <option value="" disabled>
              Select job
            </option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.job_number} - {job.customer_name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Invoice date">
          <Input name="invoice_date" type="date" defaultValue={invoice?.invoice_date || todayIsoDate()} required />
        </Field>
        <Field label="Due date">
          <Input name="due_date" type="date" defaultValue={invoice?.due_date || addDaysIsoDate(15)} required />
        </Field>
        <Field label="Status">
          <Select name="status" defaultValue={invoice?.status || "draft"}>
            {invoiceStatuses.map((status) => (
              <option key={status} value={status}>
                {titleCase(status)}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Deposit received">
        <Input
          name="deposit_received"
          type="number"
          min="0"
          step="0.01"
          defaultValue={invoice ? centsToDollars(invoice.deposit_received_cents) : 0}
        />
      </Field>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">Line items</h2>
        <LineItemsEditor initialItems={lineItems || initialLineItems || []} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit">{submitLabel}</Button>
        <Button type="submit" name="intent_status" value="sent" variant="secondary">
          Save and mark sent
        </Button>
      </div>
    </form>
  );
}
