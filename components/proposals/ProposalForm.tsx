import { LineItemsEditor } from "@/components/forms/LineItemsEditor";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { proposalStatuses } from "@/lib/validation/proposals";
import { addDaysIsoDate, todayIsoDate } from "@/lib/utils/dates";
import { titleCase } from "@/lib/utils/strings";
import type { Lead, Proposal, ProposalLineItem } from "@/types/crm";

type ProposalFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  leads: Lead[];
  proposal?: Proposal;
  lineItems?: ProposalLineItem[];
  defaultLeadId?: string;
  submitLabel?: string;
};

export function ProposalForm({
  action,
  leads,
  proposal,
  lineItems = [],
  defaultLeadId,
  submitLabel = "Save proposal"
}: ProposalFormProps) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Linked lead">
          <Select name="lead_id" defaultValue={proposal?.lead_id || defaultLeadId || ""} required>
            <option value="" disabled>
              Select lead
            </option>
            {leads.map((lead) => (
              <option key={lead.id} value={lead.id}>
                {lead.lead_number} - {lead.customer_name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Proposal date">
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
            name="proposal_date"
            type="date"
            defaultValue={proposal?.proposal_date || todayIsoDate()}
            required
          />
        </Field>
        <Field label="Expiration date">
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
            name="expiration_date"
            type="date"
            defaultValue={proposal?.expiration_date || addDaysIsoDate(14)}
            required
          />
        </Field>
      </div>

      <Field label="Status">
        <Select name="status" defaultValue={proposal?.status || "draft"}>
          {proposalStatuses.map((status) => (
            <option key={status} value={status}>
              {titleCase(status)}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Scope of work">
        <Textarea name="scope_of_work" defaultValue={proposal?.scope_of_work || ""} required />
      </Field>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">Line items</h2>
        <LineItemsEditor initialItems={lineItems} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit">{submitLabel}</Button>
        <Button type="submit" name="intent_status" value="pending" variant="secondary">
          Save and mark pending
        </Button>
      </div>
    </form>
  );
}
