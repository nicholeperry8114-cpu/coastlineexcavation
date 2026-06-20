import type { Database } from "@/types/database";

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type LeadAttachment = Database["public"]["Tables"]["lead_attachments"]["Row"];
export type Proposal = Database["public"]["Tables"]["proposals"]["Row"];
export type ProposalLineItem = Database["public"]["Tables"]["proposal_line_items"]["Row"];
export type Job = Database["public"]["Tables"]["jobs"]["Row"];
export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
export type InvoiceLineItem = Database["public"]["Tables"]["invoice_line_items"]["Row"];
export type ActivityEvent = Database["public"]["Tables"]["activity_events"]["Row"];

export type LeadStatus = Database["public"]["Enums"]["lead_status"];
export type ProposalStatus = Database["public"]["Enums"]["proposal_status"];
export type JobStatus = Database["public"]["Enums"]["job_status"];
export type InvoiceStatus = Database["public"]["Enums"]["invoice_status"];

export type ProposalWithLeadAndItems = Proposal & {
  leads: Lead;
  proposal_line_items: ProposalLineItem[];
};

export type JobWithProposal = Job & {
  proposals: Proposal & {
    leads: Lead;
  };
};

export type InvoiceWithJobAndItems = Invoice & {
  jobs: Job;
  invoice_line_items: InvoiceLineItem[];
};
