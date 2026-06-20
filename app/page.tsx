import { ArrowRight, CheckCircle2, ClipboardList, FileText, Hammer, ReceiptText } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";

const workflow = [
  { label: "Capture leads", icon: ClipboardList },
  { label: "Send proposals", icon: FileText },
  { label: "Manage jobs", icon: Hammer },
  { label: "Invoice work", icon: ReceiptText }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <nav className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Coastline</p>
            <p className="text-2xl font-bold">Excavation</p>
          </div>
          <div className="flex gap-3">
            <ButtonLink href="/intake" variant="secondary">
              Request estimate
            </ButtonLink>
            <ButtonLink href="/login" className="bg-cyan-500 hover:bg-cyan-600">
              Admin login
            </ButtonLink>
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm text-cyan-100 ring-1 ring-white/15">
              Internal CRM and job management
            </div>
            <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
              Move excavation work from lead to paid invoice.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A focused SaaS workflow for intake, proposals, active jobs, invoices, documents, and customer-facing approval links.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/intake" className="bg-cyan-500 hover:bg-cyan-600">
                Start a project <ArrowRight className="ml-2 size-4" />
              </ButtonLink>
              <ButtonLink href="/login" variant="secondary">
                Open dashboard
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <div className="rounded-2xl bg-white p-6 text-slate-950">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Workflow</p>
                  <h2 className="text-xl font-bold">Coastline CRM</h2>
                </div>
                <CheckCircle2 className="size-8 text-emerald-500" />
              </div>
              <div className="space-y-3">
                {workflow.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{item.label}</p>
                        <p className="text-sm text-slate-500">Step {index + 1}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
