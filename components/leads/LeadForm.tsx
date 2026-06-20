import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { leadStatuses } from "@/lib/validation/leads";
import { titleCase } from "@/lib/utils/strings";
import type { Lead } from "@/types/crm";

type LeadFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  lead?: Lead;
  submitLabel?: string;
  publicForm?: boolean;
};

export function LeadForm({ action, lead, submitLabel = "Save lead", publicForm = false }: LeadFormProps) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Customer name">
          <Input name="customer_name" defaultValue={lead?.customer_name} required />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" defaultValue={lead?.email} required />
        </Field>
        <Field label="Phone">
          <Input name="phone" type="tel" defaultValue={lead?.phone} required />
        </Field>
        <Field label="Job type">
          <Input name="job_type" defaultValue={lead?.job_type} placeholder="Grading, driveway, trenching..." required />
        </Field>
      </div>

      <Field label="Property address">
        <Input name="property_address" defaultValue={lead?.property_address} required />
      </Field>

      <Field label="Project description">
        <Textarea
          name="project_description"
          defaultValue={lead?.project_description || ""}
          placeholder="Describe the excavation work, access constraints, timeline, and any known site conditions."
        />
      </Field>

      {!publicForm ? (
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Lead status">
            <Select name="status" defaultValue={lead?.status || "new"}>
              {leadStatuses.map((status) => (
                <option key={status} value={status}>
                  {titleCase(status)}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Internal notes">
            <Textarea name="notes" defaultValue={lead?.notes || ""} />
          </Field>
        </div>
      ) : (
        <Field label="Photos or documents" hint="Upload site photos, drawings, or PDFs up to 10 MB each.">
          <Input name="attachments" type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" />
        </Field>
      )}

      {!publicForm && !lead ? (
        <Field label="Photos or documents" hint="Optional; additional files can be added from the lead detail page.">
          <Input name="attachments" type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" />
        </Field>
      ) : null}

      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
