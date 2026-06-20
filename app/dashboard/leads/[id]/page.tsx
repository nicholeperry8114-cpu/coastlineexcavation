import { File, Mail, MapPin, Phone } from "lucide-react";

import { LeadAttachmentUploader } from "@/components/leads/LeadAttachmentUploader";
import { LeadStatusBadge } from "@/components/leads/LeadStatusBadge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { updateLeadStatusAction } from "@/lib/actions/leads";
import { requireAdmin } from "@/lib/supabase/server";
import { leadStatuses } from "@/lib/validation/leads";
import { formatDateTime } from "@/lib/utils/dates";
import { titleCase } from "@/lib/utils/strings";

type LeadDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const [
    { data: lead, error: leadError },
    { data: attachments },
    { data: proposals },
    { data: activity }
  ] = await Promise.all([
    supabase.from("leads").select("*").eq("id", id).single(),
    supabase.from("lead_attachments").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
    supabase.from("proposals").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
    supabase
      .from("activity_events")
      .select("*")
      .eq("entity_type", "lead")
      .eq("entity_id", id)
      .order("created_at", { ascending: false })
      .limit(8)
  ]);

  if (leadError || !lead) {
    throw new Error(leadError?.message || "Lead not found");
  }

  const attachmentLinks = await Promise.all(
    (attachments || []).map(async (attachment) => {
      const { data } = await supabase.storage
        .from(attachment.bucket)
        .createSignedUrl(attachment.storage_path, 60 * 10);
      return {
        ...attachment,
        signedUrl: data?.signedUrl
      };
    })
  );

  const statusAction = updateLeadStatusAction.bind(null, lead.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">{lead.lead_number}</h1>
            <LeadStatusBadge status={lead.status} />
          </div>
          <p className="mt-2 text-slate-500">Created {formatDateTime(lead.created_at)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`/dashboard/leads/${lead.id}/edit`} variant="secondary">
            Edit lead
          </ButtonLink>
          {proposals && proposals.length > 0 ? (
            <ButtonLink href={`/dashboard/proposals/${proposals[0].id}`}>View proposal</ButtonLink>
          ) : (
            <ButtonLink href={`/dashboard/proposals/new?leadId=${lead.id}`}>Convert to proposal</ButtonLink>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>{lead.customer_name}</CardTitle>
            <CardDescription>{lead.job_type}</CardDescription>
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex gap-3 rounded-xl bg-slate-50 p-4">
              <Mail className="mt-0.5 size-4 text-cyan-700" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                <a className="text-sm font-medium text-slate-950" href={`mailto:${lead.email}`}>
                  {lead.email}
                </a>
              </div>
            </div>
            <div className="flex gap-3 rounded-xl bg-slate-50 p-4">
              <Phone className="mt-0.5 size-4 text-cyan-700" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</p>
                <a className="text-sm font-medium text-slate-950" href={`tel:${lead.phone}`}>
                  {lead.phone}
                </a>
              </div>
            </div>
            <div className="flex gap-3 rounded-xl bg-slate-50 p-4 md:col-span-2">
              <MapPin className="mt-0.5 size-4 text-cyan-700" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Address</p>
                <p className="text-sm font-medium text-slate-950">{lead.property_address}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Project description</h2>
              <p className="mt-2 whitespace-pre-wrap text-slate-700">{lead.project_description || "No description provided."}</p>
            </section>
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Internal notes</h2>
              <p className="mt-2 whitespace-pre-wrap text-slate-700">{lead.notes || "No notes yet."}</p>
            </section>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status management</CardTitle>
              <CardDescription>Update qualification progress.</CardDescription>
            </CardHeader>
            <form action={statusAction} className="flex gap-3">
              <Select name="status" defaultValue={lead.status}>
                {leadStatuses.map((status) => (
                  <option key={status} value={status}>
                    {titleCase(status)}
                  </option>
                ))}
              </Select>
              <Button type="submit">Save</Button>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
              <CardDescription>Photos and documents from intake or internal uploads.</CardDescription>
            </CardHeader>
            <div className="space-y-3">
              {attachmentLinks.length > 0 ? (
                attachmentLinks.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.signedUrl || "#"}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <File className="size-4 text-cyan-700" />
                    {attachment.file_name}
                  </a>
                ))
              ) : (
                <p className="text-sm text-slate-500">No attachments uploaded.</p>
              )}
            </div>
            <div className="mt-5 border-t border-slate-100 pt-5">
              <LeadAttachmentUploader leadId={lead.id} />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Recent changes for this lead.</CardDescription>
            </CardHeader>
            <div className="space-y-3">
              {(activity || []).length > 0 ? (
                activity?.map((event) => (
                  <div key={event.id} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-sm font-medium text-slate-900">{event.description || event.action}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDateTime(event.created_at)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No activity yet.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
