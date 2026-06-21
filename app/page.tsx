import Link from "next/link";
import { ArrowRight, Banknote, ClipboardPlus, FilePlus2, HardHat, Plus } from "lucide-react";
import { Section } from "@/app/components/PageChrome";
import {
  activity,
  dashboardStats,
  formatCurrency,
  invoices,
  jobs,
  leads,
  proposals,
  revenueThisMonth,
  workflow,
} from "@/app/data/mock";
import { StatusBadge } from "@/app/components/StatusBadge";

const quickActions = [
  { label: "New Lead", href: "/leads", icon: ClipboardPlus },
  { label: "Create Proposal", href: "/proposals", icon: FilePlus2 },
  { label: "Create Job", href: "/jobs", icon: HardHat },
  { label: "Create Invoice", href: "/invoices", icon: Banknote },
];

export default function DashboardPage() {
  const activeJob = jobs.find((job) => job.status === "Active");
  const paymentDue = invoices.find((invoice) => invoice.status === "Balance Due");

  return (
    <div className="screen-stack">
      <section className="hero-card">
        <div className="hero-topline">
          <p className="eyebrow">Today</p>
          <span>Jun 21</span>
        </div>
        <h2>Keep the day moving from lead to final payment.</h2>
        <p>
          Mock operations view for Coastline Excavation with live-feeling cards, status, and
          field-service actions.
        </p>
        <div className="hero-revenue">
          <span>Revenue this month</span>
          <strong>{revenueThisMonth}</strong>
        </div>
      </section>

      <div className="quick-actions" aria-label="Quick actions">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link key={action.label} href={action.href} className="quick-action">
              <span>
                <Icon size={19} aria-hidden="true" />
              </span>
              {action.label}
            </Link>
          );
        })}
      </div>

      <section className="stats-grid" aria-label="Dashboard metrics">
        {dashboardStats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
            <span>{stat.hint}</span>
          </div>
        ))}
      </section>

      <Section title="Lead to invoice flow">
        <div className="workflow-card">
          {workflow.map((step, index) => (
            <div className="workflow-step" key={step.label}>
              <div>
                <span>{step.count}</span>
              </div>
              <p>{step.label}</p>
              {index < workflow.length - 1 ? <ArrowRight size={16} aria-hidden="true" /> : null}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Today dashboard">
        <div className="today-grid">
          <Link href="/leads" className="mini-panel interactive-card">
            <div>
              <p>Newest lead</p>
              <h3>{leads[0].customer}</h3>
              <span>{leads[0].jobType}</span>
            </div>
            <StatusBadge status={leads[0].status} />
          </Link>
          <Link href="/proposals" className="mini-panel interactive-card">
            <div>
              <p>Pending proposal</p>
              <h3>{proposals[0].customer}</h3>
              <span>{formatCurrency(proposals[0].amount)}</span>
            </div>
            <StatusBadge status={proposals[0].status} />
          </Link>
          {activeJob ? (
            <Link href={`/jobs/${activeJob.id}`} className="mini-panel interactive-card">
              <div>
                <p>Active job</p>
                <h3>{activeJob.title}</h3>
                <span>{activeJob.crew}</span>
              </div>
              <StatusBadge status={activeJob.status} />
            </Link>
          ) : null}
          {paymentDue ? (
            <Link href={`/invoices/${paymentDue.id}`} className="mini-panel interactive-card">
              <div>
                <p>Final payment due</p>
                <h3>{paymentDue.customer}</h3>
                <span>{formatCurrency(paymentDue.balanceDue)}</span>
              </div>
              <StatusBadge status={paymentDue.status} />
            </Link>
          ) : null}
        </div>
      </Section>

      <Section title="Recent activity">
        <div className="activity-list">
          {activity.map((item) => (
            <div className="activity-item" key={item.title}>
              <div className="activity-dot">
                <Plus size={12} aria-hidden="true" />
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
              <span>{item.time}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
