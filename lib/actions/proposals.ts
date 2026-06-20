"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/server";
import { parseLineItems } from "@/lib/validation/line-items";
import { proposalSchema, type proposalStatuses } from "@/lib/validation/proposals";
import { getFormString } from "@/lib/utils/strings";

function getProposalInput(formData: FormData) {
  const intentStatus = getFormString(formData, "intent_status");

  return proposalSchema.parse({
    lead_id: getFormString(formData, "lead_id"),
    proposal_date: getFormString(formData, "proposal_date"),
    expiration_date: getFormString(formData, "expiration_date"),
    scope_of_work: getFormString(formData, "scope_of_work"),
    status: intentStatus || getFormString(formData, "status") || "draft"
  });
}

export async function createProposalAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const input = getProposalInput(formData);
  const lineItems = parseLineItems(formData);

  if (lineItems.length === 0) {
    throw new Error("At least one proposal line item is required.");
  }

  const { data: proposal, error } = await supabase
    .from("proposals")
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

  const { error: lineItemError } = await supabase.from("proposal_line_items").insert(
    lineItems.map((item) => ({
      ...item,
      proposal_id: proposal.id
    }))
  );

  if (lineItemError) {
    throw new Error(lineItemError.message);
  }

  await Promise.all([
    supabase
      .from("leads")
      .update({ status: "proposal_drafted", updated_by: user.id })
      .eq("id", input.lead_id),
    supabase.from("activity_events").insert({
      entity_type: "proposal",
      entity_id: proposal.id,
      action: "created",
      description: `Proposal ${proposal.proposal_number} created`,
      actor_id: user.id
    })
  ]);

  revalidatePath("/dashboard/proposals");
  revalidatePath(`/dashboard/leads/${input.lead_id}`);
  redirect(`/dashboard/proposals/${proposal.id}`);
}

export async function updateProposalAction(proposalId: string, formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const input = getProposalInput(formData);
  const lineItems = parseLineItems(formData);

  if (lineItems.length === 0) {
    throw new Error("At least one proposal line item is required.");
  }

  const { error } = await supabase
    .from("proposals")
    .update({
      ...input,
      updated_by: user.id
    })
    .eq("id", proposalId);

  if (error) {
    throw new Error(error.message);
  }

  const { error: deleteError } = await supabase
    .from("proposal_line_items")
    .delete()
    .eq("proposal_id", proposalId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const { error: insertError } = await supabase.from("proposal_line_items").insert(
    lineItems.map((item) => ({
      ...item,
      proposal_id: proposalId
    }))
  );

  if (insertError) {
    throw new Error(insertError.message);
  }

  await supabase.from("activity_events").insert({
    entity_type: "proposal",
    entity_id: proposalId,
    action: "updated",
    description: "Proposal details updated",
    actor_id: user.id
  });

  revalidatePath("/dashboard/proposals");
  redirect(`/dashboard/proposals/${proposalId}`);
}

export async function updateProposalStatusAction(proposalId: string, formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const status = getFormString(formData, "status") as (typeof proposalStatuses)[number];
  const timestampFields =
    status === "accepted"
      ? { accepted_at: new Date().toISOString(), rejected_at: null }
      : status === "rejected"
        ? { rejected_at: new Date().toISOString(), accepted_at: null }
        : {};

  const { error } = await supabase
    .from("proposals")
    .update({
      status,
      ...timestampFields,
      updated_by: user.id
    })
    .eq("id", proposalId);

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from("activity_events").insert({
    entity_type: "proposal",
    entity_id: proposalId,
    action: "status_updated",
    description: `Proposal status changed to ${status}`,
    actor_id: user.id
  });

  revalidatePath(`/dashboard/proposals/${proposalId}`);
  revalidatePath("/dashboard/proposals");
}

export async function respondToProposalAction(token: string, response: "accepted" | "rejected") {
  const supabase = createSupabaseAdminClient();
  const requestHeaders = await headers();
  const responseIp = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const timestamp = new Date().toISOString();

  const { data: proposal, error: lookupError } = await supabase
    .from("proposals")
    .select("id, proposal_number")
    .eq("public_token", token)
    .single();

  if (lookupError || !proposal) {
    throw new Error(lookupError?.message || "Proposal not found");
  }

  const { error } = await supabase
    .from("proposals")
    .update({
      status: response,
      accepted_at: response === "accepted" ? timestamp : null,
      rejected_at: response === "rejected" ? timestamp : null,
      customer_response_ip: responseIp
    })
    .eq("id", proposal.id);

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from("activity_events").insert({
    entity_type: "proposal",
    entity_id: proposal.id,
    action: response,
    description: `Customer ${response} proposal ${proposal.proposal_number}`
  });

  revalidatePath(`/proposal/${token}`);
  redirect(`/proposal/${token}?response=${response}`);
}
