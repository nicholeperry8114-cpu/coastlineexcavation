import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { jobStatuses } from "@/lib/validation/jobs";
import { titleCase } from "@/lib/utils/strings";
import type { Job } from "@/types/crm";

export function JobForm({
  action,
  job,
  submitLabel = "Save job"
}: {
  action: (formData: FormData) => void | Promise<void>;
  job: Job;
  submitLabel?: string;
}) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Customer name">
          <Input name="customer_name" defaultValue={job.customer_name} required />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" defaultValue={job.email} required />
        </Field>
        <Field label="Phone">
          <Input name="phone" type="tel" defaultValue={job.phone} required />
        </Field>
        <Field label="Status">
          <Select name="status" defaultValue={job.status}>
            {jobStatuses.map((status) => (
              <option key={status} value={status}>
                {titleCase(status)}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Property address">
        <Input name="property_address" defaultValue={job.property_address} required />
      </Field>
      <Field label="Notes">
        <Textarea name="notes" defaultValue={job.notes || ""} />
      </Field>
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
