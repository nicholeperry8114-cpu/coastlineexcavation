"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/supabase/server";
import { jobSchema, type jobStatuses } from "@/lib/validation/jobs";
import { getFormString } from "@/lib/utils/strings";

function getJobInput(formData: FormData) {
  return jobSchema.parse({
    customer_name: getFormString(formData, "customer_name"),
    email: getFormString(formData, "email"),
    phone: getFormString(formData, "phone"),
    property_address: getFormString(formData, "property_address"),
    notes: getFormString(formData, "notes") || undefined,
    status: getFormString(formData, "status") || "active"
  });
}

export async function convertProposalToJobAction(proposalId: string) {
  const { supabase, user } = await requireAdmin();

  const { data: existingJob } = await supabase
    .from("jobs")
    .select("id")
    .eq("proposal_id", proposalId)
    .maybeSingle();

  if (existingJob) {
    redirect(`/dashboard/jobs/${existingJob.id}`);
  }

  const { data: proposal, error } = await supabase
    .from("proposals")
    .select("*, leads(*)")
    .eq("id", proposalId)
    .single();

  if (error || !proposal) {
    throw new Error(error?.message || "Proposal not found");
  }

  if (proposal.status !== "accepted") {
    throw new Error("Only accepted proposals can be converted to jobs.");
  }

  const lead = proposal.leads;
  const { data: job, error: insertError } = await supabase
    .from("jobs")
    .insert({
      proposal_id: proposal.id,
      customer_name: lead.customer_name,
      email: lead.email,
      phone: lead.phone,
      property_address: lead.property_address,
      notes: lead.notes,
      created_by: user.id,
      updated_by: user.id
    })
    .select("*")
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  await Promise.all([
    supabase.from("leads").update({ status: "closed", updated_by: user.id }).eq("id", lead.id),
    supabase.from("activity_events").insert({
      entity_type: "job",
      entity_id: job.id,
      action: "created",
      description: `Job ${job.job_number} created from ${proposal.proposal_number}`,
      actor_id: user.id
    })
  ]);

  revalidatePath("/dashboard/jobs");
  revalidatePath(`/dashboard/proposals/${proposalId}`);
  redirect(`/dashboard/jobs/${job.id}`);
}

export async function updateJobAction(jobId: string, formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const input = getJobInput(formData);

  const { error } = await supabase
    .from("jobs")
    .update({
      ...input,
      updated_by: user.id
    })
    .eq("id", jobId);

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from("activity_events").insert({
    entity_type: "job",
    entity_id: jobId,
    action: "updated",
    description: "Job details updated",
    actor_id: user.id
  });

  revalidatePath("/dashboard/jobs");
  redirect(`/dashboard/jobs/${jobId}`);
}

export async function updateJobStatusAction(jobId: string, formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const status = getFormString(formData, "status") as (typeof jobStatuses)[number];

  const { error } = await supabase
    .from("jobs")
    .update({
      status,
      updated_by: user.id
    })
    .eq("id", jobId);

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from("activity_events").insert({
    entity_type: "job",
    entity_id: jobId,
    action: "status_updated",
    description: `Job status changed to ${status.replace(/_/g, " ")}`,
    actor_id: user.id
  });

  revalidatePath(`/dashboard/jobs/${jobId}`);
  revalidatePath("/dashboard/jobs");
}
