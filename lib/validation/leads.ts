import { z } from "zod";

export const leadStatuses = ["new", "contacted", "proposal_drafted", "closed"] as const;

export const leadSchema = z.object({
  customer_name: z.string().min(2, "Customer name is required"),
  email: z.string().email("A valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  job_type: z.string().min(2, "Job type is required"),
  property_address: z.string().min(5, "Property address is required"),
  project_description: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(leadStatuses).default("new")
});

export type LeadInput = z.infer<typeof leadSchema>;
