import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { uploadLeadAttachmentAction } from "@/lib/actions/leads";

export function LeadAttachmentUploader({ leadId }: { leadId: string }) {
  const action = uploadLeadAttachmentAction.bind(null, leadId);

  return (
    <form action={action} className="space-y-4">
      <Field label="Upload files" hint="Photos and PDFs are stored in Supabase Storage.">
        <Input name="attachments" type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" />
      </Field>
      <Button type="submit" variant="secondary">
        Upload attachments
      </Button>
    </form>
  );
}
