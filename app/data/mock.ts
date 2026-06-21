export type LeadStatus = "New" | "Contacted" | "Site Visit" | "Won";
export type ProposalStatus = "Draft" | "Pending" | "Accepted" | "Rejected";
export type JobStatus = "Active" | "Final Payment Due" | "Completed";
export type InvoiceStatus = "Draft" | "Sent" | "Deposit Paid" | "Balance Due" | "Paid";

export type Lead = {
  id: string;
  customer: string;
  jobType: string;
  address: string;
  phone: string;
  email: string;
  status: LeadStatus;
  received: string;
  source: string;
  notes: string;
  estimateRange: string;
};

export type Proposal = {
  id: string;
  title: string;
  customer: string;
  linkedLead: string;
  amount: number;
  status: ProposalStatus;
  sent: string;
  scope: string;
};

export type Job = {
  id: string;
  title: string;
  customer: string;
  address: string;
  status: JobStatus;
  crew: string;
  start: string;
  value: number;
  nextStep: string;
};

export type Invoice = {
  id: string;
  customer: string;
  job: string;
  total: number;
  depositPaid: number;
  balanceDue: number;
  status: InvoiceStatus;
  due: string;
};

export const leads: Lead[] = [
  {
    id: "lead-ocean-view-drive",
    customer: "Marina Alvarez",
    jobType: "Driveway excavation",
    address: "118 Ocean View Dr, Seaside, CA",
    phone: "(831) 555-0148",
    email: "marina.alvarez@example.com",
    status: "New",
    received: "Today, 8:42 AM",
    source: "Website form",
    notes: "Needs old concrete removed and base prepped before pavers arrive.",
    estimateRange: "$8k-$12k",
  },
  {
    id: "lead-harbor-lane",
    customer: "Carter Finch",
    jobType: "Drainage trenching",
    address: "42 Harbor Ln, Monterey, CA",
    phone: "(831) 555-0199",
    email: "carter.finch@example.com",
    status: "Site Visit",
    received: "Yesterday",
    source: "Referral",
    notes: "Standing water near garage after storms. Site walk scheduled tomorrow.",
    estimateRange: "$5k-$7k",
  },
  {
    id: "lead-cypress-court",
    customer: "Nora Bennett",
    jobType: "Foundation dig-out",
    address: "9 Cypress Ct, Carmel, CA",
    phone: "(831) 555-0171",
    email: "nora.bennett@example.com",
    status: "Contacted",
    received: "Jun 18",
    source: "Google Business",
    notes: "General contractor needs compact equipment and spoils hauled offsite.",
    estimateRange: "$18k-$24k",
  },
  {
    id: "lead-sandpiper",
    customer: "Elliot Stone",
    jobType: "Lot grading",
    address: "277 Sandpiper Rd, Aptos, CA",
    phone: "(831) 555-0124",
    email: "elliot.stone@example.com",
    status: "Won",
    received: "Jun 14",
    source: "Repeat customer",
    notes: "Accepted rough grade proposal and asked for job schedule options.",
    estimateRange: "$14k-$18k",
  },
];

export const proposals: Proposal[] = [
  {
    id: "proposal-harbor-drainage",
    title: "Harbor Lane Drainage Trenching",
    customer: "Carter Finch",
    linkedLead: "Drainage trenching",
    amount: 6850,
    status: "Pending",
    sent: "Sent today",
    scope: "Cut trench, install drain rock, shape discharge, and compact disturbed areas.",
  },
  {
    id: "proposal-sandpiper-grade",
    title: "Sandpiper Lot Rough Grade",
    customer: "Elliot Stone",
    linkedLead: "Lot grading",
    amount: 16200,
    status: "Accepted",
    sent: "Accepted Jun 19",
    scope: "Rough grade lot, balance cut/fill, export spoils, and prep driveway approach.",
  },
  {
    id: "proposal-cypress-foundation",
    title: "Cypress Court Foundation Dig-Out",
    customer: "Nora Bennett",
    linkedLead: "Foundation dig-out",
    amount: 21800,
    status: "Draft",
    sent: "Draft updated 1h ago",
    scope: "Excavate footings, haul spoils, provide laser grade check, and compact access route.",
  },
  {
    id: "proposal-bluff-demo",
    title: "Bluff Road Retaining Prep",
    customer: "Theo Kim",
    linkedLead: "Retaining wall prep",
    amount: 9400,
    status: "Rejected",
    sent: "Rejected Jun 12",
    scope: "Bench slope, stage rock, and prep retaining wall footing zone.",
  },
];

