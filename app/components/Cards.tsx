import Link from "next/link";
import { ArrowRight, CalendarDays, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { formatCurrency, type Invoice, type Job, type Lead, type Proposal } from "@/app/data/mock";
import { StatusBadge } from "@/app/components/StatusBadge";

export function LeadCard({ lead }: { lead: Lead }) {
  return (
    <Link href={`/leads/${lead.id}`} className="card interactive-card">
      <div className="card-row">
        <div>
          <p className="card-kicker">{lead.jobType}</p>
          <h3>{lead.customer}</h3>
        </div>
        <StatusBadge status={lead.status} />
      </div>
      <p className="line-item">
        <MapPin size={16} aria-hidden="true" />
        {lead.address}
      </p>
      <div className="contact-grid">
        <span>
          <Phone size={15} aria-hidden="true" />
          {lead.phone}
        </span>
        <span>
          <Mail size={15} aria-hidden="true" />
          {lead.email}
        </span>
      </div>
      <div className="card-footer">
        <span>{lead.received}</span>
        <span className="arrow-link">
          Open <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export function ProposalCard({ proposal }: { proposal: Proposal }) {
  return (
    <Link href={`/proposals/${proposal.id}`} className="card interactive-card">
      <div className="card-row">
        <div>
          <p className="card-kicker">Linked lead: {proposal.linkedLead}</p>
          <h3>{proposal.title}</h3>
        </div>
        <StatusBadge status={proposal.status} />
      </div>
      <div className="metric-line">
        <span>Proposal amount</span>
        <strong>{formatCurrency(proposal.amount)}</strong>
      </div>
      <p className="line-item">
        <UserRound size={16} aria-hidden="true" />
        {proposal.customer}
      </p>
      <div className="card-footer">
        <span>{proposal.sent}</span>
        <span className="arrow-link">
          Review <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`} className="card interactive-card">
      <div className="card-row">
        <div>
          <p className="card-kicker">{job.crew}</p>
          <h3>{job.title}</h3>
        </div>
        <StatusBadge status={job.status} />
      </div>
      <p className="line-item">
        <MapPin size={16} aria-hidden="true" />
        {job.address}
      </p>
      <div className="metric-line">
        <span>Job value</span>
        <strong>{formatCurrency(job.value)}</strong>
      </div>
      <div className="card-footer">
        <span>{job.start}</span>
        <span className="arrow-link">
          Open <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export function InvoiceCard({ invoice }: { invoice: Invoice }) {
  return (
    <Link href={`/invoices/${invoice.id}`} className="card interactive-card">
      <div className="card-row">
        <div>
          <p className="card-kicker">{invoice.job}</p>
          <h3>{invoice.customer}</h3>
        </div>
        <StatusBadge status={invoice.status} />
      </div>
      <div className="invoice-grid">
        <div>
          <span>Total</span>
          <strong>{formatCurrency(invoice.total)}</strong>
        </div>
        <div>
          <span>Deposit paid</span>
          <strong>{formatCurrency(invoice.depositPaid)}</strong>
        </div>
        <div>
          <span>Balance due</span>
          <strong>{formatCurrency(invoice.balanceDue)}</strong>
        </div>
      </div>
      <div className="card-footer">
        <span>
          <CalendarDays size={15} aria-hidden="true" />
          {invoice.due}
        </span>
        <span className="arrow-link">
          View <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
