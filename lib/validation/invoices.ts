import { z } from "zod";

export const invoiceStatuses = ["draft", "sent", "paid"] as const;

export const invoiceSchema = z.object({
  job_id: z.string().uuid("A linked job is required"),
  invoice_date: z.string().min(1, "Invoice date is required"),
  due_date: z.string().min(1, "Due date is required"),
  deposit_received_cents: z.number().min(0).default(0),
  status: z.enum(invoiceStatuses).default("draft")
});