export const jobs: Job[] = [
  {
    id: "job-sandpiper-grade",
    title: "Sandpiper Lot Rough Grade",
    customer: "Elliot Stone",
    address: "277 Sandpiper Rd, Aptos, CA",
    status: "Active",
    crew: "Crew A + skid steer",
    start: "Today, 7:00 AM",
    value: 16200,
    nextStep: "Finish pad compaction and upload progress photos.",
  },
  {
    id: "job-dune-retaining",
    title: "Dune Vista Retaining Prep",
    customer: "Hayes Family Trust",
    address: "601 Dune Vista Way, Santa Cruz, CA",
    status: "Final Payment Due",
    crew: "Closeout",
    start: "Completed Jun 20",
    value: 12750,
    nextStep: "Collect final balance after walkthrough signoff.",
  },
  {
    id: "job-breakwater-drive",
    title: "Breakwater Driveway Tear-Out",
    customer: "Priya Shah",
    address: "84 Breakwater Ave, Pacific Grove, CA",
    status: "Active",
    crew: "Crew B + dump trailer",
    start: "Tomorrow, 8:30 AM",
    value: 9800,
    nextStep: "Confirm utility marks and equipment drop-off.",
  },
  {
    id: "job-cliffside-access",
    title: "Cliffside Access Road Repair",
    customer: "Moss Beach HOA",
    address: "12 Cliffside Loop, Moss Beach, CA",
    status: "Completed",
    crew: "Crew A",
    start: "Completed Jun 17",
    value: 22100,
    nextStep: "Archived with completion photos and paid invoice.",
  },
];

export const invoices: Invoice[] = [
  {
    id: "invoice-dune-final",
    customer: "Hayes Family Trust",
    job: "Dune Vista Retaining Prep",
    total: 12750,
    depositPaid: 5100,
    balanceDue: 7650,
    status: "Balance Due",
    due: "Due today",
  },
  {
    id: "invoice-sandpiper-progress",
    customer: "Elliot Stone",
    job: "Sandpiper Lot Rough Grade",
    total: 16200,
    depositPaid: 6480,
    balanceDue: 9720,
    status: "Deposit Paid",
    due: "Progress invoice ready",
  },
  {
    id: "invoice-breakwater-deposit",
    customer: "Priya Shah",
    job: "Breakwater Driveway Tear-Out",
    total: 9800,
    depositPaid: 0,
    balanceDue: 3920,
    status: "Sent",
    due: "Deposit due Jun 23",
  },
  {
    id: "invoice-cliffside-paid",
    customer: "Moss Beach HOA",
    job: "Cliffside Access Road Repair",
    total: 22100,
    depositPaid: 22100,
    balanceDue: 0,
    status: "Paid",
    due: "Paid Jun 18",
  },
];

export const activity = [
  {
    title: "New lead received",
    detail: "Marina Alvarez requested driveway excavation.",
    time: "12 min ago",
  },
  {
    title: "Proposal accepted",
    detail: "Sandpiper Lot Rough Grade moved to job scheduling.",
    time: "1h ago",
  },
  {
    title: "Final payment due",
    detail: "Dune Vista Retaining Prep needs closeout collection.",
    time: "Today",
  },
  {
    title: "Crew note added",
    detail: "Breakwater utility markings confirmed for tomorrow.",
    time: "Yesterday",
  },
];

export const workflow = [
  { label: "Lead", count: leads.filter((lead) => lead.status !== "Won").length },
  { label: "Proposal", count: proposals.filter((proposal) => proposal.status === "Pending").length },
  { label: "Job", count: jobs.filter((job) => job.status === "Active").length },
  { label: "Invoice", count: invoices.filter((invoice) => invoice.balanceDue > 0).length },
];

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export const dashboardStats = [
  {
    label: "New Leads",
    value: leads.filter((lead) => lead.status === "New").length.toString(),
    hint: "1 arrived this morning",
  },
  {
    label: "Pending Proposals",
    value: proposals.filter((proposal) => proposal.status === "Pending").length.toString(),
    hint: formatCurrency(
      proposals
        .filter((proposal) => proposal.status === "Pending")
        .reduce((total, proposal) => total + proposal.amount, 0),
    ),
  },
  {
    label: "Active Jobs",
    value: jobs.filter((job) => job.status === "Active").length.toString(),
    hint: "2 crews scheduled",
  },
  {
    label: "Final Payments Due",
    value: invoices.filter((invoice) => invoice.status === "Balance Due").length.toString(),
    hint: formatCurrency(
      invoices
        .filter((invoice) => invoice.status === "Balance Due")
        .reduce((total, invoice) => total + invoice.balanceDue, 0),
    ),
  },
];

export const revenueThisMonth = formatCurrency(
  invoices.reduce((total, invoice) => total + invoice.depositPaid, 0),
);
