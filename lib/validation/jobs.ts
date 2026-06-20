import { z } from "zod";

export const jobStatuses = ["active", "final_payment_due", "completed"] as const;

export const jobSchema = z.object({
  customer_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  property_address: z.string().min(5),
  notes: z.string().optional(),
  status: z.enum(jobStatuses).default("active")
});
