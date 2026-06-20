"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/server";
import { leadSchema, type leadStatuses } from "@/lib/validation/leads";
import { getFormString } from "@/lib/utils/strings";

const attachmentBucket = "lead-attachments";

function getLeadInput(formData: FormData, defaultStatus: (typeof leadStatuses)[number] = "new") {
  return leadSchema.parse({
    customer_name: getFormString(formData, "customer_name"),
    email: getFormString(formData, "email"),
    phone: getFormString(formData, "phone"),
    job_type: getFormString(formData, "job_type"),
    property_address: getFormString(formData, "property_address"),
    project_description: getFormString(formData, "project_description") || undefined,
    notes: getFormString(formData, "notes") || undefined,
    status: getFormString(formData, "status") || defaultStatus
  });
}

function getFiles(formData: FormData) {
  return formData
    .getAll("attachments")
    .filter((file): file is File => file instanceof File && file.size > 0);
}

function safeFileName(fileName: string) {
  return fileName.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "");
}

export async function createPublicLeadAction(formData: FormData) {
  const supabase = createSupabaseAdminClient();
  const input = getLeadInput(formData);

  const { data: lead, error } = await supabase.from("leads").insert(input).select("*").single();

  if (error) {
    throw new Error(error.message);
  }

  await uploadLeadFiles({
    supabase,
    leadId: lead.id,
    files: getFiles(formData),
    uploadedBy: null
  });

  await supabase.from("activity_events").insert({
    entity_type: "lead",
    entity_id: lead.id,
    action: "created",
    description: `Public lead ${lead.lead_number} submitted by ${lead.customer_name}`
  });

  revalidatePath("/dashboard/leads");
  redirect(`/intake?submitted=${encodeURIComponent(lead.lead_number)}`);
}

export async function createLeadAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const input = getLeadInput(formData);

  const { data: lead, error } = await supabase
    .from("leads")
    .insert({
      ...input,
      created_by: user.id,
      updated_by: user.id
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await uploadLeadFiles({
    supabase,
    leadId: lead.id,
    files: getFiles(formData),
    uploadedBy: user.id
  });

  await supabase.from("activity_events").insert({
    entity_type: "lead",
    entity_id: lead.id,
    action: "created",
    description: `Lead ${lead.lead_number} created for ${lead.customer_name}`,
    actor_id: user.id
  });

  revalidatePath("/dashboard/leads");
  redirect(`/dashboard/leads/${lead.id}`);
}

export async function updateLeadAction(leadId: string, formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const input = getLeadInput(formData);

  const { error } = await supabase
    .from("leads")
    .update({
      ...input,
      updated_by: user.id
    })
    .eq("id", leadId);

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from("activity_events").insert({
    entity_type: "lead",
    entity_id: leadId,
    action: "updated",
    description: "Lead details updated",
    actor_id: user.id
  });

  revalidatePath("/dashboard/leads");
  redirect(`/dashboard/leads/${leadId}`);
}

export async function updateLeadStatusAction(leadId: string, formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const status = getFormString(formData, "status") as (typeof leadStatuses)[number];

  const { error } = await supabase
    .from("leads")
    .update({
      status,
      updated_by: user.id
    })
    .eq("id", leadId);

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from("activity_events").insert({
    entity_type: "lead",
    entity_id: leadId,
    action: "status_updated",
    description: `Lead status changed to ${status.replace(/_/g, " ")}`,
    actor_id: user.id
  });

  revalidatePath(`/dashboard/leads/${leadId}`);
  revalidatePath("/dashboard/leads");
}

export async function uploadLeadAttachmentAction(leadId: string, formData: FormData) {
  const { supabase, user } = await requireAdmin();

  await uploadLeadFiles({
    supabase,
    leadId,
    files: getFiles(formData),
    uploadedBy: user.id
  });

  await supabase.from("activity_events").insert({
    entity_type: "lead",
    entity_id: leadId,
    action: "attachment_uploaded",
    description: "Lead attachments uploaded",
    actor_id: user.id
  });

  revalidatePath(`/dashboard/leads/${leadId}`);
}

async function uploadLeadFiles({
  supabase,
  leadId,
  files,
  uploadedBy
}: {
  supabase: ReturnType<typeof createSupabaseAdminClient> | Awaited<ReturnType<typeof requireAdmin>>["supabase"];
  leadId: string;
  files: File[];
  uploadedBy: string | null;
}) {
  for (const file of files) {
    const storagePath = `leads/${leadId}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage.from(attachmentBucket).upload(storagePath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false
    });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { error: attachmentError } = await supabase.from("lead_attachments").insert({
      lead_id: leadId,
      bucket: attachmentBucket,
      storage_path: storagePath,
      file_name: file.name,
      file_type: file.type || null,
      file_size: file.size,
      uploaded_by: uploadedBy
    });

    if (attachmentError) {
      throw new Error(attachmentError.message);
    }
  }
}
