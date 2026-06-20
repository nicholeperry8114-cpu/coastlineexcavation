import { z } from "zod";

export const proposalStatuses = ["draft", "pending", "accepted", "rejected"] as const;

export const proposalSchema = z.object({
  lead_id: z.string().uuid("A linked lead is required"),
  proposal_date: z.string().min(1, "Proposal date is required"),
  expiration_date: z.string().min(1, "Expiration date is required"),
  scope_of_work: z.string().min(10, "Scope of work is required"),
  status: z.enum(proposalStatuses).default("draft")
});

export type ProposalInput = z.infer<typeof proposalSchema>;
