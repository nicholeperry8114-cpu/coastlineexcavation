"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/supabase/server";
import { parseCurrencyToCents } from "@/lib/utils/currency";
import { getFormString } from "@/lib/utils/strings";
import { invoiceSchema, type invoiceStatuses } from "@/lib/validation/invoices";
import { parseLineItems } from "@/lib/validation/line-items";

function getInvoiceInput(formData: FormData) {
  const intentStatus = getFormString(formData, "intent_status");

  return invoiceSchema.parse({
    job_id: getFormString(formData, "job_id"),
    invoice_date: getFormString(formData, "invoice_date"),
    due_date: getFormString(formData, "due_date"),
    deposit_received_cents: parseCurrencyToCents(formData.get("deposit_received")),
    status: intentStatus || getFormString(formData, "status") || "draft"
  });
}

function statusTimestamps(status: (typeof invoiceStatuses)[number]) {
  if (status === "sent") {
    return { sent_at: new Date().toISOString() };
  }

  if (status === "paid") {
    return { paid_at: new Date().toISOString() };
  }

  return {};
}

export async function createInvoiceAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const input = getInvoiceInput(formData);
  const lineItems = parseLineItems(formData);

  if (lineItems.length === 0) {
    throw new Error("At least one invoice line item is required.");
  }

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      ...input,
      ...statusTimestamps(input.status),
      created_by: user.id,
      updated_by: user.id
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const { error: lineItemError } = await supabase.from("invoice_line_items").insert(
    lineItems.map((item) => ({
      ...item,
      invoice_id: invoice.id
    }))
  );

  if (lineItemError) {
    throw new Error(lineItemError.message);
  }

  await supabase.from("activity_events").insert({
    entity_type: "invoice",
    entity_id: invoice.id,
    action: "created",
    description: `Invoice ${invoice.invoice_number} created`,
    actor_id: user.id
  });

  revalidatePath("/dashboard/invoices");
  revalidatePath(`/dashboard/jobs/${input.job_id}`);
  redirect(`/dashboard/invoices/${invoice.id}`);
}

export async function updateInvoiceAction(invoiceId: string, formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const input = getInvoiceInput(formData);
  const lineItems = parseLineItems(formData);

  if (lineItems.length === 0) {
    throw new Error("At least one invoice line item is required.");
  }

  const { error } = await supabase
    .from("invoices")
    .update({
      ...input,
      ...statusTimestamps(input.status),
      updated_by: user.id
    })
    .eq("id", invoiceId);

  if (error) {
    throw new Error(error.message);
  }

  const { error: deleteError } = await supabase
    .from("invoice_line_items")
    .delete()
    .eq("invoice_id", invoiceId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  const { error: insertError } = await supabase.from("invoice_line_items").insert(
    lineItems.map((item) => ({
      ...item,
      invoice_id: invoiceId
    }))
  );

  if (insertError) {
    throw new Error(insertError.message);
  }

  await supabase.from("activity_events").insert({
    entity_type: "invoice",
    entity_id: invoiceId,
    action: "updated",
    description: "Invoice details updated",
    actor_id: user.id
  });

  revalidatePath("/dashboard/invoices");
  redirect(`/dashboard/invoices/${invoiceId}`);
}

export async function updateInvoiceStatusAction(invoiceId: string, formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const status = getFormString(formData, "status") as (typeof invoiceStatuses)[number];

  const { error } = await supabase
    .from("invoices")
    .update({
      status,
      ...statusTimestamps(status),
      updated_by: user.id
    })
    .eq("id", invoiceId);

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from("activity_events").insert({
    entity_type: "invoice",
    entity_id: invoiceId,
    action: "status_updated",
    description: `Invoice status changed to ${status}`,
    actor_id: user.id
  });

  revalidatePath(`/dashboard/invoices/${invoiceId}`);
  revalidatePath("/dashboard/invoices");
}
