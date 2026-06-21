import { Bell, Building2, Smartphone, UserRound } from "lucide-react";
import { PageHeader, Section } from "@/app/components/PageChrome";

const settings = [
  {
    icon: Building2,
    label: "Business profile",
    value: "Coastline Excavation",
  },
  {
    icon: UserRound,
    label: "Primary contact",
    value: "Owner / estimator placeholder",
  },
  {
    icon: Bell,
    label: "Notifications",
    value: "Lead, proposal, job, invoice alerts",
  },
  {
    icon: Smartphone,
    label: "Install",
    value: "Add to iPhone Home Screen from Safari",
  },
];

export default function SettingsPage() {
  return (
    <div className="screen-stack">
      <PageHeader
        eyebrow="Prototype"
        title="Settings"
        description="Profile placeholders for a future production app. No auth, database, or backend is connected."
      />

      <Section title="Company setup">
        <div className="settings-card">
          <div className="settings-logo">
            <span>Logo placeholder</span>
          </div>
          <h3>Coastline Excavation</h3>
          <p>
            Mobile-first field operations concept for capturing leads, winning proposals, running
            jobs, and collecting invoices.
          </p>
        </div>
      </Section>

      <Section title="Profile placeholders">
        <div className="settings-list">
          {settings.map((item) => {
            const Icon = item.icon;

            return (
              <div className="settings-row" key={item.label}>
                <span className="settings-icon">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <div>
                  <h3>{item.label}</h3>
                  <p>{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <div className="prototype-note">
        <strong>Mock-only MVP</strong>
        <p>
          This build intentionally uses local sample data only. It is ready for Vercel deployment
          and iPhone home-screen testing as a clickable prototype.
        </p>
      </div>
    </div>
  );
}
